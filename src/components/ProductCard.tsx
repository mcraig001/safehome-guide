import Link from 'next/link';
import Image from 'next/image';
import { SafeScore } from './SafeScore';

interface Product {
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price_min?: number;
  price_max?: number;
  image_url?: string;
  safe_score?: number;
  is_featured?: boolean;
  affiliate_url?: string;
}

const CATEGORY_ICONS: Record<string, { icon: string; bg: string }> = {
  stairlifts: { icon: '🪜', bg: '#f0fdf4' },
  'walk-in-tubs': { icon: '🛁', bg: '#eff6ff' },
  'grab-bars': { icon: '🔩', bg: '#fefce8' },
  'wheelchair-ramps': { icon: '♿', bg: '#f0fdf4' },
  'bath-safety': { icon: '🚿', bg: '#eff6ff' },
  'home-elevators': { icon: '🛗', bg: '#fdf4ff' },
  'medical-alerts': { icon: '🚨', bg: '#fff1f2' },
  'mobility-aids': { icon: '🦽', bg: '#f0fdf4' },
  'smart-home-safety': { icon: '🏠', bg: '#f0f9ff' },
  'door-access': { icon: '🔐', bg: '#fefce8' },
};

export function ProductCard({ product }: { product: Product }) {
  const categoryMeta = CATEGORY_ICONS[product.category] ?? { icon: '🏠', bg: '#f5f5f0' };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {product.image_url ? (
        <div className="relative h-48 bg-gray-50">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-4"
          />
          {product.is_featured && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Top Pick
            </span>
          )}
        </div>
      ) : (
        <div className="h-28 flex items-center justify-center relative" style={{ backgroundColor: categoryMeta.bg }}>
          <span className="text-5xl">{categoryMeta.icon}</span>
          {product.is_featured && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Top Pick
            </span>
          )}
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">{product.brand}</p>
            <h3 className="font-serif text-lg font-semibold text-gray-900 leading-tight">{product.name}</h3>
          </div>
          {product.safe_score && <SafeScore score={product.safe_score} size="sm" />}
        </div>
        <p className="mt-2 text-gray-600 text-sm line-clamp-2">{product.description}</p>
        {(product.price_min || product.price_max) && (
          <p className="mt-3 font-mono text-sm font-medium" style={{ color: '#1B4332' }}>
            {product.price_min && product.price_max
              ? `$${product.price_min.toLocaleString()} – $${product.price_max.toLocaleString()}`
              : product.price_min
              ? `From $${product.price_min.toLocaleString()}`
              : `Up to $${product.price_max!.toLocaleString()}`}
          </p>
        )}
        <div className="mt-4 flex gap-2">
          <Link
            href={`/products/${product.category}/${product.slug}`}
            className="flex-1 text-center py-2 px-3 rounded-lg text-sm font-semibold border-2 transition-colors"
            style={{ borderColor: '#1B4332', color: '#1B4332' }}
          >
            Read Review
          </Link>
          {product.affiliate_url && (
            <a
              href={product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex-1 text-center py-2 px-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#D97706' }}
            >
              See Price
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
