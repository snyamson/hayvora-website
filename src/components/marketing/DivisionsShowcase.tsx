"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { BlueprintBackdrop, DIVISION_ART } from "@/components/ui/BlueprintArt";
import { Button } from "@/components/ui/Button";
import { EASE_OUT } from "@/components/ui/Motion";

export type ShowcaseDivision = {
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  imageUrl?: string;
};

/**
 * The divisions section: a numbered selector on a solid green panel, the selected
 * division's copy beside it, and its photography in an asymmetric "leaf" frame.
 *
 * Structure follows the Turner reference — a vertical numbered index where the active
 * row is marked by a dash and full-strength white, and the inactive rows sit back at
 * lower opacity — so the whole set of divisions is visible at once instead of being
 * hidden behind a carousel. The media treatment (sweeping corners on one diagonal,
 * tight corners on the other, with an overlapping panel carrying the CTA) follows the
 * ADCO reference.
 *
 * Selection is click-driven rather than hover-driven so it works identically on touch.
 */
export function DivisionsShowcase({ divisions }: { divisions: ShowcaseDivision[] }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  if (divisions.length === 0) return null;

  const current = divisions[active];
  const go = (next: number) => setActive((next + divisions.length) % divisions.length);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-16">
      {/* ---- Index panel ---- */}
      {/* Bleeds off the left edge on large screens so the panel reads as a slab the
          page sits on, rather than a floating card. */}
      <div className="relative overflow-hidden rounded-card bg-brand-secondary-deep lg:-ml-8 lg:rounded-l-none">
        {/* The drawing swaps with the selection, so the panel changes character as you
            move between divisions instead of staying one flat green block. */}
        <BlueprintBackdrop primary={(DIVISION_ART[current.slug] ?? DIVISION_ART.infrastructure).primary} />
        <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-brand-primary/25 blur-3xl" />

        <ul className="relative flex flex-row overflow-x-auto p-3 lg:flex-col lg:gap-1 lg:p-8">
          {divisions.map((division, i) => {
            const isActive = i === active;
            return (
              <li key={division.slug} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative flex w-full cursor-pointer items-center gap-4 rounded-control px-4 py-4 text-left transition-colors duration-300 lg:py-5 ${
                    isActive ? "text-white" : "text-white/45 hover:text-white/80"
                  }`}
                >
                  {/* Dash marker slides between rows via a shared layoutId. */}
                  <span className="relative hidden h-px w-5 shrink-0 lg:block">
                    {isActive && !reduced && (
                      <motion.span
                        layoutId="division-marker"
                        className="absolute inset-0 block bg-white"
                        transition={{ duration: 0.4, ease: EASE_OUT }}
                      />
                    )}
                    {isActive && reduced && <span className="absolute inset-0 block bg-white" />}
                  </span>

                  <span className="font-display text-[0.6875rem] font-bold tracking-[0.15em] tabular-nums opacity-70">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="font-display text-base font-semibold tracking-tight whitespace-nowrap lg:whitespace-normal">
                    {division.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---- Detail ---- */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-12">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <p className="font-display flex items-center gap-3 text-xs font-bold tracking-[0.22em] text-brand-secondary uppercase">
                <span className="h-px w-6 bg-brand-primary" />
                Division {String(active + 1).padStart(2, "0")}
              </p>

              <h3 className="font-display mt-5 text-3xl leading-[1.1] font-semibold tracking-tight text-brand-ink sm:text-4xl">
                {current.name}
              </h3>

              {current.tagline && (
                <p className="font-display mt-3 text-lg font-medium text-brand-secondary">{current.tagline}</p>
              )}

              {current.description && (
                <p className="mt-6 max-w-md text-base leading-relaxed text-brand-ink/65">{current.description}</p>
              )}

              <div className="mt-9">
                <Button href={`/${current.slug}`} variant="primary" withArrow>
                  Explore {current.name}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prev/next, mirroring the arrow pair used by the site's carousels. */}
          {divisions.length > 1 && (
            <div className="mt-12 flex items-center gap-2">
              <ArrowButton label="Previous division" onClick={() => go(active - 1)} direction="prev" />
              <ArrowButton label="Next division" onClick={() => go(active + 1)} direction="next" />
            </div>
          )}
        </div>

        {/* ---- Media ---- */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug}
              initial={reduced ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
              /* Sweeping corners on one diagonal, tight on the other — the asymmetric
                 "leaf" frame from the reference. Percentages so it holds at any size. */
              className="relative aspect-[4/5] w-full overflow-hidden rounded-tl-[45%] rounded-br-[45%] rounded-tr-card rounded-bl-card bg-brand-tint-deep shadow-lift sm:aspect-[4/4.4]"
            >
              {current.imageUrl ? (
                <Image
                  src={current.imageUrl}
                  alt={current.name}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-brand-secondary via-brand-secondary-deep to-brand-primary" />
              )}
              <div className="absolute inset-0 bg-brand-secondary-deep/15" />
            </motion.div>
          </AnimatePresence>

          {/* Overlapping panel with the secondary action, per the ADCO reference. */}
          <div className="absolute -bottom-2 -left-2 rounded-tr-card rounded-b-card rounded-tl-[2.5rem] bg-brand-secondary p-2 shadow-lift sm:-bottom-4 sm:-left-4">
            <Link
              href={`/${current.slug}/projects`}
              className="font-display flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.8125rem] font-bold tracking-wide text-white transition-colors duration-300 hover:bg-white/12"
            >
              View their work
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
                <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-brand-line text-brand-primary transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-0.5 hover:border-brand-primary hover:bg-brand-primary hover:text-white hover:shadow-lift"
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
