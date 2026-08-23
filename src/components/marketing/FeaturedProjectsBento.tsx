"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { PortableText } from "@/components/portable-text/PortableText";
import { CardChip } from "@/components/ui/Card";
import { TextLink } from "@/components/ui/Button";
import { EASE_OUT } from "@/components/ui/Motion";

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
  // Remembers which tile opened the dialog so focus can go back there on close,
  // instead of being dumped at the top of the document.
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    // Move focus into the dialog so the keyboard doesn't stay behind on the page.
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      openerRef.current?.focus();
    };
  }, [openIndex]);

  if (projects.length === 0) {
    return <p className="text-brand-ink/55">Featured projects will appear here once they&apos;re published.</p>;
  }

  return (
    <>
      <div className="grid auto-rows-[150px] grid-flow-dense grid-cols-2 gap-4 sm:auto-rows-[200px] sm:grid-cols-4">
        {projects.map((project, i) => (
          <motion.button
            key={project.slug}
            onClick={(e) => {
              openerRef.current = e.currentTarget;
              setOpenIndex(i);
            }}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.6, delay: (i % 6) * 0.07, ease: EASE_OUT }}
            className={`group relative block cursor-pointer overflow-hidden rounded-card bg-brand-tint-deep text-left shadow-soft transition-shadow duration-500 hover:shadow-lift ${BENTO_SPANS[i % BENTO_SPANS.length]}`}
          >
            {project.coverImageUrl ? (
              <Image
                src={project.coverImageUrl}
                alt={project.title}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-110"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-brand-primary/15 to-brand-secondary/25" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary-deep/90 via-brand-secondary-deep/15 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

            <div className="absolute inset-x-0 bottom-0 p-5">
              {project.category && (
                <div className="mb-2.5 translate-y-1 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:translate-y-0 group-hover:opacity-100">
                  <CardChip>{project.category}</CardChip>
                </div>
              )}
              <p className="font-display text-base font-semibold tracking-tight text-white sm:text-lg">
                {project.title}
              </p>
              <p className="font-display mt-1.5 flex items-center gap-1.5 text-xs font-bold tracking-[0.12em] text-white/0 uppercase transition-colors delay-100 duration-500 group-hover:text-white/85">
                View project
                <span aria-hidden>→</span>
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {openProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-secondary-deep/85 p-4 backdrop-blur-md sm:p-8"
            onClick={() => setOpenIndex(null)}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={openProject.title}
              tabIndex={-1}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="relative max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-card bg-white shadow-float focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenIndex(null)}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/90 text-brand-ink shadow-lift backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary hover:text-white"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
                  <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>

              {openProject.coverImageUrl && (
                <div className="relative aspect-video w-full">
                  <Image
                    src={openProject.coverImageUrl}
                    alt={openProject.title}
                    fill
                    sizes="(min-width: 768px) 56rem, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>
              )}

              <div className="p-8 sm:p-10">
                {openProject.category && (
                  <p className="font-display flex items-center gap-3 text-xs font-bold tracking-[0.22em] text-brand-secondary uppercase">
                    <span className="h-px w-6 bg-brand-secondary" />
                    {openProject.category}
                  </p>
                )}

                <h3 className="font-display mt-4 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
                  {openProject.title}
                </h3>

                {(openProject.client || openProject.duration || openProject.location) && (
                  <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-brand-line-soft py-5 sm:grid-cols-3">
                    <Meta label="Client" value={openProject.client} />
                    <Meta label="Duration" value={openProject.duration} />
                    <Meta label="Location" value={openProject.location} />
                  </dl>
                )}

                <div className="mt-6">
                  {openProject.description ? (
                    <PortableText value={openProject.description} />
                  ) : openProject.summary ? (
                    <p className="leading-relaxed text-brand-ink/75">{openProject.summary}</p>
                  ) : null}
                </div>

                {openProject.gallery && openProject.gallery.length > 0 && (
                  <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {openProject.gallery.map((img, i) => (
                      <div key={i} className="group relative aspect-square overflow-hidden rounded-control">
                        <Image
                          src={img.url}
                          alt={img.alt ?? ""}
                          fill
                          sizes="(min-width: 640px) 18rem, 45vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-9">
                  <TextLink href={`/${openProject.brandSlug}/projects/${openProject.slug}`}>
                    View full project page
                  </TextLink>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Meta({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="font-display text-[0.6875rem] font-bold tracking-[0.15em] text-brand-ink/40 uppercase">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm text-brand-ink/80">{value}</dd>
    </div>
  );
}
