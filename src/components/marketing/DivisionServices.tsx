"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { EASE_OUT } from "@/components/ui/Motion";
import type { DivisionService } from "@/lib/divisionContent";

/**
 * The division's service catalogue, as a two-pane explorer: the list of service groups
 * on the left, the selected group's detail and photography on the right.
 *
 * A plain stack of five headings each with six bullets is ~30 lines of list — accurate
 * but unreadable. Selecting one group at a time keeps the page short while leaving the
 * full catalogue one click away.
 *
 * Because only the active panel is mounted, the complete catalogue is also emitted once
 * in a visually hidden block at the end. That keeps every service indexable and
 * reachable by assistive technology regardless of which panel happens to be open.
 */
export function DivisionServices({
  services,
  imageUrls = [],
}: {
  services: DivisionService[];
  /** Photography paired with each group, by index. Falls back to the brand gradient. */
  imageUrls?: string[];
}) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  if (services.length === 0) return null;

  const current = services[active];
  // The group's own photo wins. Only when none is set does the page cycle the
  // division's pooled photography — which is why, with nothing uploaded, every group
  // ends up showing the same picture.
  const currentImage = current.imageUrl ?? imageUrls[active % Math.max(imageUrls.length, 1)];

  return (
    <>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
        {/* ---- Group list ---- */}
        <div>
          <ul className="flex flex-col gap-2">
            {services.map((service, i) => {
              const isActive = i === active;
              return (
                <li key={service.title}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-expanded={isActive}
                    className={`group relative flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-card border px-5 py-5 text-left transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                      isActive
                        ? "border-brand-secondary bg-brand-secondary text-white shadow-lift"
                        : "border-brand-line-soft bg-white text-brand-ink hover:-translate-y-0.5 hover:border-brand-line hover:shadow-soft"
                    }`}
                  >
                    <span
                      className={`font-display text-[0.6875rem] font-bold tracking-[0.15em] tabular-nums ${
                        isActive ? "text-white/70" : "text-brand-ink/40"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="font-display flex-1 text-[0.9375rem] leading-snug font-semibold tracking-tight">
                      {service.title}
                    </span>

                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-400 ${
                        isActive
                          ? "rotate-90 bg-white/15 text-white"
                          : "bg-brand-tint text-brand-primary group-hover:bg-brand-primary group-hover:text-white"
                      }`}
                    >
                      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
                        <path
                          d="M2 8h11M9 4l4 4-4 4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---- Detail ---- */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="min-w-0"
            >
              <h3 className="font-display text-2xl leading-tight font-semibold tracking-tight text-brand-ink sm:text-3xl">
                {current.title}
              </h3>

              <p className="mt-4 text-base leading-relaxed text-brand-ink/65">{current.description}</p>

              <ul className="mt-8 flex flex-col gap-3">
                {current.items.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={reduced ? false : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.06 + i * 0.05, ease: EASE_OUT }}
                    className="flex items-start gap-3 border-b border-brand-line-soft pb-3 text-sm leading-relaxed text-brand-ink/75 last:border-b-0"
                  >
                    <span aria-hidden className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          {/* Media pane. Sticky on large screens so the photo stays put while a long
              bullet list scrolls beside it. */}
          <div className="md:sticky md:top-28 md:self-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.title}
                initial={reduced ? false : { opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-tr-[38%] rounded-bl-[38%] rounded-tl-card rounded-br-card bg-brand-tint-deep shadow-lift"
              >
                {currentImage ? (
                  <Image
                    src={currentImage}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 28vw, (min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-brand-secondary via-brand-secondary-deep to-brand-primary" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary-deep/60 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display text-xs font-bold tracking-[0.18em] text-white/75 uppercase">
                    {String(active + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* The complete catalogue, for crawlers and for anyone who never triggers the
          interaction. `sr-only` keeps it out of the visual layout without hiding it
          from assistive technology the way `display: none` would. */}
      <div className="sr-only">
        <h3>Full service list</h3>
        {services.map((service) => (
          <section key={`sr-${service.title}`}>
            <h4>{service.title}</h4>
            <p>{service.description}</p>
            <ul>
              {service.items.map((item) => (
                <li key={`sr-${item}`}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
