import Link from "next/link";

import { safeFetch } from "../../../../sanity/lib/client";
import { AVAILABLE_PROPERTIES_QUERY, SOLD_PROPERTIES_QUERY } from "../../../../sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PropertyListingCard, type PropertyCard } from "@/components/marketing/PropertyListingCard";
import { urlFor } from "../../../../sanity/lib/image";
import { SUBSIDIARY_SLUGS } from "@/lib/brands";
import type { PropertyDoc } from "@/types/sanity";

function toCard(property: PropertyDoc): PropertyCard {
  const specsParts = [
    property.specs?.bedrooms ? `${property.specs.bedrooms} bed` : null,
    property.specs?.bathrooms ? `${property.specs.bathrooms} bath` : null,
    property.specs?.sizeSqm ? `${property.specs.sizeSqm} sqm` : null,
    property.specs?.landSizeAcres ? `${property.specs.landSizeAcres} acres` : null,
  ].filter(Boolean);

  return {
    slug: property.slug.current,
    title: property.title,
    imageUrl: property.images?.[0] ? urlFor(property.images[0]).width(800).height(600).url() : undefined,
    categoryLabel: property.brand?.name,
    location: [property.location?.city, property.location?.region].filter(Boolean).join(", "),
    status: property.status,
    specsSummary: specsParts.join(" · ") || undefined,
  };
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; view?: string }>;
}) {
  const { category, view } = await searchParams;
  const showSold = view === "sold";

  const properties = await safeFetch<PropertyDoc[]>(
    showSold ? SOLD_PROPERTIES_QUERY : AVAILABLE_PROPERTIES_QUERY,
    {},
    ["property"],
  );

  const filtered = (properties ?? []).filter((p) => !category || p.brand?.slug?.current === category);

  return (
    <section className="pt-40 pb-24">
      <Container>
        <SectionHeading
          eyebrow="Property Listings"
          title="Available Properties"
          description="Browse listings across all Hayvora companies. Submit a request and our team will arrange a viewing."
        />

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Link
            href="/properties"
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              !category && !showSold ? "bg-brand-primary text-brand-text-on-primary" : "bg-brand-surface text-brand-ink"
            }`}
          >
            All
          </Link>
          {SUBSIDIARY_SLUGS.map((slug) => (
            <Link
              key={slug}
              href={`/properties?category=${slug}`}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
                category === slug ? "bg-brand-primary text-brand-text-on-primary" : "bg-brand-surface text-brand-ink"
              }`}
            >
              {slug.replace("-", " ")}
            </Link>
          ))}
          <Link
            href="/properties?view=sold"
            className={`ml-auto rounded-full px-4 py-2 text-sm font-medium ${
              showSold ? "bg-brand-primary text-brand-text-on-primary" : "bg-brand-surface text-brand-ink"
            }`}
          >
            View Sold
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length > 0 ? (
            filtered.map((property) => <PropertyListingCard key={property.slug.current} property={toCard(property)} />)
          ) : (
            <p className="text-brand-ink/60">
              No properties {showSold ? "sold yet" : "available"} in this category right now — check back soon.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
