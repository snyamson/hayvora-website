import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

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
    <section className="py-24">
      <Container>
        <Reveal className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            {eyebrow && (
              <span className="font-display inline-flex rounded-full border border-brand-primary/30 px-5 py-2.5 text-sm font-medium text-brand-primary">
                {eyebrow}
              </span>
            )}
          </div>
          <h2 className="font-display text-3xl leading-snug font-semibold text-brand-secondary sm:text-4xl">
            {heading}
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Stat card */}
          <Reveal className="rounded-card bg-neutral-100 p-8 sm:p-10">
            <div className="flex h-full flex-col gap-8 sm:flex-row">
              {statImageUrl && (
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-card sm:aspect-auto sm:w-2/5">
                  <Image src={statImageUrl} alt="" fill sizes="(min-width: 1024px) 20vw, 100vw" className="object-cover" />
                </div>
              )}

              <div className="hidden w-px shrink-0 bg-black/10 sm:block" />

              <div className="flex flex-1 flex-col">
                {statValue && (
                  <p className="font-display text-5xl leading-none font-semibold text-brand-secondary sm:text-6xl">
                    {statValue}
                  </p>
                )}
                {statLabel && (
                  <p className="font-display mt-5 text-lg font-semibold text-brand-secondary">{statLabel}</p>
                )}
                {statDescription && (
                  <p className="mt-3 text-base leading-relaxed text-brand-primary/80">{statDescription}</p>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-6 pt-2 sm:mt-auto">
                  {ctaLabel && ctaHref && (
                    <Button href={ctaHref} variant="secondary" pill>
                      {ctaLabel}
                    </Button>
                  )}
                  <Image
                    src="/hayvora_logo.svg"
                    alt="Hayvora Holdings"
                    width={96}
                    height={48}
                    className="h-12 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Highlight card — video, else poster, else flat brand green. Mirrors the
              "go by whichever asset is actually attached" rule in getHeroSlides(). */}
          <Reveal
            delay={0.1}
            className="relative flex min-h-[420px] overflow-hidden rounded-card bg-brand-secondary"
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
                  className="object-cover"
                />
              )
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="relative mt-auto p-8 sm:p-10">
              {highlightValue && (
                <p className="font-display text-5xl leading-none font-semibold text-white sm:text-6xl">
                  {highlightValue}
                </p>
              )}
              {highlightLabel && (
                <p className="font-display mt-3 text-lg font-semibold text-white">{highlightLabel}</p>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
