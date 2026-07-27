import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from "../../../../../sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryForm } from "@/components/marketing/InquiryForm";
import { isSubsidiarySlug } from "@/lib/brands";
import { FALLBACK_BRANDS, FALLBACK_SITE_SETTINGS } from "@/lib/fallbackContent";
import type { BrandDoc, SiteSettingsDoc } from "@/types/sanity";

export default async function SubsidiaryContactPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const [brand, siteSettings] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]),
    safeFetch<SiteSettingsDoc>(SITE_SETTINGS_QUERY, {}, ["siteSettings"]),
  ]);
  const resolvedBrand = brand ?? FALLBACK_BRANDS[brandSlug];
  const resolvedSiteSettings = siteSettings ?? FALLBACK_SITE_SETTINGS;

  return (
    <section className="pt-40 pb-24">
      <Container className="grid max-w-5xl grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Contact" title={`Talk to ${resolvedBrand.name}`} />
          <div className="mt-8 space-y-2 text-brand-ink/80">
            {resolvedSiteSettings.contactInfo?.email && <p>{resolvedSiteSettings.contactInfo.email}</p>}
            {resolvedSiteSettings.contactInfo?.phone && <p>{resolvedSiteSettings.contactInfo.phone}</p>}
          </div>
        </div>
        <InquiryForm kind="service_inquiry" brandId={resolvedBrand._id} />
      </Container>
    </section>
  );
}
