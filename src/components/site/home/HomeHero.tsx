"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";

import type { HeroSlide } from "@/lib/brandHelpers";
import type { LinkDoc } from "@/types/sanity";
import { ArrowButton } from "../Actions";
import { ArrowUpRight, Chevron } from "../Icons";

export type HeroProject = { title: string; eyebrow?: string; imageUrl?: string; imageAlt?: string; href: string };

/**
 * Bechtel's homepage hero: full-bleed footage, a big plain headline bottom left, one
 * circle-arrow button, and a small project card slider bottom right.
 */
export function HomeHero({
  headline,
  subheadline,
  cta,
  media,
  projects,
  labels,
}: {
  headline?: string;
  subheadline?: string;
  cta?: LinkDoc;
  media?: HeroSlide;
  projects: HeroProject[];
  labels: { previous?: string; next?: string };
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = projects.length;
  const current = projects[index];

  useEffect(() => {
    if (count < 2 || paused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [count, paused]);

  return (
    <section className="relative h-[100svh] max-h-[900px] min-h-[640px] overflow-hidden bg-[#111827] text-white">
      {media?.type === "video" && (
        <video
          src={media.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {media?.type === "image" && (
        <img src={media.imageUrl} alt={media.alt ?? ""} className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,20,16,0.62)_0%,rgba(10,20,16,0.38)_60%,rgba(10,20,16,0.28)_100%)]" />

      <div className="hv-wrap relative flex h-full flex-col justify-end pb-[clamp(72px,15vh,136px)]">
        {headline && (
          <h1 className="m-0 max-w-[880px] text-[clamp(52px,6.67vw,96px)] leading-none font-normal">{headline}</h1>
        )}
        {subheadline && (
          <p className="mt-12 max-w-[760px] text-[clamp(18px,1.7vw,24px)] leading-[1.5] tracking-[0.02em]">{subheadline}</p>
        )}
        {cta?.label && (
          <div className="mt-[52px]">
            <ArrowButton link={cta} light large icon="up-right" />
          </div>
        )}
      </div>

      {current && (
        <div
          className="hv-hcard-wrap absolute right-[max(40px,calc((100%-1240px)/2))] bottom-[125px] hidden w-[298px] lg:block"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="hv-hback absolute top-[7%] -left-5 h-[86%] w-[60px] rounded-lg bg-white/90" />
          {count > 1 && (
            <>
              <button
                type="button"
                aria-label={labels.previous}
                onClick={() => setIndex((index - 1 + count) % count)}
                className="hv-hctl absolute top-1/2 -left-16 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-white"
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                aria-label={labels.next}
                onClick={() => setIndex((index + 1) % count)}
                className="hv-hctl absolute top-1/2 -right-16 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-white"
              >
                <Chevron dir="right" />
              </button>
            </>
          )}
          <Link href={current.href} className="hv-hcard relative block rounded-lg bg-white p-6 text-black">
            <div className="h-[140px] overflow-hidden rounded-lg bg-[var(--hv-tint)]">
              {current.imageUrl && <img src={current.imageUrl} alt={current.imageAlt ?? ""} className="h-full w-full object-cover" />}
            </div>
            {current.eyebrow && (
              <p className="hv-mono mt-6 text-[13px] leading-[18px] text-[var(--hv-muted)]">{current.eyebrow}</p>
            )}
            <h3 className="mt-1.5 min-h-[45px] text-lg leading-[22.5px] font-normal text-black">{current.title}</h3>
            <div className="mt-7 flex items-center justify-between">
              <div className="flex items-center gap-1.5" aria-hidden>
                {projects.map((p, i) => (
                  <span key={p.href} className="hv-dot" data-on={i === index} />
                ))}
              </div>
              <span className="hv-hlink flex h-12 w-12 items-center justify-center rounded-full bg-[var(--hv-green-faded)] text-[var(--hv-green)]">
                <ArrowUpRight />
              </span>
            </div>
          </Link>
        </div>
      )}
    </section>
  );
}
