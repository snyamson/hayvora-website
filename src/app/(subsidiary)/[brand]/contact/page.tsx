import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY } from "../../../../../sanity/lib/queries";
import { ContactBlock } from "@/components/site/ContactBlock";
import { PageBanner } from "@/components/site/division/DivisionSections";
import { isSubsidiarySlug } from "@/lib/brands";
import { divisionOwner, fill, getPageText, getSiteSettings } from "@/lib/content";
import { bannerImage, crumbsFor, divisionPageMetadata } from "@/lib/pageContext";
import type { BrandDoc } from "@/types/sanity";
import { describe } from "@/lib/imageAlt";

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  return divisionPageMetadata(brand, "/contact", (text) => text?.contact?.divisionTitle);
}

export default async function SubsidiaryContactPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const [brand, text, settings] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]),
    getPageText(),
    getSiteSettings(),
  ]);
  if (!brand) notFound();
  const c = text?.contact;
  const { crumbs, crumbLabel } = await crumbsFor([
    { label: brand.name, href: `/${brandSlug}` },
    { label: c?.eyebrow ?? "" },
  ]);

  return (
    <>
      <PageBanner
        short
        crumbs={crumbs}
        crumbLabel={crumbLabel}
        eyebrow={c?.eyebrow}
        heading={fill(c?.divisionTitle, { division: brand.name })}
        description={brand.shortDescription}
        imageUrl={bannerImage(brand)}
        imageAlt={describe(undefined, await divisionOwner(brandSlug, brand.name))}
      />
      <ContactBlock
        heading={c?.directHeading}
        body={fill(c?.divisionDirectBody, { division: brand.name })}
        settings={settings}
        text={text}
        kind="service_inquiry"
        brandId={brand._id}
      />
    </>
  );
}
