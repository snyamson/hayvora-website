/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import type { LinkDoc, SectionIntroDoc } from "@/types/sanity";
import { ArrowButton, Chip, MixedHeading } from "../Actions";
import { ProjectCard, type ProjectCardData } from "../ProjectCard";

export type Crumb = { label: string; href?: string };

/** Interior hero in the Bechtel style: photo, breadcrumb, mono label, big headline. */
export function PageBanner({
  crumbs,
  crumbLabel,
  eyebrow,
  heading,
  description,
  imageUrl,
  imageAlt = "",
  short = false,
}: {
  crumbs: Crumb[];
  crumbLabel?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  imageUrl?: string;
  /** What the photo shows; empty only for decoration. */
  imageAlt?: string;
  short?: boolean;
}) {
  return (
    <section
      className={`relative overflow-hidden bg-[#0f2a1d] text-white ${short ? "h-[clamp(460px,44vw,560px)]" : "h-[clamp(560px,53vw,760px)]"}`}
    >
      {imageUrl && <img src={imageUrl} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,20,16,0.72)_0%,rgba(10,20,16,0.38)_70%)]" />
      <div className="hv-wrap relative flex h-full flex-col justify-end pb-[clamp(56px,7vw,104px)]">
        {crumbs.length > 0 && (
          <nav aria-label={crumbLabel} className="hv-mono flex flex-wrap gap-2.5 text-[13px] leading-[18px] text-white/80">
            {crumbs.map((c, i) => (
              <span key={`${c.label}-${i}`} className="flex gap-2.5">
                {i > 0 && <span aria-hidden>/</span>}
                {c.href ? (
                  <Link href={c.href} className="text-white hover:text-[var(--hv-green-light)] hover:underline">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="hv-mono mt-10 text-[15px] leading-[22.5px] text-[var(--hv-green-light)]">{eyebrow}</p>}
        {heading && (
          <h1
            className={`mt-4 max-w-[1000px] leading-none font-normal ${short ? "text-[clamp(40px,5vw,72px)]" : "text-[clamp(44px,6.67vw,96px)]"}`}
          >
            {heading}
          </h1>
        )}
        {description && <p className="hv-lead mt-6 max-w-[720px] text-white/90">{description}</p>}
      </div>
    </section>
  );
}

/** Bechtel's centred block between dotted margins. */
export function CentredOverview({ heading, paragraphs, cta }: { heading?: string; paragraphs: string[]; cta?: LinkDoc }) {
  if (!heading && paragraphs.length === 0) return null;
  return (
    <section className="relative py-[120px]">
      <div aria-hidden className="hv-dots absolute inset-y-0 left-0 w-[18%] max-lg:hidden" />
      <div aria-hidden className="hv-dots absolute inset-y-0 right-0 w-[18%] max-lg:hidden" />
      <div className="relative mx-auto max-w-[810px] px-5 sm:px-10">
        {heading && <h2 className="text-center text-[42px] leading-[63px] text-[var(--hv-blue)]">{heading}</h2>}
        {paragraphs.map((p, i) => (
          <p key={i} className={`hv-lead ${i === 0 ? "mt-10" : "mt-8"}`}>
            {p}
          </p>
        ))}
        {cta?.label && (
          <div className="mt-12">
            <ArrowButton link={cta} />
          </div>
        )}
      </div>
    </section>
  );
}

/** EllisDon's paired panels, one blue, one tint. */
export function VisionMission({
  vision,
  mission,
  visionLabel,
  missionLabel,
}: {
  vision?: string;
  mission?: string;
  visionLabel?: string;
  missionLabel?: string;
}) {
  if (!vision && !mission) return null;
  return (
    <section className="px-3 pb-10 sm:px-6">
      <div className="mx-auto grid max-w-[1392px] gap-6 lg:grid-cols-2">
        {vision && (
          <div className="rounded-[20px] bg-[var(--hv-blue)] p-[clamp(32px,5vw,72px)] text-white">
            <Chip>{visionLabel}</Chip>
            <p className="mt-8 text-[clamp(24px,2.3vw,32px)] leading-[1.12] font-bold tracking-[-0.03em]">{vision}</p>
          </div>
        )}
        {mission && (
          <div className="rounded-[20px] bg-[var(--hv-tint)] p-[clamp(32px,5vw,72px)] text-[var(--hv-blue)]">
            <Chip>{missionLabel}</Chip>
            <p className="mt-8 text-[clamp(24px,2.3vw,32px)] leading-[1.12] font-bold tracking-[-0.03em]">{mission}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/** Turner's culture grid: titles and copy between hairlines, under the column guides. */
export function ValuesGrid({ intro, values }: { intro?: SectionIntroDoc; values: { title: string; description?: string }[] }) {
  if (values.length === 0) return null;
  return (
    <section className="relative pt-[104px]">
      <div aria-hidden className="hv-vlines">
        <i style={{ left: "25%" }} />
        <i style={{ left: "75%" }} />
      </div>
      <div className="hv-wrap relative">
        {intro?.eyebrow && (
          <p className="hv-mono mb-5 text-sm tracking-[0.06em] text-[var(--hv-muted)] lg:pl-[74px]">{intro.eyebrow}</p>
        )}
        {intro?.heading && (
          <h2 className="text-5xl leading-none tracking-[-0.015em] text-[#17171b] lg:pl-[74px]">{intro.heading}</h2>
        )}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="group border-t border-[var(--hv-line)] px-9 pt-10 pb-12 transition-colors duration-300 hover:bg-[#f4f7f5]">
              <h3 className="text-[26px] leading-[1.1] text-[#17171b] transition-colors duration-300 group-hover:text-[var(--hv-green)]">
                {v.title}
              </h3>
              {v.description && <p className="mt-4 text-[17px] leading-[26px] text-[#3b484d]">{v.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** EllisDon metrics layout reused for who the division serves and where it works. */
export function ClientsAndZone({
  clientsIntro,
  clients,
  zoneLabel,
  zone,
  zoneNote,
}: {
  clientsIntro?: SectionIntroDoc;
  clients: string[];
  zoneLabel?: string;
  zone?: string;
  zoneNote?: string;
}) {
  if (clients.length === 0 && !zone) return null;
  return (
    <section className="border-t border-[var(--hv-line)] pt-28 pb-24">
      <div className="hv-wrap grid gap-[72px] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {clients.length > 0 && (
          <div>
            <Chip>{clientsIntro?.eyebrow}</Chip>
            <div className="mt-6">
              <MixedHeading heading={clientsIntro?.heading} emphasis={clientsIntro?.headingEmphasis} />
            </div>
            <div className="mt-10 flex flex-wrap gap-2.5">
              {clients.map((c) => (
                <span key={c} className="inline-flex h-11 items-center rounded-full border border-[var(--hv-chip-line)] bg-white px-5 text-[17px] text-[var(--hv-blue)]">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
        {zone && (
          <div>
            <Chip>{zoneLabel}</Chip>
            <div className="mt-6 text-[clamp(48px,5.5vw,80px)] leading-none font-bold tracking-[-0.04em] text-[var(--hv-blue)]">
              {zone}
            </div>
            {zoneNote && <p className="mt-6 max-w-[460px] text-lg leading-[26px]">{zoneNote}</p>}
          </div>
        )}
      </div>
    </section>
  );
}

/** Four Bechtel hover cards in a row. */
export function ProjectsGrid({
  heading,
  cta,
  projects,
  emptyText,
}: {
  heading?: string;
  cta?: LinkDoc;
  projects: ProjectCardData[];
  emptyText?: string;
}) {
  if (projects.length === 0 && !emptyText) return null;
  return (
    <section className="pt-10 pb-[120px]">
      <div className="hv-wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          {heading && <h2 className="hv-h2">{heading}</h2>}
          <ArrowButton link={cta} />
        </div>
        {projects.length === 0 ? (
          <p className="mt-12 text-lg text-[var(--hv-muted)]">{emptyText}</p>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((p) => (
              <ProjectCard key={p.href} project={p} compact className="h-[clamp(420px,39vw,560px)]" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
