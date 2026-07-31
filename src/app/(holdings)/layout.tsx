import type { ReactNode } from "react";

import { safeFetch } from "../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from "../../../sanity/lib/queries";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBrandThemeStyle, getLogoUrl } from "@/lib/brandHelpers";
import { GLOBAL_NAV_ITEMS, SUBSIDIARY_SLUGS } from "@/lib/brands";
import { FALLBACK_BRANDS, FALLBACK_SITE_SETTINGS } from "@/lib/fallbackContent";
import { organizationSchema } from "@/lib/structuredData";
import type { BrandDoc, SiteSettingsDoc } from "@/types/sanity";

export default async function HoldingsLayout({ children }: { children: ReactNode }) {
  const [brand, siteSettings] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: "holdings" }, ["brand", "brand:holdings"]),
    safeFetch<SiteSettingsDoc>(SITE_SETTINGS_QUERY, {}, ["siteSettings"]),
  ]);

  const resolvedBrand = brand ?? FALLBACK_BRANDS.holdings;
  const resolvedSiteSettings = siteSettings ?? FALLBACK_SITE_SETTINGS;

  return (
    <div style={getBrandThemeStyle(resolvedBrand)}>
      <JsonLd
        data={organizationSchema(
          siteSettings ?? undefined,
          SUBSIDIARY_SLUGS.map((slug) => ({ name: FALLBACK_BRANDS[slug].name, slug })),
        )}
      />
      <Header
        brandName={resolvedBrand.name}
        homeHref="/"
        logoUrl={getLogoUrl(resolvedBrand, "primary")}
        navItems={GLOBAL_NAV_ITEMS}
        ctaLabel="Contact Us"
        ctaHref="/contact"
      />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer
        brandName={resolvedBrand.name}
        logoUrl={getLogoUrl(resolvedBrand, "primary")}
        footerText={resolvedSiteSettings.footerText}
        links={[...GLOBAL_NAV_ITEMS, { label: "Contact", href: "/contact" }]}
        email={resolvedSiteSettings.contactInfo?.email}
        phone={resolvedSiteSettings.contactInfo?.phone}
        socialLinks={resolvedSiteSettings.socialLinks}
      />
    </div>
  );
}
