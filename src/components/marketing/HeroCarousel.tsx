"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { EASE_OUT } from "@/components/ui/Motion";

export type HeroSlide = { type: "image"; imageUrl: string; alt?: string } | { type: "video"; videoUrl: string };

const SLIDE_MS = 6500;

/**
 * The hero. Four layers of motion, deliberately layered rather than piled on:
 *
 *   1. A slow Ken Burns push on the active slide, so the frame is never quite still.
 *   2. A word-by-word rise on the headline, staggered behind the eyebrow and CTA.
 *   3. Scroll-linked parallax — the copy drifts up and fades as you leave, while the
 *      media moves slower, which reads as depth.
 *   4. A ring around the active dot that tracks the autoplay timer, so the carousel
 *      advancing never feels like it happened at random.
 *
 * Everything above collapses to a static first frame under `prefers-reduced-motion`.
 */
export function HeroCarousel({
  headline,
  eyebrow,
  slides,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: {
  headline: string;
  eyebrow?: string;
  slides: HeroSlide[];
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 32 },
    reduced ? [] : [Autoplay({ delay: SLIDE_MS, stopOnInteraction: false })],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    // Initial read is deferred a frame so it lands after this commit rather than
    // triggering a second render synchronously from the effect body.
    const frame = requestAnimationFrame(onSelect);
    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Scroll-linked exit. `offset` runs from the hero's top hitting the viewport top to
  // its bottom doing the same — i.e. the whole time it's leaving.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const displaySlides: HeroSlide[] = slides.length > 0 ? slides : [{ type: "image", imageUrl: "" }];
  const words = headline.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative h-[92svh] min-h-[600px] w-full overflow-hidden bg-brand-secondary-deep"
    >
      {/* ---- Media ---- */}
      <motion.div
        style={reduced ? undefined : { y: mediaY, scale: mediaScale }}
        className="absolute inset-0 h-full w-full will-change-transform"
      >
        <div className="h-full" ref={emblaRef}>
          <div className="flex h-full">
            {displaySlides.map((slide, i) => (
              <div key={i} className="relative h-full min-w-0 flex-[0_0_100%]">
                {slide.type === "video" ? (
                  <video
                    src={slide.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden
                    className="h-full w-full object-cover"
                  />
                ) : slide.imageUrl ? (
                  <motion.div
                    // `relative` matters: the <Image fill> inside resolves against the
                    // nearest positioned ancestor, and without it the slide collapsed
                    // to the section box instead of filling this wrapper.
                    className="relative h-full w-full"
                    // Ken Burns, restarted per slide via the `key`, so the push always
                    // begins when the slide becomes visible rather than drifting out of
                    // sync after a few rotations.
                    key={`${i}-${selectedIndex === i}`}
                    initial={reduced ? false : { scale: 1.0 }}
                    animate={reduced ? undefined : { scale: selectedIndex === i ? 1.12 : 1.0 }}
                    transition={{ duration: SLIDE_MS / 1000 + 2, ease: "linear" }}
                  >
                    <Image
                      src={slide.imageUrl}
                      alt={slide.alt ?? ""}
                      fill
                      sizes="100vw"
                      // Next 16 deprecates `priority`; for a carousel the docs point at
                      // eager + high fetch priority instead, since which slide is LCP
                      // depends on the viewport.
                      loading={i === 0 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : "auto"}
                      className="object-cover"
                    />
                  </motion.div>
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-brand-secondary-deep via-brand-primary to-brand-secondary" />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ---- Scrims ---- */}
      {/* Bottom-up green for text legibility, plus a left-weighted wash so the copy has
          contrast even over a bright sky. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-secondary-deep via-brand-secondary-deep/35 to-transparent" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-brand-secondary-deep/70 via-brand-secondary-deep/10 to-transparent" />

      {/* ---- Copy ---- */}
      <motion.div
        style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
        className="absolute inset-0 flex items-center"
      >
        <div className="mx-auto w-full max-w-7xl px-6 pt-28 lg:px-8 lg:pt-32">
          {eyebrow && (
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="font-display mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs font-bold tracking-[0.2em] text-white/85 uppercase backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary-bright" />
              {eyebrow}
            </motion.p>
          )}

          {/* Semibold, not bold: Montserrat's 700 turns into a slab of black at hero
              sizes. 600 keeps the presence without the weight. */}
          <h1
            className="font-display max-w-4xl text-[2.5rem] leading-[1.02] font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
            aria-label={headline}
          >
            {words.map((word, i) => (
              <span key={`${word}-${i}`} aria-hidden className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block"
                  initial={reduced ? false : { y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.85, delay: 0.15 + i * 0.06, ease: EASE_OUT }}
                >
                  {word}
                  {i < words.length - 1 ? " " : ""}
                </motion.span>
              </span>
            ))}
          </h1>

          {(ctaLabel && ctaHref) || (secondaryCtaLabel && secondaryCtaHref) ? (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 + words.length * 0.05, ease: EASE_OUT }}
              className="mt-11 flex flex-wrap gap-3"
            >
              {ctaLabel && ctaHref && (
                <Button href={ctaHref} variant="white" size="lg" withArrow>
                  {ctaLabel}
                </Button>
              )}
              {secondaryCtaLabel && secondaryCtaHref && (
                <Button
                  href={secondaryCtaHref}
                  size="lg"
                  className="border border-white/30 bg-white/5 text-white backdrop-blur-md hover:bg-white/15"
                >
                  {secondaryCtaLabel}
                </Button>
              )}
            </motion.div>
          ) : null}
        </div>
      </motion.div>

      {/* ---- Controls ---- */}
      {displaySlides.length > 1 && (
        <div className="absolute bottom-24 left-6 flex items-center gap-3 sm:bottom-10 sm:left-8">
          {displaySlides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === selectedIndex}
              onClick={() => emblaApi?.scrollTo(i)}
              className="group relative flex h-9 w-9 cursor-pointer items-center justify-center"
            >
              <span
                className={`block rounded-full transition-all duration-500 ${
                  i === selectedIndex ? "h-2 w-2 bg-white" : "h-1.5 w-1.5 bg-white/45 group-hover:bg-white/80"
                }`}
              />
              {/* Timer ring on the active dot. Keyed on the index so it restarts each
                  time the slide changes. */}
              {i === selectedIndex && !reduced && (
                <svg viewBox="0 0 36 36" className="pointer-events-none absolute inset-0 h-9 w-9 -rotate-90">
                  <motion.circle
                    key={selectedIndex}
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    pathLength={1}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Scroll hint — hidden on small screens where the statement card already
          signals there's more below. */}
      <div
        aria-hidden
        className="absolute right-8 bottom-10 hidden flex-col items-center gap-2 text-white/60 sm:flex"
      >
        <span className="font-display text-[0.625rem] font-bold tracking-[0.25em] uppercase [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="hv-nudge block h-8 w-px bg-gradient-to-b from-white/70 to-transparent" />
      </div>
    </section>
  );
}
