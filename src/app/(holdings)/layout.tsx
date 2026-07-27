import type { ReactNode } from "react";

import { safeFetch } from "../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from "../../../sanity/lib/queries";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getBrandThemeStyle, getLogoUrl } from "@/lib/brandHelpers";
import { FALLBACK_BRANDS, FALLBACK_SITE_SETTINGS } from "@/lib/fallbackContent";
import type { BrandDoc, SiteSettingsDoc } from "@/types/sanity";

export default async function HoldingsLayout({ children }: { children: ReactNode }) {
  const [brand, siteSettings] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: "holdings" }, ["brand", "brand:holdings"]),
    safeFetch<SiteSettingsDoc>(SITE_SETTINGS_QUERY, {}, ["siteSettings"]),
  ]);

  const resolvedBrand = brand ?? FALLBACK_BRANDS.holdings;
  const resolvedSiteSettings = siteSettings ?? FALLBACK_SITE_SETTINGS;

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Divisions", href: "/#divisions" },
    { label: "Properties", href: "/properties" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div style={getBrandThemeStyle(resolvedBrand)}>
      <Header
        brandName={resolvedBrand.name}
        homeHref="/"
        logoUrl={getLogoUrl(resolvedBrand, "primary")}
        navItems={navItems.filter((item) => item.label !== "Contact")}
        ctaLabel="Contact Us"
        ctaHref="/contact"
      />
      <main>{children}</main>
      <Footer
        brandName={resolvedBrand.name}
        logoUrl={getLogoUrl(resolvedBrand, "primary")}
        footerText={resolvedSiteSettings.footerText}
        links={navItems}
        email={resolvedSiteSettings.contactInfo?.email}
        phone={resolvedSiteSettings.contactInfo?.phone}
        socialLinks={resolvedSiteSettings.socialLinks}
      />
    </div>
  );
}
