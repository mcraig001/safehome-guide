const AMAZON_TRACKING_ID = process.env.AMAZON_TRACKING_ID || 'safehome00c-20';

export function buildAffiliateUrl(url: string, network: string, productSlug?: string): string {
  if (network === 'amazon') {
    const u = new URL(url);
    u.searchParams.set('tag', AMAZON_TRACKING_ID);
    return u.toString();
  }

  // Add UTM for other networks
  const u = new URL(url);
  u.searchParams.set('utm_source', 'safehomeguide');
  u.searchParams.set('utm_medium', 'affiliate');
  if (productSlug) u.searchParams.set('utm_content', productSlug);
  return u.toString();
}

export function buildAmazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TRACKING_ID}`;
}
