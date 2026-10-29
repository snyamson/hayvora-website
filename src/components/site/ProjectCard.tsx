/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { ArrowUpRight } from "./Icons";

export type ProjectCardData = { href: string; title: string; eyebrow?: string; meta?: string; imageUrl?: string; imageAlt?: string };

/** Bechtel's hover card: the overlay darkens, the title rises and the extra line fades in. */
export function ProjectCard({
  project,
  className = "",
  compact = false,
}: {
  project: ProjectCardData;
  className?: string;
  /** Narrow grid cards: less room kept for the arrow, smaller title. */
  compact?: boolean;
}) {
  return (
    <Link href={project.href} className={`hv-photo-card rounded-lg bg-[#16241c] ${className}`}>
      {project.imageUrl && (
        <img src={project.imageUrl} alt={project.imageAlt || project.title} className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className={`hv-card-body [--hv-rise:36px] ${compact ? "pt-7 pr-[76px] pb-6 pl-6" : "pt-8 pr-24 pb-7 pl-8"}`}>
        {project.eyebrow && (
          <p className="hv-mono mb-2 text-[clamp(13px,1vw,15px)] leading-[22.5px] text-[var(--hv-green-light)]">
            {project.eyebrow}
          </p>
        )}
        <h3 className={`leading-[1.25] font-normal ${compact ? "text-[22px]" : "text-[clamp(24px,2.1vw,30px)]"}`}>{project.title}</h3>
        {project.meta && <p className="hv-card-more mt-3 text-base leading-6">{project.meta}</p>}
      </div>
      <span className={`hv-card-icon is-arrow absolute ${compact ? "right-5 bottom-5" : "right-6 bottom-6"} flex h-12 w-12 items-center justify-center rounded-full bg-[var(--hv-green)] text-white`}>
        <ArrowUpRight />
      </span>
    </Link>
  );
}
