import { safeFetch } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import { BRAND_BY_SLUG_QUERY } from "../../../../sanity/lib/queries";
import { PageBanner } from "@/components/site/division/DivisionSections";
import { Reveal } from "@/components/ui/Motion";
import { PortableText } from "@/components/portable-text/PortableText";
import { getPageText } from "@/lib/content";
import { crumbsFor } from "@/lib/pageContext";
import { buildMetadata } from "@/lib/seo";
import type { BrandDoc } from "@/types/sanity";
import { describe } from "@/lib/imageAlt";

const fetchHoldings = () =>
  safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: "holdings" }, ["brand", "brand:holdings"]);

export async function generateMetadata() {
  const text = await getPageText();
  return buildMetadata({ path: "/about", seo: text?.about?.seo });
}

export default async function HoldingsAboutPage() {
  const [brand, text] = await Promise.all([fetchHoldings(), getPageText()]);
  const { crumbs, crumbLabel } = await crumbsFor([{ label: text?.about?.eyebrow ?? "" }]);

  return (
    <>
      <PageBanner
        short
        crumbs={crumbs}
        crumbLabel={crumbLabel}
        eyebrow={text?.about?.eyebrow}
        heading={brand?.name}
        description={brand?.tagline}
        imageUrl={brand?.narrativeImage?.asset ? urlFor(brand.narrativeImage).width(1920).url() : undefined}
        imageAlt={describe(undefined, brand?.name)}
      />

      <section className="py-24">
        <div className="mx-auto max-w-[810px] px-5 sm:px-10">
          <Reveal>
            {brand?.about ? (
              <PortableText value={brand.about} />
            ) : (
              brand?.shortDescription && <p className="hv-lead">{brand.shortDescription}</p>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
