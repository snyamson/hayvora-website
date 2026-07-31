import Image from "next/image";
import Link from "next/link";

import { StatusBadge } from "@/components/ui/Badge";

export type PropertyCard = {
  slug: string;
  title: string;
  imageUrl?: string;
  categoryLabel?: string;
  location?: string;
  status: "available" | "reserved" | "sold";
  specsSummary?: string;
};

export function PropertyListingCard({ property }: { property: PropertyCard }) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block overflow-hidden rounded-card border border-black/5 bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {property.imageUrl ? (
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              property.status === "sold" ? "grayscale" : ""
            }`}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-primary/15 to-brand-accent/15" />
        )}
        <div className="absolute left-4 top-4 flex gap-2">
          <StatusBadge status={property.status} />
          {property.categoryLabel && (
            <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-wide text-brand-ink uppercase">
              {property.categoryLabel}
            </span>
          )}
        </div>
      </div>
      <div className="p-5">
        <p className="text-lg font-semibold text-brand-ink">{property.title}</p>
        {property.location && <p className="mt-1 text-sm text-brand-ink/60">{property.location}</p>}
        {property.specsSummary && <p className="mt-2 text-sm text-brand-ink/60">{property.specsSummary}</p>}
      </div>
    </Link>
  );
}
