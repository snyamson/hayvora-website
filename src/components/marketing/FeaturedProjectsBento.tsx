"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { PortableText } from "@/components/portable-text/PortableText";

export type BentoProject = {
  slug: string;
  brandSlug: string;
  title: string;
  category?: string;
  client?: string;
  duration?: string;
  location?: string;
  summary?: string;
  description?: unknown;
  coverImageUrl?: string;
  gallery?: { url: string; alt?: string }[];
};

// Repeating 6-tile bento pattern on a 4-column grid; `grid-flow-dense` packs
// remaining tiles into any gaps, so the pattern still holds up for any count.
const BENTO_SPANS = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
];

export function FeaturedProjectsBento({ projects }: { projects: BentoProject[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openProject = openIndex !== null ? projects[openIndex] : null;

  useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [openIndex]);

  if (projects.length === 0) {
    return <p className="text-brand-ink/60">Featured projects will appear here once they&apos;re published.</p>;
  }

  return (
    <>
      <div className="grid auto-rows-[160px] grid-cols-2 grid-flow-dense gap-4 sm:auto-rows-[200px] sm:grid-cols-4">
        {projects.map((project, i) => (
          <button
            key={project.slug}
            onClick={() => setOpenIndex(i)}
            className={`group relative block overflow-hidden rounded-card bg-brand-surface text-left ${BENTO_SPANS[i % BENTO_SPANS.length]}`}
          >
            {project.coverImageUrl ? (
              <Image
                src={project.coverImageUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-brand-primary/15 to-brand-accent/25" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95" />
            <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 transition-transform duration-500 ease-out group-hover:translate-y-0">
              {project.category && (
                <p className="font-display text-xs font-bold tracking-widest text-brand-secondary uppercase opacity-0 transition-opacity delay-100 duration-500 group-hover:opacity-100">
                  {project.category}
                </p>
              )}
              <p className="font-display mt-1 text-lg font-bold tracking-tight text-white sm:text-xl">
                {project.title}
              </p>
              <p className="font-display mt-2 text-xs font-bold tracking-widest text-white/0 uppercase transition-all delay-150 duration-500 group-hover:text-white/80">
                View Project →
              </p>
            </div>
          </button>
        ))}
      </div>

      {openProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-8"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-card bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenIndex(null)}
              aria-label="Close"
              className="font-display absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-brand-ink shadow-md hover:bg-brand-surface"
            >
              ×
            </button>

            {openProject.coverImageUrl && (
              <div className="relative aspect-video w-full">
                <Image src={openProject.coverImageUrl} alt={openProject.title} fill className="object-cover" />
              </div>
            )}

            <div className="p-8 sm:p-10">
              {openProject.category && (
                <p className="font-display text-xs font-bold tracking-widest text-brand-secondary uppercase">
                  {openProject.category}
                </p>
              )}
              <h3 className="font-display mt-2 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
                {openProject.title}
              </h3>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-brand-ink/60">
                {openProject.client && <span>Client: {openProject.client}</span>}
                {openProject.duration && <span>{openProject.duration}</span>}
                {openProject.location && <span>{openProject.location}</span>}
              </div>

              <div className="mt-6">
                {openProject.description ? (
                  <PortableText value={openProject.description} />
                ) : openProject.summary ? (
                  <p className="leading-relaxed text-brand-ink/80">{openProject.summary}</p>
                ) : null}
              </div>

              {openProject.gallery && openProject.gallery.length > 0 && (
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {openProject.gallery.map((img, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-card">
                      <Image src={img.url} alt={img.alt ?? ""} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <a
                href={`/${openProject.brandSlug}/projects/${openProject.slug}`}
                className="font-display mt-8 inline-block text-sm font-bold tracking-wide text-brand-primary uppercase hover:underline"
              >
                View full project page →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
