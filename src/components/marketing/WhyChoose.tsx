import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/Logo";
import { ClipReveal, CountUp, Reveal } from "@/components/ui/Motion";

export type WhyChooseContent = {
  eyebrow?: string;
  heading: string;
  statValue?: string;
  statLabel?: string;
  statDescription?: string;
  statImageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  highlightValue?: string;
  highlightLabel?: string;
  highlightVideoUrl?: string;
  highlightPosterUrl?: string;
};

/**
 * Two-card proof block: a light stat card with the supporting photo and CTA, beside a
 * full-bleed media card carrying the second figure. Both numbers count up as they
 * scroll into view (see CountUp), which is what makes this section feel alive rather
 * than like two static tiles.
 */
export function WhyChoose({ content }: { content: WhyChooseContent }) {
  const {
    eyebrow,
    heading,
    statValue,
    statLabel,
    statDescription,
    statImageUrl,
    ctaLabel,
    ctaHref,
    highlightValue,
    highlightLabel,
    highlightVideoUrl,
    highlightPosterUrl,
  } = content;

  return (
    <section className="hv-aura-bg section relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-16">
          {eyebrow && (
            <Reveal>
              <span className="font-display inline-flex shrink-0 items-center gap-2.5 rounded-full border border-brand-line bg-white px-5 py-2.5 text-xs font-bold tracking-[0.18em] text-brand-primary uppercase shadow-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                {eyebrow}
              </span>
            </Reveal>
          )}

          <Reveal delay={0.1}>
            <h2 className="font-display text-2xl leading-[1.25] font-semibold tracking-tight text-brand-ink sm:text-3xl lg:text-[2.35rem]">
              {heading}
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ---- Stat card ---- */}
          <Reveal className="overflow-hidden rounded-card border border-brand-line-soft bg-white p-8 shadow-soft sm:p-10">
            <div className="flex h-full flex-col gap-8 sm:flex-row">
              {statImageUrl && (
                <ClipReveal className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-card sm:aspect-auto sm:w-2/5">
                  <Image
                    src={statImageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20vw, 100vw"
                    className="object-cover"
                  />
                </ClipReveal>
              )}

              <div className="hidden w-px shrink-0 bg-brand-line-soft sm:block" />

              <div className="flex flex-1 flex-col">
                {statValue && (
                  <CountUp
                    value={statValue}
                    className="font-display text-5xl leading-none font-semibold tracking-tight text-brand-secondary tabular-nums sm:text-6xl"
                  />
                )}
                {statLabel && (
                  <p className="font-display mt-5 text-lg font-semibold text-brand-ink">{statLabel}</p>
                )}
                {statDescription && (
                  <p className="mt-3 text-base leading-relaxed text-brand-ink/65">{statDescription}</p>
                )}

                <div className="mt-10 flex flex-wrap items-center justify-between gap-6 sm:mt-auto">
                  {ctaLabel && ctaHref && (
                    <Button href={ctaHref} variant="secondary" withArrow>
                      {ctaLabel}
                    </Button>
                  )}
                  {/* Monogram only — the full lockup already sits in the header and
                      footer, and repeating it here would read as a third logo. */}
                  <LogoMark className="h-10 w-auto opacity-90" />
                </div>
              </div>
            </div>
          </Reveal>

          {/* ---- Highlight card ---- */}
          {/* Video, else poster, else the brand gradient. Mirrors the "go by whichever
              asset is actually attached" rule in getHeroSlides(). */}
          <Reveal
            delay={0.12}
            className="group relative flex min-h-[440px] overflow-hidden rounded-card bg-brand-secondary-deep shadow-soft"
          >
            {highlightVideoUrl ? (
              <video
                src={highlightVideoUrl}
                poster={highlightPosterUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              highlightPosterUrl && (
                <Image
                  src={highlightPosterUrl}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105"
                />
              )
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary-deep/90 via-brand-secondary-deep/25 to-transparent" />

            <div className="relative mt-auto p-8 sm:p-10">
              {highlightValue && (
                <CountUp
                  value={highlightValue}
                  className="font-display block text-5xl leading-none font-semibold tracking-tight text-white tabular-nums sm:text-6xl"
                />
              )}
              {highlightLabel && (
                <p className="font-display mt-3 text-lg font-semibold text-white/90">{highlightLabel}</p>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
