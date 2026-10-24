import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { safeFetch } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";
import { BRAND_BY_SLUG_QUERY } from "../../../../sanity/lib/queries";
import { PageTransition } from "@/components/PageTransition";
import { ClosingCard } from "@/components/site/ClosingCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getBrandThemeStyle } from "@/lib/brandHelpers";
import { isSubsidiarySlug } from "@/lib/brands";
import { getChrome } from "@/lib/chrome";
import { divisionHref, getDivisionPage } from "@/lib/content";
import type { BrandDoc } from "@/types/sanity";

export default async function SubsidiaryLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ brand: string }>;
}) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const [brand, chrome, page] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]),
    getChrome(),
    getDivisionPage(),
  ]);
  if (!brand) notFound();

  const { settings, logo, divisions, projects } = chrome;
  const closing = page?.closing;
  const local = (link?: { label?: string; href?: string }) =>
    link ? { label: link.label, href: divisionHref(link.href, brandSlug) } : undefined;
  const contactHref = divisionHref(settings?.header?.cta?.href, brandSlug);

  return (
    <div className="flex min-h-screen flex-col" style={getBrandThemeStyle(brand)}>
      <SiteHeader
        logo={logo}
        header={settings?.header}
        menu={settings?.divisionsMenu}
        ctaHref={contactHref}
        divisions={divisions}
        projects={projects}
      />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <ClosingCard
        eyebrow={closing?.eyebrow}
        heading={closing?.heading}
        body={closing?.body}
        primary={local(closing?.primaryCta)}
        secondary={local(closing?.secondaryCta)}
        imageUrl={closing?.image?.asset ? urlFor(closing.image).width(1800).url() : undefined}
      />
      <SiteFooter
        logo={logo}
        settings={settings}
        divisions={divisions}
        enquiryHref={divisionHref(settings?.footer?.enquiryLink?.href, brandSlug)}
      />
    </div>
  );
}
