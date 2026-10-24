/* eslint-disable @next/next/no-img-element -- Sanity CDN images, sized in the URL */
import Link from "next/link";

import type { LinkDoc, SectionIntroDoc } from "@/types/sanity";
import { ArrowButton, Chip, LineLink, MixedHeading, PillLink } from "../Actions";
import { Plus } from "../Icons";

/** EllisDon's rounded blue panel with one centred line. */
export function StatementPanel({ text, cta }: { text?: string; cta?: LinkDoc }) {
  if (!text) return null;
  return (
    <section className="px-3 py-10 sm:px-6">
      <div className="relative mx-auto max-w-[1392px] overflow-hidden rounded-[20px] bg-[var(--hv-blue)] px-6 py-[clamp(56px,7vw,96px)] text-center text-white sm:px-10">
        <div aria-hidden className="hv-dots absolute inset-0 opacity-[0.14]" />
        <p className="relative mx-auto max-w-[1000px] text-[clamp(30px,4.2vw,60px)] leading-[1.04] tracking-[-0.04em]">{text}</p>
        {cta?.label && (
          <div className="relative mt-12">
            <PillLink link={cta} />
          </div>
        )}
      </div>
    </section>
  );
}

/** Bechtel's two-column block: label, large heading, a line of copy, arrow button, photo on dots. */
export function WhyChooseBlock({
  eyebrow,
  heading,
  body,
  cta,
  imageUrl,
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  cta?: LinkDoc;
  imageUrl?: string;
}) {
  if (!heading) return null;
  return (
    <section className="relative py-24">
      <div aria-hidden className="hv-dots absolute inset-y-0 right-0 w-1/2" />
      <div className="hv-wrap relative grid items-center gap-[72px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)]">
        <div>
          {eyebrow && <p className="hv-mono mb-6 text-[15px] text-[var(--hv-green)]">{eyebrow}</p>}
          <h2 className="hv-h2">{heading}</h2>
          {body && <p className="hv-lead mt-12 max-w-[540px]">{body}</p>}
          {cta?.label && (
            <div className="mt-12">
              <ArrowButton link={cta} />
            </div>
          )}
        </div>
        {imageUrl && (
          <div className="h-[clamp(360px,47vw,672px)] overflow-hidden rounded-lg">
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}

/** EllisDon's key metrics: chip, mixed heading, then very large figures. */
export function Metrics({ intro, stats }: { intro?: SectionIntroDoc; stats: { value: string; label: string }[] }) {
  if (stats.length === 0) return null;
  return (
    <section className="pt-24 pb-[72px]">
      <div className="hv-wrap">
        <Chip>{intro?.eyebrow}</Chip>
        <div className="mt-6 max-w-[900px]">
          <MixedHeading heading={intro?.heading} emphasis={intro?.headingEmphasis} />
        </div>
        <div className="mt-[72px] grid gap-10 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={`${s.value}-${s.label}`}>
              <div className="text-[clamp(80px,10.4vw,150px)] leading-none font-bold tracking-[-0.03em] text-[var(--hv-blue)]">
                {s.value}
              </div>
              <div className="mt-4 text-[30px] leading-[1.2] font-bold text-[var(--hv-muted)]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export type DivisionCard = { slug: string; name: string; tagline?: string; description?: string; imageUrl?: string };

/** EllisDon's tall division cards with the plus icon; Bechtel's reveal on hover. */
export function DivisionCards({
  intro,
  divisions,
  linkLabel,
}: {
  intro?: SectionIntroDoc;
  divisions: DivisionCard[];
  linkLabel?: string;
}) {
  if (divisions.length === 0) return null;
  return (
    <section id="divisions" className="scroll-mt-32 pt-[72px] pb-[120px]">
      <div className="hv-wrap">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <Chip>{intro?.eyebrow}</Chip>
            <div className="mt-6">
              <MixedHeading heading={intro?.heading} emphasis={intro?.headingEmphasis} />
            </div>
          </div>
          {intro?.description && <p className="m-0 text-lg leading-[25.2px]">{intro.description}</p>}
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {divisions.map((d) => (
            <Link
              key={d.slug}
              href={`/${d.slug}`}
              className="hv-photo-card is-zoom h-[clamp(440px,40vw,577px)] rounded-[20px] bg-[var(--hv-tint)] [--hv-rise:64px]"
            >
              {d.imageUrl && <img src={d.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />}
              <span className="hv-card-icon is-plus absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--hv-blue)]">
                <Plus />
              </span>
              <div className="hv-card-body p-8">
                {d.tagline && <p className="hv-mono mb-2.5 text-[15px] leading-[22.5px] text-[var(--hv-green-light)]">{d.tagline}</p>}
                <h3 className="text-[clamp(34px,3vw,44px)] leading-none font-bold tracking-[-0.04em]">{d.name}</h3>
                <div className="hv-card-more">
                  {d.description && <p className="mt-3.5 max-w-[42ch] text-base leading-6">{d.description}</p>}
                  {linkLabel && <p className="hv-mono mt-4 text-[13px] text-[var(--hv-green-light)]">{linkLabel} →</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Bechtel's full-bleed photo band: heading left with a light arrow button, copy right. */
export function NarrativeBand({
  heading,
  body,
  cta,
  imageUrl,
}: {
  heading?: string;
  body?: string;
  cta?: LinkDoc;
  imageUrl?: string;
}) {
  if (!heading) return null;
  return (
    <section className="relative h-[clamp(640px,62vw,900px)] overflow-hidden bg-[#0e1b14] text-white">
      {imageUrl && <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      <div className="absolute inset-0 bg-[rgb(8_16_12/0.6)]" />
      <div className="hv-wrap relative grid h-full items-end gap-14 pb-[90px] lg:grid-cols-2">
        <div>
          <h2 className="hv-h2 !text-white">{heading}</h2>
          {cta?.label && (
            <div className="mt-14">
              <ArrowButton link={cta} light />
            </div>
          )}
        </div>
        {body && <p className="hv-lead max-w-[600px] lg:pb-24">{body}</p>}
      </div>
    </section>
  );
}

export type GalleryImage = { url: string; alt?: string };

/** Turner's grid: vertical guide lines, one large photo and four small ones. */
export function GalleryGrid({
  eyebrow,
  heading,
  images,
  link,
}: {
  eyebrow?: string;
  heading?: string;
  images: GalleryImage[];
  link?: LinkDoc;
}) {
  if (images.length === 0) return null;
  const [big, ...rest] = images;
  return (
    <section className="relative border-t border-[var(--hv-line)]">
      <div aria-hidden className="hv-vlines">
        <i style={{ left: "25%" }} />
        <i style={{ left: "75%" }} />
      </div>
      <div className="hv-wrap relative py-[104px]">
        {eyebrow && (
          <p className="hv-mono mb-5 text-sm tracking-[0.06em] text-[var(--hv-muted)] lg:pl-[74px]">{eyebrow}</p>
        )}
        {heading && (
          <h2 className="text-5xl leading-none tracking-[-0.015em] text-[#17171b] lg:pl-[74px]">{heading}</h2>
        )}
        <div className="mt-[72px] grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-[72px]">
          <div className="hv-zoom h-[clamp(280px,30vw,420px)]">
            <img src={big.url} alt={big.alt ?? ""} className="h-full w-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            {rest.slice(0, 4).map((img) => (
              <div key={img.url} className="hv-zoom h-[clamp(140px,14vw,198px)]">
                <img src={img.url} alt={img.alt ?? ""} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        {link?.label && (
          <div className="mt-8">
            <LineLink link={link} />
          </div>
        )}
      </div>
    </section>
  );
}

export type PropertyCard = {
  href: string;
  title: string;
  location?: string;
  imageUrl?: string;
  status: "available" | "reserved" | "sold";
  statusLabel?: string;
  eyebrow?: string;
  specs?: string;
};

const STATUS_STYLE: Record<PropertyCard["status"], string> = {
  available: "bg-[var(--hv-green-faded)] text-[var(--hv-green-dark)]",
  reserved: "bg-[#fdecc8] text-[#7a4a00]",
  sold: "bg-[#e5e7eb] text-[#374151]",
};

/** Turner-style listing cards: photo, status, light title, uppercase arrow link. */
export function PropertyGrid({
  intro,
  properties,
  cardLinkLabel,
  cta,
  emptyText,
}: {
  intro?: SectionIntroDoc;
  properties: PropertyCard[];
  cardLinkLabel?: string;
  cta?: LinkDoc;
  emptyText?: string;
}) {
  return (
    <section className="relative border-t border-[var(--hv-line)]">
      <div aria-hidden className="hv-vlines">
        <i style={{ left: "25%" }} />
        <i style={{ left: "75%" }} />
      </div>
      <div className="hv-wrap relative pt-[104px] pb-[120px]">
        <div className="grid items-end gap-[72px] lg:grid-cols-2">
          <div>
            {intro?.eyebrow && (
              <p className="hv-mono mb-5 text-sm tracking-[0.06em] text-[var(--hv-muted)] lg:pl-[74px]">{intro.eyebrow}</p>
            )}
            {intro?.heading && (
              <h2 className="text-5xl leading-[1.05] tracking-[-0.015em] text-[#17171b] lg:pl-[74px]">{intro.heading}</h2>
            )}
          </div>
          {intro?.description && <p className="m-0 max-w-[420px] text-xl leading-7 text-[#17171b]">{intro.description}</p>}
        </div>
        {properties.length === 0 ? (
          emptyText && <p className="mt-16 text-lg text-[var(--hv-muted)]">{emptyText}</p>
        ) : (
          <div className="mt-[72px] grid gap-12 md:grid-cols-3">
            {properties.map((p) => (
              <PropertyTile key={p.href} property={p} linkLabel={cardLinkLabel} />
            ))}
          </div>
        )}
        {cta?.label && (
          <div className="mt-[72px]">
            <ArrowButton link={cta} />
          </div>
        )}
      </div>
    </section>
  );
}

/** Turner-style listing card: photo, status, light title, uppercase arrow link. */
export function PropertyTile({ property: p, linkLabel }: { property: PropertyCard; linkLabel?: string }) {
  return (
    <Link href={p.href} className="group block">
      <div className="hv-zoom h-[230px] bg-[var(--hv-tint)]">
        {p.imageUrl && (
          <img src={p.imageUrl} alt="" className={`h-full w-full object-cover ${p.status === "sold" ? "grayscale" : ""}`} />
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {p.statusLabel && (
          <span className={`hv-mono inline-flex rounded-full px-2.5 py-1 text-xs tracking-[0.06em] ${STATUS_STYLE[p.status]}`}>
            {p.statusLabel}
          </span>
        )}
        {p.eyebrow && <span className="hv-mono text-xs tracking-[0.06em] text-[var(--hv-muted)]">{p.eyebrow}</span>}
      </div>
      <h3 className="mt-3.5 text-[26px] leading-[1.1] text-[#17171b]">{p.title}</h3>
      {p.location && <p className="mt-2 text-base leading-6 text-[var(--hv-muted)]">{p.location}</p>}
      {p.specs && <p className="mt-3 border-t border-[var(--hv-line)] pt-3 text-sm text-[var(--hv-muted)]">{p.specs}</p>}
      {linkLabel && (
        <span className="hv-tlink mt-6 group-hover:text-[var(--hv-ink)]">
          {linkLabel}
          <svg width="36" height="12" viewBox="0 0 36 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="group-hover:animate-[hv-tnudge_1s_ease-in-out_infinite]">
            <path d="M1 6h33M29 1l5 5-5 5" />
          </svg>
        </span>
      )}
    </Link>
  );
}
