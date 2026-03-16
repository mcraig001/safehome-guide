export function productSchema(product: {
  name: string;
  description: string;
  image_url?: string;
  price_min?: number;
  price_max?: number;
  avg_rating?: number;
  review_count?: number;
  brand: string;
  manufacturer_url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image_url,
    brand: { '@type': 'Brand', name: product.brand },
    url: product.manufacturer_url,
    ...(product.price_min && {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: product.price_min,
        highPrice: product.price_max,
      },
    }),
    ...(product.avg_rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.avg_rating,
        reviewCount: product.review_count || 1,
      },
    }),
  };
}

export function localBusinessSchema(contractor: {
  business_name: string;
  address?: string;
  city: string;
  state: string;
  zip?: string;
  phone?: string;
  website?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: contractor.business_name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contractor.address,
      addressLocality: contractor.city,
      addressRegion: contractor.state,
      postalCode: contractor.zip,
      addressCountry: 'US',
    },
    telephone: contractor.phone,
    url: contractor.website,
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}
