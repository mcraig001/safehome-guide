import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const city = searchParams.get('city');
  const specialty = searchParams.get('specialty');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

  let query = supabase
    .from('sh_contractors')
    .select('id, business_name, contact_name, city, state, state_abbr, phone, website, caps_certified, specialties, listing_tier')
    .eq('is_published', true)
    .order('listing_tier', { ascending: false })
    .limit(limit);

  if (state) query = query.ilike('state_abbr', state);
  if (city) query = query.ilike('city', `%${city}%`);
  if (specialty) query = query.contains('specialties', [specialty]);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: 'Query failed' }, { status: 500 });

  return NextResponse.json({ contractors: data, count: data?.length || 0 });
}
