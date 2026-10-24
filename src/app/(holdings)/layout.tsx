import type { ReactNode } from "react";

import { urlFor } from "../../../sanity/lib/image";
import { PageTransition } from "@/components/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import { ClosingCard } from "@/components/site/ClosingCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getBrandThemeStyle } from "@/lib/brandHelpers";
import { getChrome } from "@/lib/chrome";
import { organizationSchema } from "@/lib/structuredData";

export default async function HoldingsLayout({ children }: { children: ReactNode }) {
  const { settings, holdings, logo, divisions, projects } = await getChrome();
  const closing = settings?.closingCta;

  return (
    <div className="flex min-h-screen flex-col" style={getBrandThemeStyle(holdings ?? undefined)}>
      <JsonLd
        data={organizationSchema(
          settings ?? undefined,
          divisions.map((d) => ({ name: d.name, slug: d.slug })),
        )}
      />
      <SiteHeader
        logo={logo}
        header={settings?.header}
        menu={settings?.divisionsMenu}
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
        primary={closing?.primaryCta}
        secondary={closing?.secondaryCta}
        imageUrl={closing?.image?.asset ? urlFor(closing.image).width(1800).url() : undefined}
      />
      <SiteFooter logo={logo} settings={settings} divisions={divisions} />
    </div>
  );
}
