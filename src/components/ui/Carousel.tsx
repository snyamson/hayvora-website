"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useReducedMotion } from "motion/react";
import { Children, useCallback, useEffect, useState, type ReactNode } from "react";

import { EASE_OUT } from "@/components/ui/Motion";

/**
 * The site's carousel. Properties, galleries and any future slider all use this one,
 * so drag feel, arrow styling, progress and keyboard behaviour are consistent.
 *
 * Beyond the drag that Embla gives us, this adds the three things a carousel needs to
 * be usable rather than just pretty:
 *   - real arrow buttons, disabled at the ends when the track doesn't loop
 *   - a progress bar, so it's obvious how much is left to scroll
 *   - arrow-key navigation once the track has focus
 *
 * Autoplay is dropped entirely when the visitor prefers reduced motion — a carousel
 * that advances on its own is exactly the kind of unrequested movement that setting
 * is asking us to stop.
 */
export function Carousel({
  children,
  slideClassName = "flex-[0_0_85%] sm:flex-[0_0_55%] lg:flex-[0_0_38%]",
  gapClassName = "pl-5",
  trackClassName = "-ml-5",
  autoplay = false,
  loop = true,
  align = "start",
  label = "Carousel",
  controls = "below",
}: {
  children: ReactNode;
  slideClassName?: string;
  gapClassName?: string;
  trackClassName?: string;
  autoplay?: boolean;
  loop?: boolean;
  align?: "start" | "center";
  label?: string;
  /** `below` puts arrows next to the progress bar; `overlay` floats them on the media. */
  controls?: "below" | "overlay";
}) {
  const reduced = useReducedMotion();
  const slides = Children.toArray(children);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop, align, dragFree: false, containScroll: loop ? undefined : "trimSnaps" },
    autoplay && !reduced ? [Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })] : [],
  );

  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    // Clamped because Embla reports past 0..1 while the track is rubber-banding.
    setProgress(Math.max(0, Math.min(1, emblaApi.scrollProgress())));
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect).on("reInit", onSelect).on("scroll", onScroll).on("reInit", onScroll);

    // Initial read is deferred a frame so it lands after this commit rather than
    // triggering a second render synchronously from the effect body.
    const frame = requestAnimationFrame(() => {
      setSnaps(emblaApi.scrollSnapList());
      onSelect();
      onScroll();
    });

    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("select", onSelect).off("reInit", onSelect).off("scroll", onScroll).off("reInit", onScroll);
    };
  }, [emblaApi, onSelect, onScroll]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      emblaApi?.scrollPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      emblaApi?.scrollNext();
    }
  };

  if (slides.length === 0) return null;

  const arrows = (
    <div className="flex items-center gap-2">
      <ArrowButton
        direction="prev"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!loop && !canPrev}
        floating={controls === "overlay"}
      />
      <ArrowButton
        direction="next"
        onClick={() => emblaApi?.scrollNext()}
        disabled={!loop && !canNext}
        floating={controls === "overlay"}
      />
    </div>
  );

  return (
    <div className="relative">
      <div
        ref={emblaRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="overflow-hidden rounded-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-secondary"
      >
        <div className={`flex touch-pan-y ${trackClassName}`}>
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`min-w-0 ${slideClassName} ${gapClassName}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {controls === "overlay" && (
        <div className="pointer-events-none absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
          <div className="pointer-events-auto">
            <ArrowButton direction="prev" onClick={() => emblaApi?.scrollPrev()} disabled={!loop && !canPrev} floating />
          </div>
          <div className="pointer-events-auto">
            <ArrowButton direction="next" onClick={() => emblaApi?.scrollNext()} disabled={!loop && !canNext} floating />
          </div>
        </div>
      )}

      {slides.length > 1 && (
        <div className="mt-8 flex items-center gap-6">
          {/* Progress rail — a truer signal of position than dots once there are more
              than a handful of slides. */}
          <div className="relative h-px flex-1 bg-brand-line">
            <motion.div
              className="absolute inset-y-0 left-0 bg-brand-secondary"
              animate={{ width: `${Math.max(progress * 100, 100 / slides.length)}%` }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            />
          </div>

          <p className="font-display shrink-0 text-xs font-bold tracking-[0.15em] text-brand-ink/45 tabular-nums">
            {String(selected + 1).padStart(2, "0")}
            <span className="mx-1 text-brand-ink/25">/</span>
            {String(snaps.length || slides.length).padStart(2, "0")}
          </p>

          {controls === "below" && arrows}
        </div>
      )}
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
  disabled,
  floating = false,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  floating?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] disabled:cursor-not-allowed disabled:opacity-30 ${
        floating
          ? "border border-white/25 bg-white/80 text-brand-primary shadow-lift backdrop-blur-md hover:bg-white"
          : "border border-brand-line text-brand-primary hover:-translate-y-0.5 hover:border-brand-primary hover:bg-brand-primary hover:text-white hover:shadow-lift"
      }`}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
        <path
          d={direction === "prev" ? "M14 8H3M7 4L3 8l4 4" : "M2 8h11M9 4l4 4-4 4"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
