"use client";

import { useEffect, useRef, useState } from "react";

import { fill } from "@/lib/fill";
import type { LinkDoc } from "@/types/sanity";
import { ArrowButton } from "./Actions";
import { ArrowLeft, ArrowRight } from "./Icons";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";

/**
 * Bechtel's featured projects row: cards run off the right edge, with a progress bar,
 * round prev/next buttons and a "1 – 3 of 4" counter underneath.
 */
export function ProjectsCarousel({
  heading,
  cta,
  projects,
  labels,
  emptyText,
}: {
  heading?: string;
  cta?: LinkDoc;
  projects: ProjectCardData[];
  labels: { previous?: string; next?: string; counter?: string };
  emptyText?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(0);
  const [visible, setVisible] = useState(3);
  const count = projects.length;

  // Works out how many whole cards fit, so the counter and the buttons stay honest at
  // every width.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const card = el.querySelector<HTMLElement>("[data-card]");
      if (!card) return;
      const step = card.offsetWidth + 32;
      setVisible(Math.max(1, Math.floor((el.parentElement!.clientWidth + 32) / step)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el.parentElement!);
    return () => ro.disconnect();
  }, [count]);

  const maxStart = Math.max(0, count - visible);
  const current = Math.min(start, maxStart);

  const go = (to: number) => {
    const next = Math.max(0, Math.min(maxStart, to));
    setStart(next);
    const card = track.current?.querySelectorAll<HTMLElement>("[data-card]")[next];
    if (card && track.current) track.current.scrollTo({ left: card.offsetLeft - track.current.offsetLeft, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    if (!el || !card) return;
    setStart(Math.round(el.scrollLeft / (card.offsetWidth + 32)));
  };

  return (
    <section id="projects" className="scroll-mt-32 overflow-hidden pt-[120px] pb-28">
      <div className="hv-wrap flex flex-wrap items-end justify-between gap-8">
        {heading && <h2 className="hv-h2">{heading}</h2>}
        <ArrowButton link={cta} />
      </div>

      {count === 0 ? (
        emptyText && <p className="hv-wrap mt-12 text-lg text-[var(--hv-muted)]">{emptyText}</p>
      ) : (
        <>
          <div className="mt-14 pl-[max(20px,calc((100%-1240px)/2))] sm:pl-[max(40px,calc((100%-1240px)/2))]">
            <div
              ref={track}
              onScroll={onScroll}
              className="flex snap-x snap-mandatory gap-8 overflow-x-auto pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {projects.map((p) => (
                <div key={p.href} data-card className="shrink-0 snap-start">
                  <ProjectCard project={p} className="h-[clamp(440px,46vw,667px)] w-[clamp(300px,34.7vw,500px)]" />
                </div>
              ))}
            </div>
          </div>

          <div className="hv-wrap mt-8">
            <div className="relative h-2 overflow-hidden rounded-lg bg-[var(--hv-green-faded)]">
              <div
                className="absolute inset-y-0 rounded-lg bg-[var(--hv-green)] transition-[left,width] duration-500"
                style={{
                  width: `${(Math.min(visible, count) / count) * 100}%`,
                  left: `${maxStart === 0 ? 0 : (current / maxStart) * (100 - (Math.min(visible, count) / count) * 100)}%`,
                }}
              />
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button type="button" className="hv-cbtn" aria-label={labels.previous} disabled={current === 0} onClick={() => go(current - 1)}>
                <ArrowLeft size={16} />
              </button>
              <span className="font-[family-name:var(--font-mono)] text-sm text-[var(--hv-green)]" aria-live="polite">
                {fill(labels.counter, { from: current + 1, to: Math.min(current + visible, count), total: count })}
              </span>
              <button type="button" className="hv-cbtn" aria-label={labels.next} disabled={current >= maxStart} onClick={() => go(current + 1)}>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
