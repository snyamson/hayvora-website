import { safeFetch } from "../../../../sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "../../../../sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Motion";
import { PageHero } from "@/components/layout/PageHero";
import { ContactDetails } from "@/components/marketing/ContactDetails";
import { InquiryForm } from "@/components/marketing/InquiryForm";
import { FALLBACK_SITE_SETTINGS } from "@/lib/fallbackContent";
import type { SiteSettingsDoc } from "@/types/sanity";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Hayvora Holdings",
  description:
    "Talk to Hayvora Holdings about construction, land surveying, geotechnical investigation, or agricultural systems work in Ghana. Based at Adenta Shopping Mall, Accra.",
  path: "/contact",
});

export default async function HoldingsContactPage() {
  const siteSettings = await safeFetch<SiteSettingsDoc>(SITE_SETTINGS_QUERY, {}, ["siteSettings"]);
  const resolved = siteSettings ?? FALLBACK_SITE_SETTINGS;

  return (
    <>
      <PageHero
        art="totalStation"
        secondaryArt="excavator"
        eyebrow="Contact"
        title="Get in touch"
        description="Tell us what you're planning and we'll route you to the right division — usually within one working day."
        breadcrumbs={[{ label: "Home", href: "/" }]}
      />

      <section className="hv-aura-bg section relative">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-brand-ink">
                Reach us directly
              </h2>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-brand-ink/65">
                Prefer to call or message? Any of these reaches the same team.
              </p>
              <div className="mt-8">
                <ContactDetails info={resolved.contactInfo} address={resolved.footerText} />
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <InquiryForm kind="general_contact" />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
