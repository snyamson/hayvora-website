import { safeFetch } from "../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY } from "../../../../sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
    <section className="pt-40 pb-24">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="About Us" title={resolvedBrand.name} description={resolvedBrand.tagline} />
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
