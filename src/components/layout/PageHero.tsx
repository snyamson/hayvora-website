import Link from "next/link";

import { BlueprintBackdrop, type BlueprintArtName } from "@/components/ui/BlueprintArt";
import { Container } from "@/components/ui/Container";
import { Reveal, TextReveal } from "@/components/ui/Motion";

/**
 * The opening band for every page that isn't the homepage.
 *
 * It exists so inner pages don't each invent their own top spacing: the fixed header
 * floats over the page, so anything at the top needs generous clearance, and doing that
 * per-page drifted out of sync. Every route now opens with the same green band, the same
 * type scale and the same entrance motion.
 *
 * The deep green is deliberate — it's the site's dominant hue, and the header pill is
 * white, so the pill reads as a distinct object sitting on the band rather than
 * dissolving into the page.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs = [],
  art = "crane",
  secondaryArt,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Trail shown above the title. The current page is appended by the caller's title. */
  breadcrumbs?: { label: string; href: string }[];
  /** Equipment drawing behind the band — pick one that suits the page's subject. */
  art?: BlueprintArtName;
  secondaryArt?: BlueprintArtName;
}) {
  return (
    <section className="hv-grid-bg relative overflow-hidden bg-brand-secondary-deep pt-36 pb-16 sm:pt-44 sm:pb-24">
      <BlueprintBackdrop primary={art} secondary={secondaryArt} />

      <div
        aria-hidden
        className="hv-float pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-brand-secondary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-brand-primary/25 blur-3xl"
      />

      <Container className="relative">
        {breadcrumbs.length > 0 && (
          <Reveal>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-white/50">
                {breadcrumbs.map((crumb) => (
                  <li key={crumb.href} className="flex items-center gap-2">
                    <Link href={crumb.href} className="transition-colors hover:text-white">
                      {crumb.label}
                    </Link>
                    <span aria-hidden className="text-white/25">
                      /
                    </span>
                  </li>
                ))}
                <li className="text-white/80">{title}</li>
              </ol>
            </nav>
          </Reveal>
        )}

        {eyebrow && (
          <Reveal delay={0.05}>
            <p className="font-display mt-7 flex items-center gap-3 text-xs font-bold tracking-[0.22em] text-white/70 uppercase">
              <span className="h-px w-6 bg-brand-primary-bright" />
              {eyebrow}
            </p>
          </Reveal>
        )}

        <TextReveal
          as="h1"
          text={title}
          delay={0.12}
          className="font-display mt-5 max-w-4xl text-[2.5rem] leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
        />

        {description && (
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{description}</p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
