import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from "../../../../../sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Motion";
import { DIVISION_ART } from "@/components/ui/BlueprintArt";
import { PageHero } from "@/components/layout/PageHero";
import { ContactDetails } from "@/components/marketing/ContactDetails";
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
    <>
      <PageHero
        art={DIVISION_ART[brandSlug]?.primary}
        secondaryArt={DIVISION_ART[brandSlug]?.secondary}
        eyebrow="Contact"
        title={`Talk to ${resolvedBrand.name}`}
        description={resolvedBrand.shortDescription}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: resolvedBrand.name, href: `/${brandSlug}` },
        ]}
      />

      <section className="hv-aura-bg section relative">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-brand-ink">
                Reach us directly
              </h2>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-brand-ink/65">
                Every Hayvora division shares one front desk — mention {resolvedBrand.name} and we&apos;ll route
                you straight through.
              </p>
              <div className="mt-8">
                <ContactDetails
                  info={resolvedSiteSettings.contactInfo}
                  address={resolvedSiteSettings.footerText}
                />
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <InquiryForm kind="service_inquiry" brandId={resolvedBrand._id} />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
