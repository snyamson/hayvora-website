import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY } from "../../../../../sanity/lib/queries";
import { PageBanner } from "@/components/site/division/DivisionSections";
import { Reveal } from "@/components/ui/Motion";
import { PortableText } from "@/components/portable-text/PortableText";
import { isSubsidiarySlug } from "@/lib/brands";
import { getPageText } from "@/lib/content";
import { bannerImage, crumbsFor, divisionPageMetadata } from "@/lib/pageContext";
import type { BrandDoc } from "@/types/sanity";

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  return divisionPageMetadata(brand, "/about", (text) => text?.about?.divisionEyebrow);
}

export default async function SubsidiaryAboutPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const [brand, text] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]),
    getPageText(),
  ]);
  if (!brand) notFound();
  const { crumbs, crumbLabel } = await crumbsFor([
    { label: brand.name, href: `/${brandSlug}` },
    { label: text?.about?.divisionEyebrow ?? "" },
  ]);

  return (
    <>
      <PageBanner
        short
        crumbs={crumbs}
        crumbLabel={crumbLabel}
        eyebrow={text?.about?.divisionEyebrow}
        heading={brand.name}
        description={brand.tagline}
        imageUrl={bannerImage(brand)}
      />

      <section className="py-24">
        <div className="mx-auto max-w-[810px] px-5 sm:px-10">
          <Reveal>
            {brand.about ? (
              <PortableText value={brand.about} />
            ) : (
              brand.shortDescription && <p className="hv-lead">{brand.shortDescription}</p>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
