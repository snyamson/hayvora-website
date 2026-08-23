import { StatusBadge } from "@/components/ui/Badge";
import { Card, CardBody, CardChip, CardMedia } from "@/components/ui/Card";

export type PropertyCard = {
  slug: string;
  title: string;
  imageUrl?: string;
  categoryLabel?: string;
  location?: string;
  status: "available" | "reserved" | "sold";
  specsSummary?: string;
};

/** Listing tile for the properties index grid. */
export function PropertyListingCard({ property }: { property: PropertyCard }) {
  return (
    <Card href={`/properties/${property.slug}`} className="h-full">
      <CardMedia
        src={property.imageUrl}
        alt={property.title}
        aspect="aspect-[4/3]"
        // Sold listings are desaturated so a browsable grid reads at a glance.
        grayscale={property.status === "sold"}
        overlay={false}
      >
        <div className="absolute top-4 right-4 left-4 flex flex-wrap items-start justify-between gap-2">
          <StatusBadge status={property.status} />
          {property.categoryLabel && <CardChip tone="onLight">{property.categoryLabel}</CardChip>}
        </div>
      </CardMedia>

      <CardBody className="gap-1.5">
        <p className="font-display text-lg font-semibold tracking-tight text-brand-ink transition-colors group-hover:text-brand-primary">
          {property.title}
        </p>
        {property.location && <p className="text-sm text-brand-ink/60">{property.location}</p>}
        {property.specsSummary && (
          <p className="mt-2 border-t border-brand-line-soft pt-3 text-sm text-brand-ink/60">
            {property.specsSummary}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
