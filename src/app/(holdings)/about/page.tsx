import { safeFetch } from "../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY } from "../../../../sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Motion";
import { PageHero } from "@/components/layout/PageHero";
import { PortableText } from "@/components/portable-text/PortableText";
import { FALLBACK_BRANDS } from "@/lib/fallbackContent";
import type { BrandDoc } from "@/types/sanity";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Hayvora Holdings",
  description:
    "Hayvora Holdings Limited is a Ghanaian multidisciplinary group delivering civil and architectural construction, geospatial consulting, and agricultural systems through three specialist divisions.",
  path: "/about",
});

export default async function HoldingsAboutPage() {
  const brand = await safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: "holdings" }, ["brand", "brand:holdings"]);
  const resolvedBrand = brand ?? FALLBACK_BRANDS.holdings;

  return (
    <>
      <PageHero
        art="crane"
        secondaryArt="totalStation"
        eyebrow="About Us"
        title={resolvedBrand.name}
        description={resolvedBrand.tagline}
        breadcrumbs={[{ label: "Home", href: "/" }]}
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
