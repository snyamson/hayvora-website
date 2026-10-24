import Link from "next/link";

import { safeFetch } from "../../../../sanity/lib/client";
import { AVAILABLE_PROPERTIES_QUERY, SOLD_PROPERTIES_QUERY } from "../../../../sanity/lib/queries";
import { PageBanner } from "@/components/site/division/DivisionSections";
import { PropertyTile } from "@/components/site/home/HomeSections";
import { getDivisions, getHomePage, getPageText } from "@/lib/content";
import { crumbsFor } from "@/lib/pageContext";
import { toPropertyCard } from "@/lib/propertyCards";
import { buildMetadata } from "@/lib/seo";
import type { PropertyDoc } from "@/types/sanity";

export async function generateMetadata() {
  const text = await getPageText();
  return buildMetadata({ path: "/properties", seo: text?.properties?.seo });
}

/** EllisDon-style filter pill: outlined, filled green when active. */
function FilterPill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={`inline-flex h-10 items-center rounded-full px-5 text-[15px] font-semibold transition-colors duration-300 ${
        active
          ? "bg-[var(--hv-green)] text-white"
          : "border border-[var(--hv-chip-line)] bg-white text-[var(--hv-blue)] hover:border-[var(--hv-green)] hover:text-[var(--hv-green)]"
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

  const [properties, text, divisions, home] = await Promise.all([
    safeFetch<PropertyDoc[]>(showSold ? SOLD_PROPERTIES_QUERY : AVAILABLE_PROPERTIES_QUERY, {}, ["property"]),
    getPageText(),
    getDivisions(),
    getHomePage(),
  ]);
  const t = text?.properties;
  const filtered = (properties ?? []).filter((p) => !category || p.brand?.slug?.current === category);
  const title = showSold ? t?.soldTitle : t?.availableTitle;
  const { crumbs, crumbLabel } = await crumbsFor([{ label: t?.eyebrow ?? "" }]);

  return (
    <>
      <PageBanner short crumbs={crumbs} crumbLabel={crumbLabel} eyebrow={t?.eyebrow} heading={title} description={t?.description} />

      <section className="py-24">
        <div className="hv-wrap">
          <div className="flex flex-wrap items-center gap-2.5">
            {t?.allLabel && (
              <FilterPill href="/properties" active={!category && !showSold}>
                {t.allLabel}
              </FilterPill>
            )}
            {(divisions ?? []).map((d) => (
              <FilterPill
                key={d.slug.current}
                href={`/properties?category=${d.slug.current}`}
                active={category === d.slug.current}
              >
                {d.name}
              </FilterPill>
            ))}
            <span className="ml-auto">
              <FilterPill href={showSold ? "/properties" : "/properties?view=sold"} active={showSold}>
                {showSold ? t?.viewAvailableLabel : t?.viewSoldLabel}
              </FilterPill>
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <PropertyTile key={p.slug.current} property={toPropertyCard(p, t, true)} linkLabel={home?.properties?.cardLinkLabel} />
              ))}
            </div>
          ) : (
            <p className="mt-14 rounded-[20px] bg-[var(--hv-tint)] p-12 text-center text-lg text-[var(--hv-muted)]">
              {showSold ? t?.emptySold : t?.emptyAvailable}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
