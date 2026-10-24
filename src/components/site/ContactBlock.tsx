import { ContactDetails } from "@/components/marketing/ContactDetails";
import { InquiryForm } from "@/components/marketing/InquiryForm";
import { Reveal } from "@/components/ui/Motion";
import type { InquiryInput } from "@/lib/validations/inquirySchema";
import type { PageTextDoc, SiteSettingsDoc } from "@/types/sanity";

/** Contact channels on the left, the enquiry form on the right. Shared by both contact pages. */
export function ContactBlock({
  heading,
  body,
  settings,
  text,
  kind,
  brandId,
}: {
  heading?: string;
  body?: string;
  settings: SiteSettingsDoc | null;
  text: PageTextDoc | null;
  kind: InquiryInput["kind"];
  brandId?: string;
}) {
  const c = text?.contact;
  return (
    <section className="py-24">
      <div className="hv-wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          {heading && <h2 className="text-[32px] leading-[1.1] text-[var(--hv-blue)]">{heading}</h2>}
          {body && <p className="mt-3 max-w-sm text-base leading-relaxed text-[var(--hv-muted)]">{body}</p>}
          <div className="mt-8">
            <ContactDetails
              info={settings?.contactInfo}
              address={settings?.footerText}
              labels={{ email: c?.emailLabel, phone: c?.phoneLabel, whatsapp: c?.whatsappLabel, office: c?.officeLabel }}
            />
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <InquiryForm kind={kind} brandId={brandId} copy={text?.form ?? {}} />
        </Reveal>
      </div>
    </section>
  );
}
