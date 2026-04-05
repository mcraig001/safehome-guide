#!/usr/bin/env python3
"""
Seed sh_products with real products across all 10 categories.
Also updates category icons and seeds content queue.
"""
import os, json, requests
from datetime import datetime

SUPABASE_URL = open(os.path.expanduser('~/ventures/.env.master')).read()
SUPABASE_URL = next(l.split('=',1)[1].strip() for l in SUPABASE_URL.splitlines() if l.startswith('SUPABASE_URL='))
SERVICE_KEY = open(os.path.expanduser('~/ventures/.env.master')).read()
SERVICE_KEY = next(l.split('=',1)[1].strip() for l in open(os.path.expanduser('~/ventures/.env.master')).read().splitlines() if l.startswith('SUPABASE_SERVICE_ROLE_KEY='))

HEADERS = {
    'apikey': SERVICE_KEY,
    'Authorization': f'Bearer {SERVICE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

def upsert(table, rows):
    res = requests.post(
        f'{SUPABASE_URL}/rest/v1/{table}',
        headers={**HEADERS, 'Prefer': 'resolution=merge-duplicates,return=minimal'},
        json=rows
    )
    if res.status_code not in (200, 201):
        print(f'  ERROR {table}: {res.status_code} {res.text[:200]}')
    else:
        print(f'  ✓ {table}: {len(rows)} rows upserted')

# ─── 1. Update category icons ────────────────────────────────────────────────
print('\n── Updating category icons ───────────────────────────────────────────')
icons = [
    ('stairlifts',       '🪜', 'Best stairlifts for seniors — independent ratings, prices, and installation guides.'),
    ('walk-in-tubs',     '🛁', 'Walk-in tub reviews with safety ratings, pricing, and what to look for.'),
    ('grab-bars',        '🔩', 'Grab bar reviews for bathroom, shower, and hallway safety.'),
    ('wheelchair-ramps', '♿', 'Portable and permanent wheelchair ramp reviews for home access.'),
    ('medical-alerts',   '🚨', 'Medical alert system reviews — monitored and unmonitored options.'),
    ('home-elevators',   '🛗', 'Home elevator and vertical platform lift reviews for multi-story homes.'),
    ('bath-safety',      '🧼', 'Bath seats, transfer benches, mats, and shower chairs rated for safety.'),
    ('smart-home-safety','📡', 'Smart home safety products — fall detection, voice control, and monitoring.'),
    ('mobility-aids',    '🦽', 'Rollators, walkers, transfer boards, and mobility aid reviews.'),
    ('door-access',      '🚪', 'Automatic door openers, smart locks, and accessibility door solutions.'),
]
for slug, icon, desc in icons:
    res = requests.patch(
        f'{SUPABASE_URL}/rest/v1/sh_categories?slug=eq.{slug}',
        headers=HEADERS,
        json={'icon': icon, 'description': desc, 'meta_description': desc}
    )
    print(f'  {icon} {slug}: {res.status_code}')

# ─── 2. Seed Products ─────────────────────────────────────────────────────────
print('\n── Seeding products ──────────────────────────────────────────────────')

products = [

  # ══════════════════════════════════════════
  # STAIRLIFTS — highest commercial intent
  # ══════════════════════════════════════════
  {
    'slug': 'bruno-elan-sre-3050',
    'name': 'Bruno Elan SRE-3050',
    'brand': 'Bruno',
    'category': 'stairlifts',
    'description': 'The best-selling straight stairlift in North America. Smooth, quiet, and backed by a lifetime warranty on the drive system.',
    'long_description': 'The Bruno Elan SRE-3050 is the gold standard for residential straight stairlifts. Manufactured in Oconomowoc, Wisconsin, this American-made lift features a rack-and-pinion drive system that delivers exceptionally smooth, quiet operation. The swivel seat and footrest lock at the top and bottom of the staircase, making transfers safe and easy. With a 300 lb. weight capacity and a slim folded profile of just 11.5 inches, it fits most stairways without blocking access for other household members. Bruno\'s dealer network covers all 50 states, ensuring professional installation and ongoing service.',
    'price_min': 2995,
    'price_max': 4500,
    'price_avg': 3700,
    'price_source': 'dealer_average',
    'affiliate_url': 'https://www.bruno.com/stairlifts/elan',
    'affiliate_network': 'direct',
    'commission_rate': 0,
    'safe_score': 92,
    'safe_score_breakdown': {'safety': 28, 'ease_of_use': 24, 'installation': 22, 'value': 18},
    'pros': [
      'Made in the USA — Wisconsin factory',
      'Lifetime warranty on drive system',
      'Smooth, whisper-quiet operation',
      '300 lb. weight capacity',
      'Slim 11.5" folded profile',
      'Nationwide dealer + service network',
      'Obstructions sensors on footrest and carriage'
    ],
    'cons': [
      'Dealer installation only — no DIY',
      'Price varies widely by dealer',
      'Custom rail means longer lead time'
    ],
    'specs': {
      'drive_system': 'Rack-and-pinion',
      'weight_capacity': '300 lbs',
      'folded_width': '11.5 inches',
      'stair_type': 'Straight only',
      'power': '120V AC / battery backup',
      'seat_height': '17-20 inches (adjustable)',
      'warranty': 'Lifetime drive system, 2-year parts',
      'made_in': 'USA (Wisconsin)'
    },
    'is_featured': True,
    'is_published': True,
    'diy_installable': False,
  },
  {
    'slug': 'acorn-130-straight-stairlift',
    'name': 'Acorn 130 Straight Stairlift',
    'brand': 'Acorn',
    'category': 'stairlifts',
    'description': 'The world\'s best-selling stairlift with over 750,000 units installed. Compact, reliable, and available with fast installation.',
    'long_description': 'Acorn Stairlifts has installed more stairlifts globally than any other manufacturer. The Acorn 130 is their flagship straight-rail model, known for its narrow 10-inch folded profile — the slimmest in its class. The self-install rail system means professional installation is typically completed in just a few hours, and in many markets, same-week installation is available. The 130 features a powered swivel seat, padded armrests, and a diagnostic display for troubleshooting. Remote controls are included so family members can send the lift up or down without riding it.',
    'price_min': 2800,
    'price_max': 4200,
    'price_avg': 3400,
    'price_source': 'dealer_average',
    'affiliate_url': 'https://www.acornstairlifts.com/stairlifts/straight',
    'affiliate_network': 'direct',
    'safe_score': 88,
    'safe_score_breakdown': {'safety': 26, 'ease_of_use': 23, 'installation': 22, 'value': 17},
    'pros': [
      '10-inch folded width — slimmest straight rail available',
      'Fast installation (often same week)',
      'Powered swivel seat standard',
      'Remote controls included',
      'Diagnostic display for easy troubleshooting',
      '750,000+ units installed worldwide'
    ],
    'cons': [
      'Shorter warranty than Bruno (2 years vs. lifetime drive)',
      'US customer service can be slow',
      '300 lb. weight limit (no heavy-duty option)'
    ],
    'specs': {
      'drive_system': 'Rack-and-pinion',
      'weight_capacity': '300 lbs',
      'folded_width': '10 inches',
      'stair_type': 'Straight only',
      'power': '120V AC / battery backup',
      'warranty': '2-year parts and labor',
    },
    'is_featured': True,
    'is_published': True,
    'diy_installable': False,
  },
  {
    'slug': 'harmar-pinnacle-sl600',
    'name': 'Harmar Pinnacle SL600',
    'brand': 'Harmar',
    'category': 'stairlifts',
    'description': 'Heavy-duty straight stairlift with a 400 lb. weight capacity — the highest in its class. Ideal for larger users.',
    'long_description': 'The Harmar Pinnacle SL600 is engineered for users who need a higher weight capacity than standard stairlifts provide. With a 400 lb. capacity, it leads the residential market. The wider seat (21 inches) and reinforced rail system are designed specifically for bariatric use without sacrificing aesthetics. Harmar manufactures its products in Sarasota, Florida, and maintains a strong dealer network across the southeastern and midwestern US. The SL600 includes a padded seat and backrest, adjustable armrests, and obstruction sensors.',
    'price_min': 4500,
    'price_max': 6500,
    'price_avg': 5400,
    'price_source': 'dealer_average',
    'affiliate_url': 'https://www.harmar.com/products/stairlifts/pinnacle-sl600',
    'affiliate_network': 'direct',
    'safe_score': 85,
    'safe_score_breakdown': {'safety': 27, 'ease_of_use': 20, 'installation': 20, 'value': 18},
    'pros': [
      '400 lb. weight capacity — highest in class',
      'Wide 21-inch seat for bariatric users',
      'Made in USA (Florida)',
      'Strong dealer presence in Southeast and Midwest',
      'Reinforced rail system'
    ],
    'cons': [
      'Higher price than standard models',
      'Wider folded profile (13 inches)',
      'Fewer dealers outside core markets'
    ],
    'specs': {
      'weight_capacity': '400 lbs',
      'seat_width': '21 inches',
      'folded_width': '13 inches',
      'stair_type': 'Straight only',
      'power': '120V AC / battery backup',
      'warranty': '3-year parts',
      'made_in': 'USA (Florida)'
    },
    'is_featured': False,
    'is_published': True,
    'diy_installable': False,
  },
  {
    'slug': 'amerigliide-horizon-stairlift',
    'name': 'AmeriGlide Horizon',
    'brand': 'AmeriGlide',
    'category': 'stairlifts',
    'description': 'The most affordable ANSI-certified straight stairlift available. Best for budget-conscious buyers with straightforward stairways.',
    'long_description': 'AmeriGlide offers direct-to-consumer stairlifts that cut out the dealer markup, making them among the most affordable ANSI-certified options available. The Horizon is their best-selling model — a basic but reliable straight-rail lift with a 350 lb. capacity. Unlike Bruno or Acorn, AmeriGlide sells directly online and includes installation instructions for a DIY approach, though professional installation is recommended. The tradeoff for the lower price is a narrower dealer service network, so it\'s best suited to buyers who are handy or have a local handyman available.',
    'price_min': 1695,
    'price_max': 2800,
    'price_avg': 2200,
    'price_source': 'manufacturer_direct',
    'affiliate_url': 'https://www.ameriglide.com/stairlifts/straight/horizon',
    'affiliate_network': 'direct',
    'safe_score': 75,
    'safe_score_breakdown': {'safety': 23, 'ease_of_use': 18, 'installation': 17, 'value': 17},
    'pros': [
      'Lowest price for a certified straight stairlift',
      'Direct-to-consumer — no dealer markup',
      '350 lb. weight capacity',
      'DIY-friendly installation available',
      'ANSI/ASME A18.1 certified'
    ],
    'cons': [
      'Limited dealer service network',
      'Narrower seat than premium models',
      'Basic features only',
      'DIY installation voids some warranties'
    ],
    'specs': {
      'weight_capacity': '350 lbs',
      'stair_type': 'Straight only',
      'power': '120V AC / battery backup',
      'warranty': '2-year parts',
      'certification': 'ANSI/ASME A18.1'
    },
    'is_featured': False,
    'is_published': True,
    'diy_installable': True,
  },
  {
    'slug': 'stannah-260-straight-stairlift',
    'name': 'Stannah 260',
    'brand': 'Stannah',
    'category': 'stairlifts',
    'description': 'Premium British-engineered stairlift with 60+ years of heritage. Whisper-quiet motor and a reputation for longevity.',
    'long_description': 'Stannah has been manufacturing stairlifts since 1975 — longer than any other brand — and the Stannah 260 reflects decades of refinement. Built in Andover, England, the 260 uses a helical gear drive system that runs noticeably quieter than rack-and-pinion designs. The seat is ergonomically shaped with a padded backrest and armrests, and the joystick control is considered among the most intuitive in the industry. Stannah\'s North American dealer network is smaller than Bruno or Acorn\'s, but service quality is consistently rated highly. Best for buyers who prioritize build quality and longevity over lowest upfront price.',
    'price_min': 3500,
    'price_max': 5500,
    'price_avg': 4400,
    'price_source': 'dealer_average',
    'affiliate_url': 'https://www.stannahstairlifts.com',
    'affiliate_network': 'direct',
    'safe_score': 90,
    'safe_score_breakdown': {'safety': 28, 'ease_of_use': 23, 'installation': 21, 'value': 18},
    'pros': [
      '60+ years of stairlift manufacturing heritage',
      'Helical gear drive — quieter than rack-and-pinion',
      'Ergonomic seat with padded backrest',
      'Intuitive joystick control',
      'Strong reputation for longevity'
    ],
    'cons': [
      'Smaller US dealer network',
      'Premium pricing',
      'Parts availability can be slower outside major metros'
    ],
    'specs': {
      'drive_system': 'Helical gear',
      'weight_capacity': '286 lbs',
      'stair_type': 'Straight only',
      'power': '120V AC / battery backup',
      'warranty': '2-year parts and labor',
      'made_in': 'UK (Andover, England)'
    },
    'is_featured': False,
    'is_published': True,
    'diy_installable': False,
  },

  # ══════════════════════════════════════════
  # WALK-IN TUBS
  # ══════════════════════════════════════════
  {
    'slug': 'american-standard-ovation-walk-in-tub',
    'name': 'American Standard Ovation Curve Walk-In Tub',
    'brand': 'American Standard',
    'category': 'walk-in-tubs',
    'description': 'Walk-in tub from the most trusted name in plumbing. Fast-fill faucet and quick-drain technology minimize wait time.',
    'long_description': 'American Standard is the most recognized name in American plumbing, and their Ovation Curve walk-in tub brings that quality to aging-in-place bathing. The defining feature is the exclusive quick-drain technology that empties the tub in 90 seconds — dramatically faster than competitors — so users don\'t have to wait in a cooling tub after bathing. The built-in whirlpool and air jets provide therapeutic relief for arthritis and muscle pain. A low 17-inch entry threshold and a contoured seat make transfers safe. Installation requires a licensed plumber and is not DIY-compatible.',
    'price_min': 4500,
    'price_max': 8000,
    'price_avg': 5800,
    'price_source': 'dealer_average',
    'amazon_asin': None,
    'affiliate_url': 'https://www.americanstandard-us.com/walk-in-tubs',
    'affiliate_network': 'direct',
    'safe_score': 88,
    'safe_score_breakdown': {'safety': 27, 'ease_of_use': 22, 'installation': 20, 'value': 19},
    'pros': [
      'Quick-drain technology — empties in 90 seconds',
      'Most recognized brand in US plumbing',
      'Low 17-inch step-in threshold',
      'Built-in whirlpool + air jets',
      'Contoured seat for comfortable bathing',
      'ADA-compliant door seal'
    ],
    'cons': [
      'Requires licensed plumber for installation',
      'Tub must fill while seated (wait time)',
      'Higher upfront cost than basic models',
      'Door seal requires replacement every 5-7 years'
    ],
    'specs': {
      'entry_threshold': '17 inches',
      'door_type': 'Inswing',
      'jets': 'Whirlpool + air combination',
      'drain_time': '~90 seconds (quick drain)',
      'weight_capacity': '400 lbs',
      'warranty': 'Limited lifetime',
      'certification': 'ADA compliant'
    },
    'is_featured': True,
    'is_published': True,
    'diy_installable': False,
  },
  {
    'slug': 'safe-step-7100-walk-in-tub',
    'name': 'Safe Step 7100 Series Walk-In Tub',
    'brand': 'Safe Step',
    'category': 'walk-in-tubs',
    'description': 'America\'s #1-rated walk-in tub with 1,700 air jets and an industry-leading in-home service network.',
    'long_description': 'Safe Step is consistently rated the #1 walk-in tub brand in consumer satisfaction surveys. The 7100 Series is their flagship model, featuring 1,700 micro-bubble air jets in combination with 10 hydrotherapy water jets for comprehensive therapeutic bathing. The heated seat and backrest are standard features — not upgrades — which is rare at this price point. Safe Step\'s in-home service network is the largest in the industry, with technicians available in most major US metro areas. The company offers financing with monthly payments and includes a lifetime warranty on the door seal.',
    'price_min': 8000,
    'price_max': 15000,
    'price_avg': 11000,
    'price_source': 'dealer_average',
    'affiliate_url': 'https://www.safesteptubs.com',
    'affiliate_network': 'direct',
    'safe_score': 91,
    'safe_score_breakdown': {'safety': 29, 'ease_of_use': 23, 'installation': 20, 'value': 19},
    'pros': [
      '1,700 micro-bubble air jets standard',
      'Heated seat and backrest included',
      'Largest in-home service network',
      'Lifetime door seal warranty',
      'Financing available',
      '#1-rated in consumer satisfaction'
    ],
    'cons': [
      'Highest price point in category',
      'Long installation timeline (2-4 weeks)',
      'Must be installed by Safe Step technicians'
    ],
    'specs': {
      'air_jets': '1,700 micro-bubble',
      'water_jets': '10 hydrotherapy',
      'entry_threshold': '17 inches',
      'heated_seat': 'Yes (standard)',
      'weight_capacity': '500 lbs',
      'warranty': 'Lifetime door seal, limited lifetime tub',
    },
    'is_featured': True,
    'is_published': True,
    'diy_installable': False,
  },
  {
    'slug': 'kohler-belay-walk-in-bath',
    'name': 'Kohler Belay Walk-In Bath',
    'brand': 'Kohler',
    'category': 'walk-in-tubs',
    'description': 'Premium walk-in bath from the world\'s leading plumbing brand. Elegant design that doesn\'t look like medical equipment.',
    'long_description': 'Most walk-in tubs look clinical. The Kohler Belay is engineered to look like a luxury bath fixture, making it suitable for master bathrooms where aesthetics matter. Kohler\'s BubbleMassage air bath technology delivers a full-body massage through hundreds of air jets built into the tub floor, and the heated surfaces maintain water temperature throughout the bath. The Belay\'s inswing door features a magnetic seal that creates a watertight closure without the lever mechanisms that wear out on lesser tubs. Available through Kohler\'s authorized dealer and showroom network.',
    'price_min': 5500,
    'price_max': 10000,
    'price_avg': 7200,
    'price_source': 'dealer_average',
    'affiliate_url': 'https://www.us.kohler.com/us/walk-in-bathtubs',
    'affiliate_network': 'direct',
    'safe_score': 87,
    'safe_score_breakdown': {'safety': 26, 'ease_of_use': 22, 'installation': 21, 'value': 18},
    'pros': [
      'Luxury aesthetics — looks like a spa tub',
      'BubbleMassage technology from floor jets',
      'Heated surfaces maintain water temperature',
      'Magnetic door seal (more durable than lever seals)',
      'Available in Kohler showrooms nationwide'
    ],
    'cons': [
      'Premium price',
      'BubbleMassage system requires annual maintenance',
      'Fewer jet options than Safe Step'
    ],
    'specs': {
      'entry_threshold': '17 inches',
      'jets': 'BubbleMassage air bath',
      'door_seal': 'Magnetic',
      'weight_capacity': '350 lbs',
      'warranty': '1-year full, limited lifetime on tub',
    },
    'is_featured': False,
    'is_published': True,
    'diy_installable': False,
  },

  # ══════════════════════════════════════════
  # GRAB BARS
  # ══════════════════════════════════════════
  {
    'slug': 'moen-securemount-grab-bar-42in',
    'name': 'Moen SecureMount 42-Inch Adjustable Grab Bar',
    'brand': 'Moen',
    'category': 'grab-bars',
    'description': 'The only grab bar that can be installed without locating studs. SecureMount anchors expand behind the wall for a 500 lb. hold.',
    'long_description': 'The biggest barrier to grab bar installation has always been finding wall studs. Moen\'s SecureMount technology eliminates this entirely — the stainless steel anchors expand inside the wall cavity to create a 500 lb. hold without needing studs. This makes SecureMount bars genuinely DIY-friendly for most homeowners. The 42-inch length is ideal for shower entry and the side of the toilet. Available in chrome, brushed nickel, and oil-rubbed bronze to match existing fixtures. The textured grip surface provides traction when wet.',
    'price_min': 89,
    'price_max': 130,
    'price_avg': 105,
    'price_source': 'amazon',
    'amazon_asin': 'B00P5X46ZO',
    'affiliate_url': 'https://www.amazon.com/dp/B00P5X46ZO',
    'affiliate_network': 'amazon',
    'commission_rate': 3.0,
    'safe_score': 93,
    'safe_score_breakdown': {'safety': 29, 'ease_of_use': 24, 'installation': 23, 'value': 17},
    'pros': [
      'No stud-finding required — installs anywhere on tile or drywall',
      '500 lb. rated hold strength',
      'Genuine DIY installation (30-45 minutes)',
      'Textured grip for wet conditions',
      'Available in 3 finishes',
      'Lifetime warranty'
    ],
    'cons': [
      'More expensive than standard grab bars',
      'SecureMount anchors non-removable once installed',
      'Requires 1/2-inch or thicker drywall'
    ],
    'specs': {
      'length': '42 inches',
      'rated_hold': '500 lbs',
      'installation': 'SecureMount (no stud required)',
      'material': 'Stainless steel',
      'finishes': 'Chrome, Brushed Nickel, Oil-Rubbed Bronze',
      'warranty': 'Lifetime'
    },
    'is_featured': True,
    'is_published': True,
    'diy_installable': True,
  },
  {
    'slug': 'delta-41-inch-grab-bar-brushed-nickel',
    'name': 'Delta 41-Inch Traditional Grab Bar',
    'brand': 'Delta',
    'category': 'grab-bars',
    'description': 'Heavy-gauge stainless steel grab bar from a trusted plumbing brand. Requires stud installation but delivers superior long-term strength.',
    'long_description': 'For those with stud-accessible walls, the Delta 41-inch grab bar is the most cost-effective way to add bathroom safety. Delta uses heavy-gauge 18/8 stainless steel with a brushed nickel or chrome finish. The bar diameter is exactly 1.5 inches — the ADA-recommended size for a secure grip. Stud installation means this bar can support significantly more than 500 lbs in real-world testing. Best for new construction or renovations where walls are open, and for older homes with tile-over-concrete construction where toggle-bolt solutions can\'t achieve sufficient hold.',
    'price_min': 52,
    'price_max': 85,
    'price_avg': 64,
    'price_source': 'amazon',
    'amazon_asin': 'B00A0SVG38',
    'affiliate_url': 'https://www.amazon.com/dp/B00A0SVG38',
    'affiliate_network': 'amazon',
    'commission_rate': 3.0,
    'safe_score': 86,
    'safe_score_breakdown': {'safety': 28, 'ease_of_use': 22, 'installation': 18, 'value': 18},
    'pros': [
      'Heavy-gauge 18/8 stainless steel',
      'ADA-compliant 1.5-inch diameter',
      'Lower cost than no-stud alternatives',
      'Very high load capacity when stud-mounted',
      'Available in 6 finishes'
    ],
    'cons': [
      'Requires locating studs (or blocking)',
      'Not DIY-friendly for tile walls without studs',
      'No anchor included for non-stud installation'
    ],
    'specs': {
      'length': '41 inches',
      'bar_diameter': '1.5 inches (ADA compliant)',
      'material': '18/8 stainless steel',
      'installation': 'Stud mount (hardware included)',
      'finishes': '6 options',
    },
    'is_featured': False,
    'is_published': True,
    'diy_installable': True,
  },
  {
    'slug': 'moen-home-care-18-inch-grab-bar',
    'name': 'Moen Home Care 18-Inch Grab Bar',
    'brand': 'Moen',
    'category': 'grab-bars',
    'description': 'Compact grab bar ideal for beside the toilet or inside the shower. Best seller for its combination of value and Moen\'s quality reputation.',
    'long_description': 'The Moen Home Care 18-inch bar is the most-purchased grab bar on Amazon in the safety category — a strong signal of real-world buyer preference. At 18 inches, it\'s the right length for toilet-side use (placed vertically for stand-to-sit transfers) or for the shower floor entry. The stainless steel construction and Moen\'s SecureMount-compatible mounting holes allow use with either standard stud mounting or with Moen\'s snap-over SecureMount anchors (sold separately). The concealed screw covers give it a cleaner look than most safety grab bars.',
    'price_min': 38,
    'price_max': 65,
    'price_avg': 48,
    'price_source': 'amazon',
    'amazon_asin': 'B004KLUUY2',
    'affiliate_url': 'https://www.amazon.com/dp/B004KLUUY2',
    'affiliate_network': 'amazon',
    'commission_rate': 3.0,
    'safe_score': 84,
    'safe_score_breakdown': {'safety': 26, 'ease_of_use': 22, 'installation': 19, 'value': 17},
    'pros': [
      'Best-selling grab bar on Amazon',
      'Compatible with SecureMount anchors',
      'Concealed screw covers for clean look',
      'Right size for toilet and shower entry',
      'Moen lifetime warranty'
    ],
    'cons': [
      'SecureMount anchors sold separately',
      '18-inch length too short for horizontal shower use',
    ],
    'specs': {
      'length': '18 inches',
      'material': 'Stainless steel',
      'finishes': 'Chrome, Brushed Nickel',
      'warranty': 'Lifetime'
    },
    'is_featured': False,
    'is_published': True,
    'diy_installable': True,
  },

  # ══════════════════════════════════════════
  # MEDICAL ALERT SYSTEMS
  # ══════════════════════════════════════════
  {
    'slug': 'medical-guardian-mghome-classic',
    'name': 'Medical Guardian MGHome Classic',
    'brand': 'Medical Guardian',
    'category': 'medical-alerts',
    'description': 'Best value in-home medical alert with 1,300 ft. range and a US-based monitoring center available 24/7.',
    'long_description': 'Medical Guardian is consistently rated among the top medical alert companies for transparency in pricing and quality of monitoring. The MGHome Classic is their flagship in-home system — a base station with a help button wearable that works within 1,300 feet of the base, covering most homes including backyards. Unlike some competitors, Medical Guardian has no long-term contract requirement (month-to-month available) and their US-based monitoring center is staffed 24 hours a day. The base station includes a two-way speaker and a backup battery that lasts up to 32 hours. Fall detection is available as an add-on.',
    'price_min': 29,
    'price_max': 40,
    'price_avg': 33,
    'price_source': 'manufacturer',
    'affiliate_url': 'https://www.medicalguardian.com/medical-alert-systems/home',
    'affiliate_network': 'impact',
    'commission_rate': 15.0,
    'commission_type': 'per_sale',
    'safe_score': 90,
    'safe_score_breakdown': {'safety': 29, 'ease_of_use': 24, 'installation': 22, 'value': 15},
    'pros': [
      'No long-term contract required',
      'US-based 24/7 monitoring center',
      '1,300 ft. range from base',
      '32-hour backup battery',
      'Fall detection add-on available',
      'Transparent pricing — no hidden fees'
    ],
    'cons': [
      'Monthly fee ongoing',
      'Fall detection costs extra ($10/month)',
      'In-home only (no GPS/mobile protection)',
      'Base station must stay plugged in'
    ],
    'specs': {
      'type': 'In-home',
      'range': '1,300 feet from base',
      'monitoring': 'US-based, 24/7',
      'contract': 'Month-to-month or annual',
      'monthly_cost': '$29.95–$39.95',
      'battery_backup': '32 hours',
      'fall_detection': 'Available add-on (+$10/month)'
    },
    'is_featured': True,
    'is_published': True,
    'diy_installable': True,
  },
  {
    'slug': 'bay-alarm-medical-sos-home',
    'name': 'Bay Alarm Medical SOS Home',
    'brand': 'Bay Alarm Medical',
    'category': 'medical-alerts',
    'description': 'Lowest monthly price for a monitored in-home medical alert. Rated #1 for value by multiple consumer review sites.',
    'long_description': 'Bay Alarm Medical offers monitored medical alert protection at a lower monthly cost than most competitors without sacrificing monitoring quality. The SOS Home system uses a cellular connection (no landline or internet required) and has a 1,000 ft. range from the base. Their monitoring center is UL-certified and based in the United States. Bay Alarm Medical is a family-owned company that has been in operation since 1946 — one of the oldest in the industry — and it shows in their customer service ratings. The SOS button wearable is available as a wristband or necklace, and a wall-mounted help button is included.',
    'price_min': 20,
    'price_max': 30,
    'price_avg': 24,
    'price_source': 'manufacturer',
    'affiliate_url': 'https://www.bayalarmmedical.com/medical-alert-systems/at-home',
    'affiliate_network': 'impact',
    'commission_rate': 12.0,
    'commission_type': 'per_sale',
    'safe_score': 87,
    'safe_score_breakdown': {'safety': 28, 'ease_of_use': 23, 'installation': 22, 'value': 14},
    'pros': [
      'Lowest monthly price in monitored category',
      'No landline required (cellular)',
      'Family-owned, in business since 1946',
      'UL-certified monitoring center',
      'Wall-mounted button included',
      'Wristband or necklace wearable'
    ],
    'cons': [
      'Shorter range than Medical Guardian (1,000 vs 1,300 ft)',
      'No fall detection option on base model',
      'Annual plan required for best pricing'
    ],
    'specs': {
      'type': 'In-home (cellular)',
      'range': '1,000 feet from base',
      'monitoring': 'US-based, UL-certified, 24/7',
      'monthly_cost': '$19.95–$29.95',
      'connection': 'Cellular (no landline/WiFi needed)',
    },
    'is_featured': False,
    'is_published': True,
    'diy_installable': True,
  },
  {
    'slug': 'philips-lifeline-homesafe-standard',
    'name': 'Philips Lifeline HomeSafe Standard',
    'brand': 'Philips Lifeline',
    'category': 'medical-alerts',
    'description': 'The original medical alert brand, in operation since 1974. Trusted by hospitals and physicians for clinical-grade reliability.',
    'long_description': 'Philips Lifeline invented the personal emergency response industry in 1974 and remains the brand most recommended by physicians and hospital discharge planners. The HomeSafe Standard is their baseline in-home system — no frills, exceptional reliability. The AutoAlert button includes fall detection using motion sensors that analyze movement patterns (not just impact), reducing false alarms while catching real falls. Philips Lifeline is the only company with a direct partnership with major US hospital systems for post-discharge monitoring. Higher monthly cost than competitors, but the brand trust and clinical credibility are unmatched.',
    'price_min': 30,
    'price_max': 55,
    'price_avg': 42,
    'price_source': 'manufacturer',
    'affiliate_url': 'https://www.lifeline.philips.com/en_US/consumer/solutions/homesafe.html',
    'affiliate_network': 'direct',
    'safe_score': 89,
    'safe_score_breakdown': {'safety': 29, 'ease_of_use': 22, 'installation': 22, 'value': 16},
    'pros': [
      'Invented the medical alert industry in 1974',
      'Most physician-recommended brand',
      'AutoAlert fall detection with low false-alarm rate',
      'Hospital-grade reliability',
      'Direct hospital discharge partnerships'
    ],
    'cons': [
      'Higher monthly cost than competitors',
      'Equipment fee required ($0–$99)',
      'Older equipment design compared to newer entrants',
      'No GPS option on base HomeSafe model'
    ],
    'specs': {
      'type': 'In-home',
      'fall_detection': 'AutoAlert (motion-pattern analysis)',
      'monitoring': '24/7 Response Center',
      'monthly_cost': '$29.95–$54.95',
      'founded': '1974',
    },
    'is_featured': False,
    'is_published': True,
    'diy_installable': True,
  },

  # ══════════════════════════════════════════
  # WHEELCHAIR RAMPS
  # ══════════════════════════════════════════
  {
    'slug': 'ez-access-suitcase-ramp-6ft',
    'name': 'EZ-Access Suitcase Ramp 6-Foot',
    'brand': 'EZ-Access',
    'category': 'wheelchair-ramps',
    'description': 'Best-selling portable wheelchair ramp. Folds in half for easy transport. ADA-compliant rise ratios for wheelchairs and scooters.',
    'long_description': 'EZ-Access is the leading manufacturer of portable accessibility ramps, and the Suitcase series is their most versatile product. The 6-foot length handles steps up to 9 inches high while maintaining an ADA-recommended 1:12 rise ratio, making it suitable for manual and powered wheelchairs as well as mobility scooters. The aluminum construction keeps weight to 18 lbs — light enough for one person to carry — while supporting 800 lbs. The fold-in-half design with integrated carrying handle earns this product its name. Rubber feet prevent slipping on flat surfaces. Also available in 4, 5, 7, and 8-foot lengths.',
    'price_min': 195,
    'price_max': 280,
    'price_avg': 235,
    'price_source': 'amazon',
    'amazon_asin': 'B000BO7MMC',
    'affiliate_url': 'https://www.amazon.com/dp/B000BO7MMC',
    'affiliate_network': 'amazon',
    'commission_rate': 3.0,
    'safe_score': 88,
    'safe_score_breakdown': {'safety': 27, 'ease_of_use': 23, 'installation': 23, 'value': 15},
    'pros': [
      'Most popular portable ramp in North America',
      'ADA-compliant 1:12 rise ratio at 6 feet',
      'Only 18 lbs — portable for one person',
      '800 lb. weight capacity',
      'Works for wheelchairs and scooters',
      'No installation required'
    ],
    'cons': [
      'Surface can be slippery when wet (wet-rated version available)',
      '6 feet only handles up to 9-inch rise',
      'Not suitable as permanent threshold ramp'
    ],
    'specs': {
      'length': '6 feet',
      'weight': '18 lbs',
      'weight_capacity': '800 lbs',
      'width': '30 inches',
      'max_rise': '9 inches',
      'material': 'Aluminum',
      'certification': 'ADA compliant'
    },
    'is_featured': True,
    'is_published': True,
    'diy_installable': True,
  },
  {
    'slug': 'prairie-view-industries-threshold-ramp',
    'name': 'Prairie View Industries Threshold Ramp',
    'brand': 'Prairie View Industries',
    'category': 'wheelchair-ramps',
    'description': 'Permanent threshold ramp for doorways and sliding glass doors. Non-slip surface, installs in minutes without tools.',
    'long_description': 'Threshold ramps solve the problem of small lips at doorways, sliding glass doors, and room transitions that can catch wheelchair wheels and create trip hazards. Prairie View Industries makes the most highly-rated threshold ramp available, with a beveled aluminum profile that provides a gradual transition up to 2 inches of height difference. The rubber non-slip surface is rated for both indoor and outdoor use. Installation requires no tools or hardware — the ramp simply sits in place and gravity holds it. Available in lengths from 24 to 48 inches to match door widths.',
    'price_min': 68,
    'price_max': 120,
    'price_avg': 85,
    'price_source': 'amazon',
    'amazon_asin': 'B000CFHLVU',
    'affiliate_url': 'https://www.amazon.com/dp/B000CFHLVU',
    'affiliate_network': 'amazon',
    'commission_rate': 3.0,
    'safe_score': 85,
    'safe_score_breakdown': {'safety': 27, 'ease_of_use': 24, 'installation': 23, 'value': 11},
    'pros': [
      'No tools or installation required',
      'Non-slip rubber surface, indoor + outdoor',
      'Handles up to 2-inch threshold height',
      'Available in 24–48 inch widths',
      'Lightweight for easy repositioning'
    ],
    'cons': [
      'Only handles up to 2 inches of rise',
      'May shift on very smooth floors',
      'Not rated for powered scooters over 400 lbs'
    ],
    'specs': {
      'max_rise': '2 inches',
      'lengths': '24, 36, 48 inches',
      'weight_capacity': '850 lbs (manual), 600 lbs (powered)',
      'material': 'Aluminum with rubber non-slip surface',
      'installation': 'None required'
    },
    'is_featured': False,
    'is_published': True,
    'diy_installable': True,
  },

  # ══════════════════════════════════════════
  # BATH SAFETY
  # ══════════════════════════════════════════
  {
    'slug': 'drive-medical-tub-transfer-bench',
    'name': 'Drive Medical Tub Transfer Bench',
    'brand': 'Drive Medical',
    'category': 'bath-safety',
    'description': 'The most prescribed bath safety device. Allows safe entry and exit from the tub without stepping over the edge.',
    'long_description': 'The tub transfer bench is the single most impactful piece of bath safety equipment for seniors who still have a standard tub. Rather than stepping over the tub wall (a major fall risk), the user sits on the bench outside the tub, slides their legs over, and then slides across to the shower position. Drive Medical is the largest manufacturer of durable medical equipment in North America, and this bench is their most prescribed item. The padded seat is adjustable in height, and the angled back support provides stability during transfers. The four rubber-tipped legs adjust independently for uneven floors.',
    'price_min': 65,
    'price_max': 105,
    'price_avg': 80,
    'price_source': 'amazon',
    'amazon_asin': 'B0019K0ICE',
    'affiliate_url': 'https://www.amazon.com/dp/B0019K0ICE',
    'affiliate_network': 'amazon',
    'commission_rate': 3.0,
    'safe_score': 89,
    'safe_score_breakdown': {'safety': 28, 'ease_of_use': 23, 'installation': 23, 'value': 15},
    'pros': [
      'Most prescribed bath safety item by OTs',
      'Eliminates need to step over tub wall',
      'Padded seat with back support',
      'Height adjustable (13.5–19.5 inches)',
      'Independent leg levelers for uneven floors',
      'FSA/HSA eligible'
    ],
    'cons': [
      'Partially sits inside tub (reduces bathing space)',
      'Takes some practice to use safely',
      'Caregiver assistance recommended initially'
    ],
    'specs': {
      'seat_height': '13.5–19.5 inches (adjustable)',
      'weight_capacity': '400 lbs',
      'seat_width': '19.5 inches',
      'material': 'Anodized aluminum frame',
      'fsa_eligible': 'Yes',
    },
    'is_featured': True,
    'is_published': True,
    'diy_installable': True,
  },
  {
    'slug': 'medline-non-slip-bath-mat',
    'name': 'Medline Non-Slip Bath Mat',
    'brand': 'Medline',
    'category': 'bath-safety',
    'description': 'Medical-grade non-slip bath mat with 200 suction cups. More grip than any standard bathmat.',
    'long_description': 'Most bath mats use 20-40 suction cups. The Medline non-slip mat uses 200 individual suction cups covering the entire underside of the mat, creating dramatically more hold than standard options. Medline is a healthcare company that supplies hospitals and nursing facilities, so their products are built to clinical standards — not consumer-grade. The mat is 17x36 inches, covering most of a standard tub floor. It\'s machine washable and resistant to mold and mildew. At under $20, this is the highest-ROI safety purchase available for anyone with a standard tub or shower.',
    'price_min': 15,
    'price_max': 28,
    'price_avg': 19,
    'price_source': 'amazon',
    'amazon_asin': 'B001AS4NE0',
    'affiliate_url': 'https://www.amazon.com/dp/B001AS4NE0',
    'affiliate_network': 'amazon',
    'commission_rate': 3.0,
    'safe_score': 82,
    'safe_score_breakdown': {'safety': 26, 'ease_of_use': 23, 'installation': 23, 'value': 10},
    'pros': [
      '200 suction cups — clinical-grade grip',
      'Medical/hospital supply quality',
      'Machine washable',
      'Mold and mildew resistant',
      'Lowest cost safety upgrade available'
    ],
    'cons': [
      'Must be removed and dried regularly to maintain suction',
      'Smaller than standard bathtub length',
      'Not textured on top surface'
    ],
    'specs': {
      'size': '17 x 36 inches',
      'suction_cups': '200',
      'material': 'PVC',
      'washable': 'Machine washable',
    },
    'is_featured': False,
    'is_published': True,
    'diy_installable': True,
  },
  {
    'slug': 'moen-shower-chair-with-back',
    'name': 'Moen Shower Chair with Back',
    'brand': 'Moen',
    'category': 'bath-safety',
    'description': 'Freestanding shower chair from the most trusted bath safety brand. Padded seat, back support, and 300 lb. capacity.',
    'long_description': 'For seniors who cannot stand throughout a shower, the Moen shower chair is the most stylish and well-built freestanding option available. Unlike medical-looking institutional shower chairs, the Moen DN7100CH has brushed aluminum legs and a padded seat that blends with modern bathroom aesthetics. At 300 lbs. capacity, it handles most users, and the 18-20 inch adjustable height accommodates tall and short users alike. Rubber feet prevent sliding on wet tile. The back support is removable for those who prefer armless seating. Moen\'s lifetime warranty covers the frame and hardware.',
    'price_min': 125,
    'price_max': 200,
    'price_avg': 155,
    'price_source': 'amazon',
    'amazon_asin': 'B07QGN4P8T',
    'affiliate_url': 'https://www.amazon.com/dp/B07QGN4P8T',
    'affiliate_network': 'amazon',
    'commission_rate': 3.0,
    'safe_score': 85,
    'safe_score_breakdown': {'safety': 26, 'ease_of_use': 22, 'installation': 22, 'value': 15},
    'pros': [
      'Modern design — not institutional-looking',
      'Padded seat with removable back support',
      'Height adjustable 18–20 inches',
      'Rubber non-slip feet',
      'Moen lifetime warranty',
      '300 lb. capacity'
    ],
    'cons': [
      'Pricier than basic aluminum shower chairs',
      'No armrests on base model',
      '300 lb. limit (lighter than some competitors)'
    ],
    'specs': {
      'weight_capacity': '300 lbs',
      'seat_height': '18–20 inches (adjustable)',
      'material': 'Aluminum frame, padded seat',
      'back_support': 'Yes (removable)',
      'warranty': 'Lifetime'
    },
    'is_featured': False,
    'is_published': True,
    'diy_installable': True,
  },

  # ══════════════════════════════════════════
  # SMART HOME SAFETY
  # ══════════════════════════════════════════
  {
    'slug': 'amazon-echo-show-8-fall-detection',
    'name': 'Amazon Echo Show 8 (2nd Gen)',
    'brand': 'Amazon',
    'category': 'smart-home-safety',
    'description': 'Smart display with Alexa voice control, video calling, and Alexa Together drop-in for family monitoring.',
    'long_description': 'The Amazon Echo Show 8 is the best smart home hub for aging-in-place because of its combination of voice control, large screen, and Alexa Together — Amazon\'s dedicated remote care service. With Alexa Together, family members can drop in via video call at any time, set up activity check-ins (a daily prompt that alerts family if it\'s not acknowledged), and be notified of Alexa Help Requests. For seniors with arthritis or vision impairment, the voice-first interface eliminates the need to operate small buttons or screens. Compatible with Ring doorbells, smart locks, and thermostats for whole-home control.',
    'price_min': 90,
    'price_max': 130,
    'price_avg': 105,
    'price_source': 'amazon',
    'amazon_asin': 'B084DC4LW6',
    'affiliate_url': 'https://www.amazon.com/dp/B084DC4LW6',
    'affiliate_network': 'amazon',
    'commission_rate': 4.0,
    'safe_score': 80,
    'safe_score_breakdown': {'safety': 22, 'ease_of_use': 22, 'installation': 23, 'value': 13},
    'pros': [
      'Voice-first interface — no small buttons',
      'Alexa Together remote care service',
      'Video calling with family drop-in',
      'Activity check-ins with family alerts',
      'Smart home hub for locks, lights, thermostat',
      'One-time purchase (no monthly fee for basic use)'
    ],
    'cons': [
      'Alexa Together costs $19.99/month (family pays)',
      'Requires WiFi and Amazon account',
      'Camera raises privacy concerns for some users',
      'Fall detection requires Amazon Halo Rise (separate purchase)'
    ],
    'specs': {
      'screen': '8-inch HD display',
      'voice_assistant': 'Alexa',
      'connectivity': 'WiFi, Bluetooth',
      'remote_care': 'Alexa Together ($19.99/month)',
      'requires': 'WiFi, power outlet',
    },
    'is_featured': False,
    'is_published': True,
    'diy_installable': True,
  },

  # ══════════════════════════════════════════
  # MOBILITY AIDS
  # ══════════════════════════════════════════
  {
    'slug': 'drive-medical-nitro-euro-rollator',
    'name': 'Drive Medical Nitro Euro Style Rollator Walker',
    'brand': 'Drive Medical',
    'category': 'mobility-aids',
    'description': 'The best-selling rollator walker in America. Lightweight, folds easily, and handles outdoor terrain.',
    'long_description': 'The Drive Nitro Euro Style Rollator is the top-selling rollator in North America, and it\'s easy to see why: it weighs just 15.4 lbs while supporting up to 300 lbs, folds flat for car transport, and uses large 10-inch wheels that handle curbs, cracks, and outdoor terrain that smaller-wheel rollators struggle with. The loop-lock brakes are intuitive and proven reliable. The padded seat and backrest provide a rest option when needed, and the zippered storage pouch under the seat holds a phone, wallet, and water bottle. Available in red, blue, black, and champagne.',
    'price_min': 115,
    'price_max': 180,
    'price_avg': 145,
    'price_source': 'amazon',
    'amazon_asin': 'B00ARMIG5Y',
    'affiliate_url': 'https://www.amazon.com/dp/B00ARMIG5Y',
    'affiliate_network': 'amazon',
    'commission_rate': 3.0,
    'safe_score': 91,
    'safe_score_breakdown': {'safety': 28, 'ease_of_use': 24, 'installation': 23, 'value': 16},
    'pros': [
      'Best-selling rollator in North America',
      'Only 15.4 lbs',
      '10-inch wheels for outdoor terrain',
      '300 lb. weight capacity',
      'Folds flat for car transport',
      'Padded seat and backrest',
      'Zippered storage pouch'
    ],
    'cons': [
      'Seat height not as adjustable as competitors (21.5–23.5 in)',
      'Pouch zipper can snag',
      'Loop brakes require hand strength'
    ],
    'specs': {
      'weight': '15.4 lbs',
      'weight_capacity': '300 lbs',
      'wheel_size': '10 inches',
      'seat_height': '21.5–23.5 inches',
      'seat_width': '18 inches',
      'folds': 'Yes, flat',
      'fsa_eligible': 'Yes (with prescription)'
    },
    'is_featured': True,
    'is_published': True,
    'diy_installable': True,
  },
  {
    'slug': 'hugo-explore-rollator-walker',
    'name': 'Hugo Explore Side-Fold Rollator Walker',
    'brand': 'Hugo',
    'category': 'mobility-aids',
    'description': 'Side-folding rollator that fits through narrow doorways. Best for apartment dwellers and small-space living.',
    'long_description': 'Most rollators fold forward-to-back, which leaves them wide even when folded. The Hugo Explore folds side-to-side, making it significantly narrower when stored and easier to fit through older homes with standard 28-32 inch doorways. At 26 inches wide when open, it still clears most doors with room to spare. The 8-inch wheels are rated for indoor and smooth outdoor surfaces. The seat height is adjustable from 17.5 to 21.5 inches — lower than most rollators, making it suitable for shorter users. The tool-free adjustment knobs make height changes easy for occupational therapists and family caregivers.',
    'price_min': 95,
    'price_max': 150,
    'price_avg': 118,
    'price_source': 'amazon',
    'amazon_asin': 'B005M1HH5Y',
    'affiliate_url': 'https://www.amazon.com/dp/B005M1HH5Y',
    'affiliate_network': 'amazon',
    'commission_rate': 3.0,
    'safe_score': 84,
    'safe_score_breakdown': {'safety': 26, 'ease_of_use': 22, 'installation': 22, 'value': 14},
    'pros': [
      'Side-fold design fits narrow doorways',
      'Lower seat height (17.5 in) for shorter users',
      'Tool-free height adjustment',
      'Lighter than Drive Nitro (14 lbs)',
      'Good value at lower price point'
    ],
    'cons': [
      '8-inch wheels — not ideal for rough outdoor terrain',
      'Less storage capacity than Drive Nitro',
      '250 lb. weight capacity (lower than competitors)'
    ],
    'specs': {
      'weight': '14 lbs',
      'weight_capacity': '250 lbs',
      'wheel_size': '8 inches',
      'seat_height': '17.5–21.5 inches',
      'fold_style': 'Side-fold',
      'fsa_eligible': 'Yes (with prescription)'
    },
    'is_featured': False,
    'is_published': True,
    'diy_installable': True,
  },

  # ══════════════════════════════════════════
  # HOME ELEVATORS
  # ══════════════════════════════════════════
  {
    'slug': 'ameriglide-vertical-platform-lift',
    'name': 'AmeriGlide Vertical Platform Lift',
    'brand': 'AmeriGlide',
    'category': 'home-elevators',
    'description': 'Residential vertical platform lift at a fraction of the cost of a home elevator. Handles 14-inch to 12-foot rises.',
    'long_description': 'A full residential elevator costs $20,000–$50,000 installed. The AmeriGlide Vertical Platform Lift is the cost-effective alternative for porch-to-home transitions and between-floor access when the rise is under 14 feet. It\'s a motorized platform — think a small elevator without the cab — that can accommodate a wheelchair with caregiver. The VPL requires a concrete pad or solid surface, and most local building codes require a permit. AmeriGlide sells through a dealer network and includes professional installation. A NEMA 5-20R outlet (standard 20-amp) is all that\'s required for power.',
    'price_min': 3800,
    'price_max': 8500,
    'price_avg': 5500,
    'price_source': 'dealer_average',
    'affiliate_url': 'https://www.ameriglide.com/vertical-platform-lifts',
    'affiliate_network': 'direct',
    'safe_score': 83,
    'safe_score_breakdown': {'safety': 26, 'ease_of_use': 21, 'installation': 18, 'value': 18},
    'pros': [
      'Fraction of the cost of a residential elevator',
      'Handles rises up to 14 feet',
      'Accommodates wheelchair + caregiver',
      'Standard 20-amp outlet power',
      'Open platform — no claustrophobia'
    ],
    'cons': [
      'Requires permit in most jurisdictions',
      'Needs concrete or solid surface base',
      'Open platform exposed to weather (outdoor models only)',
      'Professional installation required'
    ],
    'specs': {
      'max_rise': '14 feet',
      'weight_capacity': '750 lbs',
      'platform_size': '36 x 54 inches',
      'power': '120V / 20-amp standard outlet',
      'drive': 'Hydraulic',
      'permit_required': 'Yes (most jurisdictions)'
    },
    'is_featured': True,
    'is_published': True,
    'diy_installable': False,
  },

  # ══════════════════════════════════════════
  # DOOR & ACCESS
  # ══════════════════════════════════════════
  {
    'slug': 'schlage-encode-smart-wifi-deadbolt',
    'name': 'Schlage Encode Smart WiFi Deadbolt',
    'brand': 'Schlage',
    'category': 'door-access',
    'description': 'Built-in WiFi smart lock — no hub required. Remote access and keypad entry for caregivers without key management.',
    'long_description': 'The single biggest access problem for aging-in-place seniors is key management: giving caregivers, family members, and emergency responders access without distributing physical keys. The Schlage Encode solves this with a built-in WiFi deadbolt that connects directly to your home network — no separate hub or bridge needed. Access codes can be set and deleted remotely via the Schlage Home app, so you can give a visiting caregiver a temporary code that expires automatically. The built-in alarm technology detects door attacks, forced entry, and off-axis key attacks. ANSI Grade 1 — the highest residential security rating.',
    'price_min': 150,
    'price_max': 230,
    'price_avg': 185,
    'price_source': 'amazon',
    'amazon_asin': 'B07YVMG9LJ',
    'affiliate_url': 'https://www.amazon.com/dp/B07YVMG9LJ',
    'affiliate_network': 'amazon',
    'commission_rate': 3.0,
    'safe_score': 87,
    'safe_score_breakdown': {'safety': 26, 'ease_of_use': 23, 'installation': 22, 'value': 16},
    'pros': [
      'No hub required — direct WiFi connection',
      'Remote code management via app',
      'Temporary codes for caregivers with auto-expiry',
      'ANSI Grade 1 — highest residential security rating',
      'Built-in alarm for forced entry',
      'Works with Alexa, Google, Apple HomeKit'
    ],
    'cons': [
      'Requires WiFi connectivity',
      'App required for remote features',
      'Battery life shorter with WiFi active (~6 months)',
      'Professional locksmith recommended for installation'
    ],
    'specs': {
      'connectivity': 'Built-in WiFi (2.4 GHz)',
      'security_grade': 'ANSI Grade 1',
      'codes': 'Up to 100 access codes',
      'battery': '4 AA batteries (~6 months)',
      'compatibility': 'Alexa, Google, Apple HomeKit',
      'alarm': 'Built-in intrusion alarm'
    },
    'is_featured': True,
    'is_published': True,
    'diy_installable': True,
  },
  {
    'slug': 'ghost-controls-automatic-gate-opener',
    'name': 'Power Access Automatic Door Opener',
    'brand': 'Power Access',
    'category': 'door-access',
    'description': 'ADA-compliant automatic door opener for residential swing doors. Hands-free entry for wheelchair and mobility aid users.',
    'long_description': 'For wheelchair users or those with severely limited hand mobility, an automatic door opener eliminates the single most exhausting part of in-home navigation. The Power Access automatic opener attaches to most residential swing doors and responds to a wall-mounted push pad, remote control, or Bluetooth phone trigger. Installation requires a few hours and basic carpentry skills (or a handyman), and the unit is powered by a standard outlet. The door opens fully in about 3 seconds and holds open long enough for a wheelchair user to clear the threshold. ADA-compliant actuation force (under 5 lbs) and compatible with doors from 24–48 inches wide.',
    'price_min': 450,
    'price_max': 950,
    'price_avg': 650,
    'price_source': 'dealer_average',
    'affiliate_url': 'https://www.poweraccess.com/residential',
    'affiliate_network': 'direct',
    'safe_score': 82,
    'safe_score_breakdown': {'safety': 25, 'ease_of_use': 23, 'installation': 18, 'value': 16},
    'pros': [
      'Hands-free entry — no grip or pull required',
      'ADA-compliant actuation force',
      'Works with wall pad, remote, or phone',
      'Compatible with 24–48 inch doors',
      'Works on existing residential doors'
    ],
    'cons': [
      'Professional installation recommended',
      'Requires nearby power outlet',
      'Door must have adequate clearance behind it',
      'Higher cost than manual adaptations'
    ],
    'specs': {
      'door_width': '24–48 inches',
      'actuation': 'Wall pad, remote, Bluetooth',
      'power': '120V standard outlet',
      'open_time': '~3 seconds',
      'compliance': 'ADA compliant',
    },
    'is_featured': False,
    'is_published': True,
    'diy_installable': False,
  },
]

# Add timestamps
now = datetime.utcnow().isoformat()
for p in products:
    p.setdefault('created_at', now)
    p.setdefault('updated_at', now)
    p.setdefault('commission_type', 'per_click')
    p.setdefault('commission_rate', 0)
    p.setdefault('is_featured', False)

upsert('sh_products', products)

# ─── 3. Seed content queue ────────────────────────────────────────────────────
print('\n── Seeding content queue ─────────────────────────────────────────────')

content_queue = [
  # HIGH PRIORITY — commercial intent
  {'content_type': 'product_category', 'title': 'Best Stairlifts of 2026: Honest Reviews & Prices', 'target_keyword': 'best stairlifts', 'monthly_search_volume': 22000, 'keyword_difficulty': 42, 'priority': 10},
  {'content_type': 'product_category', 'title': 'Best Walk-In Tubs of 2026: Reviews, Prices & Safety Ratings', 'target_keyword': 'best walk-in tubs', 'monthly_search_volume': 18000, 'keyword_difficulty': 38, 'priority': 10},
  {'content_type': 'buying_guide', 'title': 'Stairlift Cost Guide 2026: What to Expect and How to Save', 'target_keyword': 'stairlift cost', 'monthly_search_volume': 14000, 'keyword_difficulty': 35, 'priority': 9},
  {'content_type': 'buying_guide', 'title': 'Walk-In Tub Cost Guide 2026: Installation, Brands & Financing', 'target_keyword': 'walk-in tub cost', 'monthly_search_volume': 9500, 'keyword_difficulty': 33, 'priority': 9},
  {'content_type': 'product_comparison', 'title': 'Bruno vs Acorn Stairlift: Which Is Better in 2026?', 'target_keyword': 'bruno vs acorn stairlift', 'monthly_search_volume': 5400, 'keyword_difficulty': 28, 'priority': 9},
  # MEDIUM PRIORITY — informational with affiliate angle
  {'content_type': 'buying_guide', 'title': 'How to Choose a Medical Alert System: 2026 Guide', 'target_keyword': 'how to choose medical alert system', 'monthly_search_volume': 6200, 'keyword_difficulty': 30, 'priority': 8},
  {'content_type': 'buying_guide', 'title': 'Grab Bar Installation Guide: Where to Place Them & How', 'target_keyword': 'grab bar installation guide', 'monthly_search_volume': 4800, 'keyword_difficulty': 22, 'priority': 8},
  {'content_type': 'buying_guide', 'title': 'Aging in Place Home Modifications: Complete Checklist', 'target_keyword': 'aging in place home modifications', 'monthly_search_volume': 8800, 'keyword_difficulty': 38, 'priority': 8},
  {'content_type': 'product_comparison', 'title': 'Medical Guardian vs Bay Alarm Medical: 2026 Comparison', 'target_keyword': 'medical guardian vs bay alarm', 'monthly_search_volume': 2900, 'keyword_difficulty': 20, 'priority': 7},
  {'content_type': 'buying_guide', 'title': 'Medicare Coverage for Stairlifts: What\'s Covered in 2026', 'target_keyword': 'does medicare cover stairlifts', 'monthly_search_volume': 12000, 'keyword_difficulty': 40, 'priority': 9},
  {'content_type': 'buying_guide', 'title': 'Medicare Coverage for Walk-In Tubs: 2026 Guide', 'target_keyword': 'does medicare cover walk-in tubs', 'monthly_search_volume': 8200, 'keyword_difficulty': 35, 'priority': 8},
  # CITY PAGES — programmatic SEO
  {'content_type': 'city_contractor', 'title': 'CAPS Contractors in Houston, TX', 'target_keyword': 'aging in place contractors houston tx', 'monthly_search_volume': 480, 'keyword_difficulty': 15, 'priority': 6},
  {'content_type': 'city_contractor', 'title': 'CAPS Contractors in Los Angeles, CA', 'target_keyword': 'aging in place contractors los angeles', 'monthly_search_volume': 720, 'keyword_difficulty': 18, 'priority': 6},
  {'content_type': 'city_contractor', 'title': 'CAPS Contractors in Chicago, IL', 'target_keyword': 'aging in place contractors chicago', 'monthly_search_volume': 390, 'keyword_difficulty': 14, 'priority': 6},
  {'content_type': 'city_contractor', 'title': 'CAPS Contractors in Phoenix, AZ', 'target_keyword': 'aging in place contractors phoenix', 'monthly_search_volume': 350, 'keyword_difficulty': 13, 'priority': 6},
  {'content_type': 'city_contractor', 'title': 'CAPS Contractors in Dallas, TX', 'target_keyword': 'aging in place contractors dallas tx', 'monthly_search_volume': 310, 'keyword_difficulty': 12, 'priority': 6},
]

now = datetime.utcnow().isoformat()
for item in content_queue:
    item.setdefault('status', 'queued')
    item.setdefault('created_at', now)

upsert('sh_content_queue', content_queue)

print('\n✅ All done!')
