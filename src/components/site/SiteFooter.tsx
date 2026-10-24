import Link from "next/link";

import { BackToTop } from "@/components/layout/BackToTop";
import { SocialIcon } from "@/components/layout/SocialIcon";
import type { DivisionLink, LogoSet } from "@/lib/chrome";
import type { SiteSettingsDoc } from "@/types/sanity";
import { StackedLogo } from "./SiteLogo";

const tel = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;
const wa = (phone: string) => `https://wa.me/${phone.replace(/[^\d]/g, "")}`;

function Column({ heading, children }: { heading?: string; children: React.ReactNode }) {
  return (
    <div>
      {heading && <p className="mb-5 text-xs leading-3 font-bold">{heading}</p>}
      <div className="flex flex-col gap-3.5">{children}</div>
    </div>
  );
}

/** EllisDon's rounded blue footer panel with Bechtel's column layout and underline hovers. */
export function SiteFooter({
  logo,
  settings,
  divisions,
  enquiryHref,
}: {
  logo: LogoSet;
  settings: SiteSettingsDoc | null;
  divisions: DivisionLink[];
  enquiryHref?: string;
}) {
  const footer = settings?.footer;
  const contact = settings?.contactInfo;
  const enquiry = footer?.enquiryLink;
  const year = new Date().getFullYear();

  return (
    <footer className="p-3 sm:p-6">
      <div className="mx-auto max-w-[1392px] rounded-[20px] bg-[var(--hv-blue)] px-6 pt-12 pb-8 text-white sm:px-[clamp(24px,5vw,74px)] sm:pt-[clamp(48px,6vw,80px)]">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,2fr)]">
          <div>
            <StackedLogo logo={logo} />
            {footer?.headquartersLabel && (
              <p className="mt-8 text-xs leading-3 font-bold">{footer.headquartersLabel}</p>
            )}
            {settings?.footerText && <p className="mt-3.5 text-base leading-[22px]">{settings.footerText}</p>}
            {contact?.phone && (
              <p className="mt-4">
                <a href={tel(contact.phone)} className="hv-flink underline">
                  {contact.phone}
                </a>
              </p>
            )}
            {(settings?.socialLinks?.length ?? 0) > 0 && (
              <div className="mt-6 flex gap-3">
                {settings!.socialLinks!.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50 text-white transition-colors hover:bg-white hover:text-[var(--hv-blue)]"
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <Column heading={footer?.exploreHeading}>
              {(footer?.exploreLinks ?? [])
                .filter((l) => l.label && l.href)
                .map((l) => (
                  <Link key={l._key} href={l.href!} className="hv-flink">
                    {l.label}
                  </Link>
                ))}
            </Column>
            <Column heading={footer?.divisionsHeading}>
              {divisions.map((d) => (
                <Link key={d.slug} href={`/${d.slug}`} className="hv-flink">
                  {d.name}
                </Link>
              ))}
            </Column>
            <Column heading={footer?.contactHeading}>
              {contact?.email && (
                <a href={`mailto:${contact.email}`} className="hv-flink">
                  {contact.email}
                </a>
              )}
              {contact?.phone && (
                <a href={tel(contact.phone)} className="hv-flink">
                  {contact.phone}
                </a>
              )}
              {contact?.whatsapp && (
                <a href={wa(contact.whatsapp)} target="_blank" rel="noopener noreferrer" className="hv-flink">
                  {[footer?.whatsappLabel, contact.whatsapp].filter(Boolean).join(" ")}
                </a>
              )}
              {enquiry?.label && (enquiryHref ?? enquiry.href) && (
                <Link href={(enquiryHref ?? enquiry.href)!} className="hv-flink font-semibold">
                  {enquiry.label} →
                </Link>
              )}
            </Column>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-6 text-sm leading-[21px]">
          <span>
            © {year} {logo.name}
            {logo.name && footer?.rightsText ? "." : ""} {footer?.rightsText}
          </span>
          <div className="flex items-center gap-6">
            {footer?.locationText && <span className="text-white/80">{footer.locationText}</span>}
            <BackToTop label={footer?.backToTopLabel} />
          </div>
        </div>
      </div>
    </footer>
  );
}
