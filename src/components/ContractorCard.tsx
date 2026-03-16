import { CheckCircle, Phone, Globe, MapPin } from 'lucide-react';

interface Contractor {
  id: string;
  business_name: string;
  contact_name?: string;
  city: string;
  state: string;
  phone?: string;
  website?: string;
  caps_certified: boolean;
  specialties?: string[];
  listing_tier: string;
}

export function ContractorCard({ contractor }: { contractor: Contractor }) {
  const isFeatured = contractor.listing_tier === 'featured';
  const isPremium = contractor.listing_tier === 'premium' || isFeatured;

  return (
    <div
      className={`bg-white rounded-xl p-5 border transition-shadow hover:shadow-md ${
        isFeatured ? 'border-amber-400 shadow-sm' : 'border-gray-100 shadow-sm'
      }`}
    >
      {isFeatured && (
        <div className="mb-3">
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
            Featured Listing
          </span>
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-serif font-semibold text-gray-900">{contractor.business_name}</h3>
          {contractor.contact_name && (
            <p className="text-sm text-gray-500">{contractor.contact_name}</p>
          )}
        </div>
        {contractor.caps_certified && (
          <div className="flex items-center gap-1 text-xs font-semibold shrink-0" style={{ color: '#1B4332' }}>
            <CheckCircle size={14} />
            CAPS Certified
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1.5">
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={14} className="shrink-0" />
          {contractor.city}, {contractor.state}
        </p>
        {contractor.phone && (
          <a href={`tel:${contractor.phone}`} className="flex items-center gap-2 text-sm hover:underline" style={{ color: '#1B4332' }}>
            <Phone size={14} className="shrink-0" />
            {contractor.phone}
          </a>
        )}
        {contractor.website && isPremium && (
          <a href={contractor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:underline" style={{ color: '#1B4332' }}>
            <Globe size={14} className="shrink-0" />
            Visit Website
          </a>
        )}
      </div>
      {contractor.specialties && contractor.specialties.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {contractor.specialties.slice(0, 3).map((s) => (
            <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
              {s.replace('-', ' ')}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
