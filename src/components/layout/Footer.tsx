import Link from "next/link";

import { Button, TextLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LogoStacked } from "@/components/ui/Logo";
import { Reveal, Stagger, StaggerItem, TextReveal } from "@/components/ui/Motion";
import { BlueprintBackdrop } from "@/components/ui/BlueprintArt";
import { BackToTop } from "@/components/layout/BackToTop";
import { SocialIcon } from "@/components/layout/SocialIcon";
import type { NavItem } from "@/components/layout/Header";
import { SUBSIDIARY_SLUGS } from "@/lib/brands";
import { FALLBACK_BRANDS } from "@/lib/fallbackContent";

/**
 * The site footer, rendered identically on every page of every division.
 *
 * Three bands, each doing one job:
 *   1. A deep green call-to-action, so the page always ends on an invitation rather
 *      than trailing off into small print.
 *   2. The light directory — logo, divisions, links, contact.
 *   3. An oversized outlined wordmark and the legal bar.
 *
 * The directory band is deliberately light. The logo's two-tone mark only reads at
 * full strength on a light ground, and keeping it there means the same full-colour
 * lockup appears in the header and the footer on every page.
 */
export function Footer({
  footerText,
  links = [],
  email,
  phone,
  whatsapp,
  socialLinks = [],
}: {
  footerText?: string;
  links?: NavItem[];
  email?: string;
  phone?: string;
  whatsapp?: string;
  socialLinks?: { platform: string; url: string }[];
}) {
  const year = new Date().getFullYear();

  const divisions = SUBSIDIARY_SLUGS.map((slug) => ({
    label: FALLBACK_BRANDS[slug].name,
    href: `/${slug}`,
  }));

  return (
    <footer className="relative mt-auto">
      {/* ---------------------------------------------------------------- */}
      {/* 1. Closing call to action                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="hv-grid-bg relative overflow-hidden bg-brand-secondary-deep">
        {/* Plant drawings plus two soft colour pools, so the band reads as a site
            rather than a flat slab of green. */}
        <BlueprintBackdrop primary="dumpTruck" secondary="totalStation" />
        <div
          aria-hidden
          className="hv-float pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-secondary/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-brand-primary/25 blur-3xl"
        />

        <Container className="relative section">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <Reveal>
                <span className="font-display inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold tracking-[0.2em] text-white/70 uppercase backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-primary-bright" />
                  Start a project
                </span>
              </Reveal>

              <TextReveal
                as="h2"
                text="Let's build something that lasts."
                delay={0.1}
                className="font-display mt-7 max-w-2xl text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
              />

              <Reveal delay={0.25}>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70">
                  Tell us what you&apos;re planning — a build, a survey, a farm system — and we&apos;ll
                  point you at the right division and the right team.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.3} className="flex flex-wrap gap-3 lg:justify-end">
              <Button href="/contact" variant="white" size="lg" withArrow>
                Get in touch
              </Button>
              <Button
                href="/properties"
                size="lg"
                className="border border-white/25 bg-transparent text-white hover:bg-white/10"
              >
                View properties
              </Button>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 2. Directory                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="hv-aura-bg hv-grain-bg relative overflow-hidden bg-brand-tint">
        <Container className="relative pt-20 pb-10 sm:pt-24">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1.1fr]">
            {/* Brand column */}
            <Reveal className="col-span-2 sm:col-span-3 lg:col-span-1">
              <Link href="/" className="inline-block transition-transform duration-300 hover:scale-[1.02]">
                <LogoStacked className="h-24 w-auto sm:h-28" />
              </Link>

              {footerText && (
                <p className="mt-6 max-w-xs text-sm leading-relaxed text-brand-ink/65">{footerText}</p>
              )}

              {socialLinks.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                      className="group flex h-11 w-11 items-center justify-center rounded-full border border-brand-line bg-white text-brand-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary hover:bg-brand-primary hover:text-white hover:shadow-lift"
                    >
                      <SocialIcon platform={link.platform} className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </Reveal>

            <FooterColumn title="Explore" items={links} />
            <FooterColumn title="Divisions" items={divisions} />

            {/* Contact column */}
            <Reveal delay={0.15} className="col-span-2 sm:col-span-1">
              <FooterHeading>Contact</FooterHeading>
              <div className="mt-5 space-y-3 text-sm">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="block text-brand-ink/70 transition-colors hover:text-brand-primary"
                  >
                    {email}
                  </a>
                )}
                {phone && (
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="block text-brand-ink/70 transition-colors hover:text-brand-primary">
                    {phone}
                  </a>
                )}
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-brand-ink/70 transition-colors hover:text-brand-primary"
                  >
                    WhatsApp {whatsapp}
                  </a>
                )}
              </div>
              <div className="mt-6">
                <TextLink href="/contact">Send an enquiry</TextLink>
              </div>
            </Reveal>
          </div>
        </Container>

        {/* Oversized outlined wordmark — typographic texture anchoring the bottom of the
            page. aria-hidden because the logo above already names the company.

            Drawn as SVG rather than styled text: a `vw`-sized heading is a guess about
            how wide the glyphs happen to render, and at most widths it overflowed and
            sheared the outer letters. `textLength` + `lengthAdjust` make the word span
            the viewBox exactly, so it scales to the container at every breakpoint with
            the H and the A fully inside the frame. */}
        <div aria-hidden className="pointer-events-none relative mt-16 select-none px-6 lg:px-8">
          <svg viewBox="0 0 1000 190" className="block w-full" role="presentation" focusable="false">
            <text
              x="500"
              y="158"
              textAnchor="middle"
              textLength="990"
              lengthAdjust="spacingAndGlyphs"
              fontSize="200"
              fontWeight="700"
              fill="none"
              stroke="color-mix(in oklab, var(--brand-secondary) 30%, transparent)"
              strokeWidth="1.4"
              style={{ fontFamily: "var(--font-display), Helvetica Neue, Arial, sans-serif" }}
            >
              HAYVORA
            </text>
          </svg>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 3. Legal bar                                                  */}
        {/* ------------------------------------------------------------ */}
        <div className="relative border-t border-brand-line-soft">
          <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-brand-ink/55 sm:flex-row">
            <p>© {year} Hayvora Holdings Limited. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <p className="hidden sm:block">Accra, Ghana</p>
              <BackToTop />
            </div>
          </Container>
        </div>
      </section>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-brand-primary uppercase">
      <span className="h-px w-5 bg-brand-secondary" />
      {children}
    </p>
  );
}

function FooterColumn({ title, items }: { title: string; items: NavItem[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <Reveal>
        <FooterHeading>{title}</FooterHeading>
      </Reveal>
      <Stagger as="nav" gap={0.06} delay={0.1} className="mt-5 flex flex-col gap-3">
        {items.map((item) => (
          <StaggerItem key={`${title}-${item.href}`} y={10}>
            <Link
              href={item.href}
              className="group inline-flex items-center gap-2 text-sm text-brand-ink/70 transition-colors hover:text-brand-primary"
            >
              {/* Rule grows out of the link on hover — the same wipe used by TextLink. */}
              <span className="h-px w-0 bg-brand-secondary transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:w-3" />
              {item.label}
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
