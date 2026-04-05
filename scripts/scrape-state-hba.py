#!/usr/bin/env python3
"""
State HBA / CSLB Contractor Scraper — SafeAtHome Guide

Proof of concept for California. Uses the CSLB (Contractors State License Board)
public license search — the definitive public registry of all licensed CA contractors.

Why CSLB instead of HBA directories:
  - NAHB CAPS directory moved to members-only login in 2025
  - California HBA chapter sites (CBIA, BIASC, etc.) don't have public CAPS-filtered
    directories. CSLB is the most reliable, up-to-date public source for CA contractors.

Note on caps_certified flag:
  CAPS is an NAHB designation, not a CSLB license class. Contractors scraped here are
  set to caps_certified=False. Cross-reference with NAHB data when access is available.
  Contractors whose business name contains "aging in place" / "accessible" / "caps" are
  tagged as likely CAPS candidates in the notes field.

Run:
  python3 scrape-state-hba.py                # California, all search terms
  python3 scrape-state-hba.py --dry-run      # scrape but skip DB write
  python3 scrape-state-hba.py --limit 3      # first N search terms only
  python3 scrape-state-hba.py --detail       # fetch phone from each profile page (slow)
"""

import asyncio
import argparse
import os
import re
import time
from datetime import datetime, timezone
from typing import Optional
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(os.environ.get('ENV_FILE', os.path.expanduser('~/ventures/.env.master')))

supabase = create_client(
    os.environ['SUPABASE_URL'],
    os.environ['SUPABASE_SERVICE_ROLE_KEY']
)

# Search terms targeting aging-in-place and accessibility contractors in CA.
# CSLB business name search accepts partial matches.
SEARCH_TERMS = [
    'aging in place',
    'accessible home',
    'accessibility',
    'senior living',
    'home modification',
    'ada remodel',
    'barrier free',
    'universal design',
    'grab bar',
    'stairlift',
]

# Active status values from CSLB
ACTIVE_STATUSES = {'active', 'clear'}

# Keywords that suggest CAPS/aging-in-place specialization
CAPS_KEYWORDS = [
    'aging in place', 'accessible', 'accessibility', 'ada', 'barrier free',
    'senior', 'universal design', 'mobility', 'handicap', 'caps certified',
    'home modification', 'aging', 'elder', 'grab bar', 'wheelchair'
]


# ── SCRAPER ───────────────────────────────────────────────────────────────────

async def scrape_cslb_search(term: str, page) -> list[dict]:
    """Search CSLB by business name term, return list of contractor dicts."""
    contractors = []

    try:
        # Submit search via JS (form inputs are hidden behind accordion UI)
        await page.evaluate(f"""() => {{
            document.getElementById('MainContent_NextName').value = {repr(term)};
            document.getElementById('MainContent_Contractor_Business_Name_Button').click();
        }}""")

        async with page.expect_event('load', timeout=15000):
            pass
        await page.wait_for_load_state('networkidle', timeout=10000)

    except Exception as e:
        print(f"  ⚠️  Navigation error for '{term}': {e}")
        return []

    # Parse result cards — CSLB renders each contractor as a set of <td> pairs
    rows = await page.query_selector_all('table tr')

    current: dict = {}
    for row in rows:
        cells = await row.query_selector_all('td')
        if len(cells) < 2:
            continue
        key = (await cells[0].inner_text()).strip().lower().replace(' ', '_')
        val = (await cells[1].inner_text()).strip()

        if key == 'contractor_name':
            if current.get('business_name'):
                contractors.append(current)
            current = {'business_name': val}
        elif key == 'license':
            current['license_number'] = val
        elif key == 'city':
            current['city'] = val.title()
        elif key == 'status':
            current['_status'] = val.lower()
        elif key == 'name_type':
            current['_name_type'] = val

    if current.get('business_name'):
        contractors.append(current)

    # Filter: active licenses only, skip DBA duplicates
    active = [
        c for c in contractors
        if c.get('_status', '') in ACTIVE_STATUSES
        and c.get('_name_type', 'Name') == 'Name'
    ]

    return active


async def fetch_contractor_detail(license_no: str, page) -> Optional[dict]:
    """
    Fetch phone and address from a contractor's CSLB detail page.
    Only called when --detail flag is set (slow — one page per contractor).
    """
    try:
        await page.goto(
            f'https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum={license_no}',
            wait_until='networkidle', timeout=15000
        )
        detail = {}

        rows = await page.query_selector_all('table tr')
        for row in rows:
            cells = await row.query_selector_all('td')
            if len(cells) < 2:
                continue
            k = (await cells[0].inner_text()).strip().lower()
            v = (await cells[1].inner_text()).strip()
            if 'phone' in k:
                detail['phone'] = re.sub(r'[^\d\-\(\)\+\s]', '', v).strip() or None
            elif 'address' in k:
                detail['address'] = v
            elif 'zip' in k:
                detail['zip'] = v

        return detail
    except Exception:
        return None


def classify_contractor(business_name: str) -> tuple[bool, Optional[str]]:
    """
    Returns (likely_caps_specialist, notes).
    Checks if business name contains aging-in-place keywords.
    """
    name_lower = business_name.lower()
    matched = [kw for kw in CAPS_KEYWORDS if kw in name_lower]
    if matched:
        return True, f"Name matches CAPS keywords: {', '.join(matched)}"
    return False, None


def normalise(contractors: list[dict], fetch_detail: bool = False) -> list[dict]:
    """Convert raw CSLB records to sh_contractors schema."""
    now = datetime.now(timezone.utc).isoformat()
    records = []

    for c in contractors:
        name = c.get('business_name', '').strip()
        if not name:
            continue

        likely_caps, notes = classify_contractor(name)

        records.append({
            'business_name': name,
            'city': c.get('city', 'Unknown'),
            'state': 'California',
            'state_abbr': 'CA',
            'phone': c.get('phone'),
            'address': c.get('address'),
            'zip': c.get('zip'),
            'license_number': c.get('license_number'),
            'license_state': 'CA',
            'caps_certified': False,        # Requires NAHB verification
            'listing_tier': 'free',
            'is_published': True,
            'source': 'cslb_public_search',
            'scraped_at': now,
        })

    return records


# ── DATABASE UPSERT ───────────────────────────────────────────────────────────

def upsert_contractors(records: list[dict], dry_run: bool = False) -> int:
    if not records:
        return 0

    if dry_run:
        print(f"  [DRY RUN] Would upsert {len(records)} contractors")
        for r in records[:3]:
            print(f"    - {r['business_name']}, {r['city']}, CA")
        return len(records)

    # Deduplicate within batch by (business_name, city, state_abbr)
    seen = set()
    unique = []
    for r in records:
        key = (r['business_name'].lower(), r['city'].lower(), 'CA')
        if key not in seen:
            seen.add(key)
            unique.append(r)

    try:
        supabase.table('sh_contractors').upsert(
            unique, on_conflict='business_name,city,state_abbr'
        ).execute()
        return len(unique)
    except Exception as e:
        print(f"  ⚠️  Upsert error: {e}")
        # Fallback: insert in batches of 10
        inserted = 0
        for i in range(0, len(unique), 10):
            batch = unique[i:i+10]
            try:
                supabase.table('sh_contractors').upsert(
                    batch, on_conflict='business_name,city,state_abbr'
                ).execute()
                inserted += len(batch)
            except Exception as e2:
                print(f"  ⚠️  Batch {i//10+1} failed: {e2}")
        return inserted


# ── MAIN ──────────────────────────────────────────────────────────────────────

async def run(search_terms: list[str], dry_run: bool = False, fetch_detail: bool = False):
    from playwright.async_api import async_playwright

    total_found = 0
    total_inserted = 0
    seen_names: set[str] = set()
    start = datetime.now()

    print(f"\n🏗️  State HBA / CSLB Contractor Scraper — California")
    print(f"   Source: CSLB public license search (cslb.ca.gov)")
    print(f"   Terms: {len(search_terms)} | Detail fetch: {fetch_detail} | Dry run: {dry_run}")
    print(f"   Started: {start.strftime('%Y-%m-%d %H:%M:%S')}\n")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        )
        page = await context.new_page()
        page.set_default_timeout(20000)

        # Load the search page once
        await page.goto(
            'https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx',
            wait_until='networkidle', timeout=20000
        )

        all_records = []

        for term in search_terms:
            print(f"  Searching: '{term}'...", end=' ', flush=True)
            raw = await scrape_cslb_search(term, page)

            # Deduplicate across terms by license number
            new = [c for c in raw if c.get('license_number') not in seen_names and c.get('business_name') not in seen_names]
            for c in new:
                seen_names.add(c.get('license_number', ''))
                seen_names.add(c.get('business_name', ''))

            print(f"{len(raw)} found, {len(new)} new")

            if new and fetch_detail:
                for c in new:
                    if c.get('license_number'):
                        detail = await fetch_contractor_detail(c['license_number'], page)
                        if detail:
                            c.update(detail)
                        await asyncio.sleep(0.5)

            records = normalise(new)
            all_records.extend(records)
            total_found += len(new)

            # Polite delay between searches
            await asyncio.sleep(1.5)

            # Navigate back to search page for next term
            await page.goto(
                'https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx',
                wait_until='networkidle', timeout=20000
            )

        await browser.close()

    # Bulk upsert
    if all_records:
        print(f"\n  Upserting {len(all_records)} contractors to Supabase...")
        total_inserted = upsert_contractors(all_records, dry_run=dry_run)

    elapsed = (datetime.now() - start).seconds
    likely_caps = sum(1 for r in all_records if r.get('notes'))

    print(f"\n✅  Scrape complete in {elapsed}s")
    print(f"    Total found (deduplicated): {total_found}")
    print(f"    Upserted to sh_contractors: {total_inserted}")
    print(f"    Likely CAPS specialists:    {likely_caps} (keyword match)")
    print(f"    caps_certified flag:        False (requires NAHB verification)")

    return total_inserted


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Scrape CSLB for CA aging-in-place contractors')
    parser.add_argument('--dry-run', action='store_true', help='Scrape but skip DB write')
    parser.add_argument('--limit', type=int, help='Use first N search terms only')
    parser.add_argument('--detail', action='store_true', help='Fetch phone from each profile page (slow)')
    args = parser.parse_args()

    terms = SEARCH_TERMS[:args.limit] if args.limit else SEARCH_TERMS
    asyncio.run(run(terms, dry_run=args.dry_run, fetch_detail=args.detail))
