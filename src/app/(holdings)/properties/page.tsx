import Link from "next/link";

import { safeFetch } from "../../../../sanity/lib/client";
import { AVAILABLE_PROPERTIES_QUERY, SOLD_PROPERTIES_QUERY } from "../../../../sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { PageHero } from "@/components/layout/PageHero";
import { PropertyListingCard, type PropertyCard } from "@/components/marketing/PropertyListingCard";
import { urlFor } from "../../../../sanity/lib/image";
import { SUBSIDIARY_SLUGS } from "@/lib/brands";
import { FALLBACK_BRANDS } from "@/lib/fallbackContent";
import type { PropertyDoc } from "@/types/sanity";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Properties for Sale in Ghana",
  description:
    "Browse available land and property listings across Hayvora Holdings and its divisions, with locations, specifications, and current availability.",
  path: "/properties",
});

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

/** Filter pill. Same height and radius as a `sm` Button so the row lines up with the
 *  rest of the site's controls. */
function FilterPill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={`font-display inline-flex items-center rounded-full px-5 py-2.5 text-[0.8125rem] font-bold tracking-wide transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
        active
          ? "bg-brand-primary text-brand-text-on-primary shadow-soft"
          : "border border-brand-line bg-white text-brand-ink/70 hover:-translate-y-0.5 hover:border-brand-primary hover:text-brand-primary hover:shadow-soft"
      }`}
    >
      {children}
    </Link>
  );
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
    <>
      <PageHero
        art="crane"
        secondaryArt="dumpTruck"
        eyebrow="Property Listings"
        title={showSold ? "Sold properties" : "Available properties"}
        description="Land and developments from every Hayvora company. Submit a request and our team will arrange a viewing."
        breadcrumbs={[{ label: "Home", href: "/" }]}
      />

      <section className="hv-aura-bg section relative">
        <Container>
          <div className="flex flex-wrap items-center gap-2.5">
            <FilterPill href="/properties" active={!category && !showSold}>
              All
            </FilterPill>

            {SUBSIDIARY_SLUGS.map((slug) => (
              <FilterPill key={slug} href={`/properties?category=${slug}`} active={category === slug}>
                {/* Real division names rather than de-slugged text — "jhm geo consult"
                    read as a typo in the old pill row. */}
                {FALLBACK_BRANDS[slug]?.name ?? slug}
              </FilterPill>
            ))}

            <span className="ml-auto">
              <FilterPill href={showSold ? "/properties" : "/properties?view=sold"} active={showSold}>
                {showSold ? "View available" : "View sold"}
              </FilterPill>
            </span>
          </div>

          <div className="mt-12">
            {filtered.length > 0 ? (
              <Stagger gap={0.07} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((property) => (
                  <StaggerItem key={property.slug.current} y={26}>
                    <PropertyListingCard property={toCard(property)} />
                  </StaggerItem>
                ))}
              </Stagger>
            ) : (
              <div className="rounded-card border border-brand-line-soft bg-white p-12 text-center shadow-soft">
                <p className="text-brand-ink/60">
                  No properties {showSold ? "sold yet" : "available"} in this category right now — check back
                  soon.
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
