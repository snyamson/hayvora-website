import { safeFetch } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import { BRAND_BY_SLUG_QUERY } from "../../../../sanity/lib/queries";
import { ContactBlock } from "@/components/site/ContactBlock";
import { PageBanner } from "@/components/site/division/DivisionSections";
import { getPageText, getSiteSettings } from "@/lib/content";
import { crumbsFor } from "@/lib/pageContext";
import { buildMetadata } from "@/lib/seo";
import type { BrandDoc } from "@/types/sanity";
import { describe } from "@/lib/imageAlt";

export async function generateMetadata() {
  const text = await getPageText();
  return buildMetadata({ path: "/contact", seo: text?.contact?.seo });
}

export default async function HoldingsContactPage() {
  const [text, settings, brand] = await Promise.all([
    getPageText(),
    getSiteSettings(),
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: "holdings" }, ["brand", "brand:holdings"]),
  ]);
  const c = text?.contact;
  const { crumbs, crumbLabel } = await crumbsFor([{ label: c?.eyebrow ?? "" }]);

  return (
    <>
      <PageBanner
        short
        crumbs={crumbs}
        crumbLabel={crumbLabel}
        eyebrow={c?.eyebrow}
        heading={c?.title}
        description={c?.description}
        imageUrl={brand?.narrativeImage?.asset ? urlFor(brand.narrativeImage).width(1920).url() : undefined}
        imageAlt={describe(undefined, brand?.name)}
      />
      <ContactBlock
        heading={c?.directHeading}
        body={c?.directBody}
        settings={settings}
        text={text}
        kind="general_contact"
      />
    </>
  );
}
