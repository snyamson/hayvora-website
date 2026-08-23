import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { safeFetch } from "../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from "../../../../sanity/lib/queries";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/PageTransition";
import { getBrandThemeStyle } from "@/lib/brandHelpers";
import { GLOBAL_NAV_ITEMS, isSubsidiarySlug } from "@/lib/brands";
import { FALLBACK_BRANDS, FALLBACK_SITE_SETTINGS } from "@/lib/fallbackContent";
import type { BrandDoc, SiteSettingsDoc } from "@/types/sanity";

export default async function SubsidiaryLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ brand: string }>;
}) {
  const { brand: brandSlug } = await params;

  if (!isSubsidiarySlug(brandSlug)) notFound();

  const [brand, siteSettings] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]),
    safeFetch<SiteSettingsDoc>(SITE_SETTINGS_QUERY, {}, ["siteSettings"]),
  ]);

  const resolvedBrand = brand ?? FALLBACK_BRANDS[brandSlug];
  if (!resolvedBrand) notFound();
  const resolvedSiteSettings = siteSettings ?? FALLBACK_SITE_SETTINGS;

  const footerLinks = [...GLOBAL_NAV_ITEMS, { label: "Contact", href: `/${brandSlug}/contact` }];

  return (
    <div className="flex min-h-screen flex-col" style={getBrandThemeStyle(resolvedBrand)}>
      <Header navItems={GLOBAL_NAV_ITEMS} ctaLabel="Contact Us" ctaHref={`/${brandSlug}/contact`} />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer
        footerText={resolvedSiteSettings.footerText}
        links={footerLinks}
        email={resolvedSiteSettings.contactInfo?.email}
        phone={resolvedSiteSettings.contactInfo?.phone}
        whatsapp={resolvedSiteSettings.contactInfo?.whatsapp}
        socialLinks={resolvedSiteSettings.socialLinks}
      />
    </div>
  );
}
