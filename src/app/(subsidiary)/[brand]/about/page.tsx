import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY } from "../../../../../sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Motion";
import { DIVISION_ART } from "@/components/ui/BlueprintArt";
import { PageHero } from "@/components/layout/PageHero";
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
    <>
      <PageHero
        art={DIVISION_ART[brandSlug]?.primary}
        secondaryArt={DIVISION_ART[brandSlug]?.secondary}
        eyebrow="About"
        title={resolvedBrand.name}
        description={resolvedBrand.tagline}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: resolvedBrand.name, href: `/${brandSlug}` },
        ]}
      />

      <section className="hv-aura-bg section relative">
        <Container className="max-w-3xl">
          <Reveal>
            {resolvedBrand.about ? (
              <PortableText value={resolvedBrand.about} />
            ) : (
              <p className="text-lg leading-relaxed text-brand-ink/75">{resolvedBrand.shortDescription}</p>
            )}
          </Reveal>
        </Container>
      </section>
    </>
  );
}
