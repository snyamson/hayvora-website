import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { safeFetch } from "../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from "../../../../sanity/lib/queries";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getBrandThemeStyle, getLogoUrl } from "@/lib/brandHelpers";
import { isSubsidiarySlug } from "@/lib/brands";
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

  const modules = new Set(resolvedBrand.enabledModules ?? []);

  const navItems = [
    { label: "Home", href: `/${brandSlug}` },
    { label: "About", href: `/${brandSlug}/about` },
    ...(modules.has("services") ? [{ label: "Services", href: `/${brandSlug}/services` }] : []),
    ...(modules.has("projects") ? [{ label: "Projects", href: `/${brandSlug}/projects` }] : []),
    ...(modules.has("gallery") ? [{ label: "Gallery", href: `/${brandSlug}/gallery` }] : []),
  ];

  const footerLinks = [...navItems, { label: "Contact", href: `/${brandSlug}/contact` }];

  return (
    <div style={getBrandThemeStyle(resolvedBrand)}>
      <Header
        brandName={resolvedBrand.name}
        homeHref={`/${brandSlug}`}
        logoUrl={getLogoUrl(resolvedBrand, "primary")}
        navItems={navItems}
        parentLinkLabel="Part of Hayvora Holdings"
        parentLinkHref="/"
        ctaLabel="Contact Us"
        ctaHref={`/${brandSlug}/contact`}
      />
      <main>{children}</main>
      <Footer
        brandName={resolvedBrand.name}
        logoUrl={getLogoUrl(resolvedBrand, "primary")}
        footerText={resolvedSiteSettings.footerText}
        links={footerLinks}
        email={resolvedSiteSettings.contactInfo?.email}
        phone={resolvedSiteSettings.contactInfo?.phone}
        socialLinks={resolvedSiteSettings.socialLinks}
      />
    </div>
  );
}
