import { safeFetch } from "../../../../sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "../../../../sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryForm } from "@/components/marketing/InquiryForm";
import { FALLBACK_SITE_SETTINGS } from "@/lib/fallbackContent";
import type { SiteSettingsDoc } from "@/types/sanity";

export default async function HoldingsContactPage() {
  const siteSettings = await safeFetch<SiteSettingsDoc>(SITE_SETTINGS_QUERY, {}, ["siteSettings"]);
  const resolved = siteSettings ?? FALLBACK_SITE_SETTINGS;

  return (
    <section className="pt-40 pb-24">
      <Container className="grid max-w-5xl grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Contact" title="Get in touch" />
          <div className="mt-8 space-y-2 text-brand-ink/80">
            {resolved.contactInfo?.email && <p>{resolved.contactInfo.email}</p>}
            {resolved.contactInfo?.phone && <p>{resolved.contactInfo.phone}</p>}
            {resolved.contactInfo?.whatsapp && <p>WhatsApp: {resolved.contactInfo.whatsapp}</p>}
            {resolved.footerText && <p>{resolved.footerText}</p>}
          </div>
        </div>
        <InquiryForm kind="general_contact" />
      </Container>
    </section>
  );
}
