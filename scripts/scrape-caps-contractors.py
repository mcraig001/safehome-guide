#!/usr/bin/env python3
"""
CAPS Contractor Scraper — SafeAtHome Guide

Scrapes the NAHB CAPS (Certified Aging-in-Place Specialist) public directory.
Stores certified contractors in the sh_contractors table in Supabase.
CAPS directory is publicly available at nahb.org/find-a-member.

Run modes:
  python3 scrape-caps-contractors.py                  # all 50 states
  python3 scrape-caps-contractors.py --state TX        # single state
  python3 scrape-caps-contractors.py --dry-run         # scrape but don't write to DB
  python3 scrape-caps-contractors.py --limit 5         # first N states only (testing)

Schedule: Nightly via OpenClaw scheduler (incremental mode)
"""

import asyncio
import argparse
import os
import re
import json
import requests
from datetime import datetime, timezone
from typing import Optional, List, Tuple
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(os.environ.get('ENV_FILE', os.path.expanduser('~/ventures/.env.master')))

supabase = create_client(
    os.environ['SUPABASE_URL'],
    os.environ['SUPABASE_SERVICE_ROLE_KEY']
)

CAPS_BASE_URL = "https://www.nahb.org/find-a-member"
SLACK_API_URL = "http://localhost:3002/api/post-to-slack"

ALL_STATES = [
    ('Alabama', 'AL'), ('Alaska', 'AK'), ('Arizona', 'AZ'), ('Arkansas', 'AR'),
    ('California', 'CA'), ('Colorado', 'CO'), ('Connecticut', 'CT'), ('Delaware', 'DE'),
    ('Florida', 'FL'), ('Georgia', 'GA'), ('Hawaii', 'HI'), ('Idaho', 'ID'),
    ('Illinois', 'IL'), ('Indiana', 'IN'), ('Iowa', 'IA'), ('Kansas', 'KS'),
    ('Kentucky', 'KY'), ('Louisiana', 'LA'), ('Maine', 'ME'), ('Maryland', 'MD'),
    ('Massachusetts', 'MA'), ('Michigan', 'MI'), ('Minnesota', 'MN'), ('Mississippi', 'MS'),
    ('Missouri', 'MO'), ('Montana', 'MT'), ('Nebraska', 'NE'), ('Nevada', 'NV'),
    ('New Hampshire', 'NH'), ('New Jersey', 'NJ'), ('New Mexico', 'NM'), ('New York', 'NY'),
    ('North Carolina', 'NC'), ('North Dakota', 'ND'), ('Ohio', 'OH'), ('Oklahoma', 'OK'),
    ('Oregon', 'OR'), ('Pennsylvania', 'PA'), ('Rhode Island', 'RI'), ('South Carolina', 'SC'),
    ('South Dakota', 'SD'), ('Tennessee', 'TN'), ('Texas', 'TX'), ('Utah', 'UT'),
    ('Vermont', 'VT'), ('Virginia', 'VA'), ('Washington', 'WA'), ('West Virginia', 'WV'),
    ('Wisconsin', 'WI'), ('Wyoming', 'WY'),
]


# ── SCRAPER ───────────────────────────────────────────────────────────────────

async def scrape_state(state_name: str, state_abbr: str, page) -> list[dict]:
    """Scrape all CAPS contractors for a given state."""
    contractors = []
    url = f"{CAPS_BASE_URL}?state={state_abbr}&designation=CAPS&pageSize=100"

    try:
        await page.goto(url, wait_until='networkidle', timeout=30000)
        await page.wait_for_timeout(2000)

        # Try multiple selector patterns the NAHB site might use
        selectors = [
            '.member-card',
            '.member-result',
            '.directory-result',
            '[class*="member"]',
            '[class*="result"]',
            '.search-result',
        ]

        cards = []
        for selector in selectors:
            cards = await page.query_selector_all(selector)
            if cards:
                break

        if not cards:
            # Fallback: try to extract structured data from JSON-LD or page text
            content = await page.content()
            contractors.extend(extract_from_page_text(content, state_name, state_abbr))
            return contractors

        for card in cards:
            try:
                contractor = await extract_contractor_from_card(card, state_name, state_abbr)
                if contractor:
                    contractors.append(contractor)
            except Exception as e:
                pass  # Skip malformed cards silently

        # Handle pagination if present
        next_btn = await page.query_selector('[aria-label="Next page"], .pagination-next, a[rel="next"]')
        if next_btn and len(contractors) >= 10:
            try:
                await next_btn.click()
                await page.wait_for_load_state('networkidle', timeout=10000)
                await page.wait_for_timeout(1500)
                # Recurse for next page (simple once-more approach)
                page2_cards = []
                for selector in selectors:
                    page2_cards = await page.query_selector_all(selector)
                    if page2_cards:
                        break
                for card in page2_cards:
                    try:
                        contractor = await extract_contractor_from_card(card, state_name, state_abbr)
                        if contractor:
                            contractors.append(contractor)
                    except Exception:
                        pass
            except Exception:
                pass  # Pagination failure is non-fatal

    except Exception as e:
        print(f"  ⚠️  Error scraping {state_abbr}: {e}")

    return contractors


async def extract_contractor_from_card(card, state_name: str, state_abbr: str) -> Optional[dict]:
    """Extract contractor data from a DOM card element."""
    async def text(selector):
        el = await card.query_selector(selector)
        if el:
            return (await el.inner_text()).strip()
        return None

    # Try common field selectors
    business_name = (
        await text('.company-name') or
        await text('.business-name') or
        await text('[class*="company"]') or
        await text('h3') or
        await text('h4') or
        await text('strong')
    )

    if not business_name:
        return None

    contact_name = await text('.member-name') or await text('.contact-name') or await text('.name')
    city_raw = await text('.city') or await text('[class*="city"]') or ''
    phone_raw = await text('.phone') or await text('[class*="phone"]') or await text('a[href^="tel:"]') or ''
    email_raw = await text('.email') or await text('[class*="email"]') or ''
    website_raw = await text('.website') or ''

    # Clean phone
    phone = re.sub(r'[^\d\-\(\)\+\s]', '', phone_raw).strip() if phone_raw else None

    # Extract city
    city = city_raw.split(',')[0].strip() if city_raw else ''

    return {
        'business_name': business_name,
        'contact_name': contact_name,
        'city': city or 'Unknown',
        'state': state_name,
        'state_abbr': state_abbr,
        'phone': phone or None,
        'email': email_raw.strip() if email_raw else None,
        'website': website_raw.strip() if website_raw else None,
        'caps_certified': True,
        'listing_tier': 'free',
        'is_published': True,
        'source': 'nahb_caps_directory',
        'scraped_at': datetime.now(timezone.utc).isoformat(),
    }


def extract_from_page_text(html: str, state_name: str, state_abbr: str) -> list[dict]:
    """
    Fallback: extract contractors from JSON-LD or structured data in page HTML.
    Returns whatever we can parse.
    """
    contractors = []
    # Try JSON-LD
    matches = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
    for match in matches:
        try:
            data = json.loads(match)
            if isinstance(data, list):
                items = data
            elif isinstance(data, dict) and data.get('@type') in ('LocalBusiness', 'Organization'):
                items = [data]
            else:
                continue
            for item in items:
                if item.get('@type') in ('LocalBusiness', 'Organization', 'Contractor'):
                    addr = item.get('address', {})
                    contractors.append({
                        'business_name': item.get('name', 'Unknown'),
                        'city': addr.get('addressLocality', ''),
                        'state': state_name,
                        'state_abbr': state_abbr,
                        'phone': item.get('telephone'),
                        'website': item.get('url'),
                        'caps_certified': True,
                        'listing_tier': 'free',
                        'is_published': True,
                        'source': 'nahb_caps_directory',
                        'scraped_at': datetime.now(timezone.utc).isoformat(),
                    })
        except (json.JSONDecodeError, AttributeError):
            pass
    return contractors


# ── DATABASE UPSERT ───────────────────────────────────────────────────────────

def upsert_contractors(contractors: list[dict], dry_run: bool = False) -> int:
    """Upsert contractors to Supabase. Returns count inserted/updated."""
    if not contractors:
        return 0

    if dry_run:
        print(f"  [DRY RUN] Would upsert {len(contractors)} contractors")
        return len(contractors)

    # Deduplicate within batch
    seen = set()
    unique = []
    for c in contractors:
        key = (c['business_name'].lower(), c['city'].lower(), c['state_abbr'])
        if key not in seen:
            seen.add(key)
            unique.append(c)

    try:
        result = supabase.table('sh_contractors').upsert(
            unique,
            on_conflict='business_name,city,state_abbr'
        ).execute()
        return len(unique)
    except Exception as e:
        print(f"  ⚠️  Supabase upsert error: {e}")
        # Try inserting in smaller batches
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

async def run_scrape(states: list[tuple], dry_run: bool = False):
    """Scrape all given states and upsert to Supabase."""
    from playwright.async_api import async_playwright

    total_found = 0
    total_inserted = 0
    state_summary = []
    start_time = datetime.now()

    print(f"\n🏗️  CAPS Contractor Scraper — SafeAtHome Guide")
    print(f"   Scraping {len(states)} states {'[DRY RUN]' if dry_run else ''}")
    print(f"   Started: {start_time.strftime('%Y-%m-%d %H:%M:%S')}\n")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        )
        page = await context.new_page()
        page.set_default_timeout(30000)

        for state_name, state_abbr in states:
            print(f"  Scraping {state_name} ({state_abbr})...", end=' ', flush=True)
            contractors = await scrape_state(state_name, state_abbr, page)
            count = upsert_contractors(contractors, dry_run=dry_run)
            total_found += len(contractors)
            total_inserted += count
            state_summary.append((state_abbr, len(contractors)))
            print(f"{len(contractors)} found, {count} upserted")
            await asyncio.sleep(2)  # Polite delay between states

        await browser.close()

    elapsed = (datetime.now() - start_time).seconds
    print(f"\n✅ Scrape complete in {elapsed}s")
    print(f"   Total found:    {total_found}")
    print(f"   Total upserted: {total_inserted}")

    # States with most contractors
    top_states = sorted(state_summary, key=lambda x: x[1], reverse=True)[:5]
    print(f"\n   Top states: {', '.join(f'{s}({n})' for s, n in top_states)}")

    # Post to Slack
    if not dry_run and total_inserted > 0:
        try:
            requests.post(SLACK_API_URL, json={
                'channel': os.environ.get('SLACK_OPS_CHANNEL', ''),
                'text': (
                    f"🏗️ *CAPS scrape complete*\n"
                    f"• {total_inserted} contractors across {len(states)} states\n"
                    f"• Top: {', '.join(f'{s}({n})' for s, n in top_states)}\n"
                    f"• Duration: {elapsed}s"
                )
            }, timeout=5)
        except Exception:
            pass  # Slack failure is non-fatal

    return total_inserted


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Scrape NAHB CAPS contractor directory')
    parser.add_argument('--state', help='Single state abbreviation (e.g. TX)')
    parser.add_argument('--dry-run', action='store_true', help='Scrape but skip DB write')
    parser.add_argument('--limit', type=int, help='Limit to first N states (for testing)')
    args = parser.parse_args()

    if args.state:
        states_to_scrape = [(name, abbr) for name, abbr in ALL_STATES if abbr == args.state.upper()]
        if not states_to_scrape:
            print(f"❌ Unknown state: {args.state}")
            exit(1)
    else:
        states_to_scrape = ALL_STATES

    if args.limit:
        states_to_scrape = states_to_scrape[:args.limit]

    asyncio.run(run_scrape(states_to_scrape, dry_run=args.dry_run))
