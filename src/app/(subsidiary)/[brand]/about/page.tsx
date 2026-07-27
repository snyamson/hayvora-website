import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY } from "../../../../../sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PortableText } from "@/components/portable-text/PortableText";
import { isSubsidiarySlug } from "@/lib/brands";
import { FALLBACK_BRANDS } from "@/lib/fallbackContent";
import type { BrandDoc } from "@/types/sanity";

export default async function SubsidiaryAboutPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const brand = await safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]);
  const resolvedBrand = brand ?? FALLBACK_BRANDS[brandSlug];

  return (
    <section className="pt-40 pb-24">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="About" title={resolvedBrand.name} description={resolvedBrand.tagline} />
        <div className="mt-10">
          {resolvedBrand.about ? (
            <PortableText value={resolvedBrand.about} />
          ) : (
            <p className="leading-relaxed text-brand-ink/80">{resolvedBrand.shortDescription}</p>
          )}
        </div>
      </Container>
    </section>
  );
}
