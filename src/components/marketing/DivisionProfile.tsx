import Image from "next/image";

import { BlueprintBackdrop, DIVISION_ART } from "@/components/ui/BlueprintArt";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ClipReveal, Parallax, Reveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { TiltCard } from "@/components/ui/TiltCard";
import type { DivisionContent } from "@/lib/divisionContent";

/**
 * The long-form profile sections of a division page: overview, vision and mission,
 * core values, and target clients.
 *
 * Values are rendered as pointer-tilting 3D cards (see TiltCard) — six short blocks of
 * text would otherwise be the flattest part of the page, and the tilt gives them the
 * physicality the rest of the page gets from photography.
 */

export function DivisionOverview({
  content,
  imageUrl,
  secondaryImageUrl,
}: {
  content: DivisionContent;
  imageUrl?: string;
  secondaryImageUrl?: string;
}) {
  return (
    <section className="hv-aura-bg section relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
          <div>
            <SectionHeading eyebrow="Overview" title={content.legalName} />

            <div className="mt-8 space-y-5">
              {content.overview.map((paragraph, i) => (
                <Reveal key={i} delay={0.1 + i * 0.08}>
                  <p className="text-base leading-[1.8] text-brand-ink/70 sm:text-lg">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <p className="font-display mt-10 border-l-2 border-brand-primary pl-6 text-xl leading-snug font-semibold tracking-tight text-brand-secondary sm:text-2xl">
                “{content.tagline}”
              </p>
            </Reveal>
          </div>

          {/* Two offset frames at different scroll speeds — the depth cue that stops a
              text-heavy section reading as a wall. */}
          <div className="relative">
            <ClipReveal className="relative aspect-[4/5] w-full overflow-hidden rounded-tl-[40%] rounded-br-[40%] rounded-tr-card rounded-bl-card bg-brand-tint-deep shadow-lift">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-brand-secondary via-brand-secondary-deep to-brand-primary" />
              )}
            </ClipReveal>

            {secondaryImageUrl && (
              <Parallax
                speed={34}
                className="absolute -bottom-10 -left-6 hidden w-40 sm:block lg:-left-12 lg:w-52"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-card border-4 border-white bg-brand-tint-deep shadow-float">
                  <Image src={secondaryImageUrl} alt="" fill sizes="13rem" className="object-cover" />
                </div>
              </Parallax>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function DivisionVisionMission({ content, slug }: { content: DivisionContent; slug: string }) {
  const panels = [
    { label: "Vision", body: content.vision },
    { label: "Mission", body: content.mission },
  ];

  // Each division gets the equipment it actually uses behind its band.
  const art = DIVISION_ART[slug] ?? DIVISION_ART.infrastructure;

  return (
    <section className="hv-grid-bg section relative overflow-hidden bg-brand-secondary-deep">
      <BlueprintBackdrop primary={art.primary} secondary={art.secondary} />

      <div
        aria-hidden
        className="hv-float pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-brand-primary/25 blur-3xl"
      />

      <Container className="relative">
        <Stagger gap={0.14} className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {panels.map((panel) => (
            <StaggerItem key={panel.label} y={30}>
              <div className="h-full rounded-card border border-white/12 bg-white/5 p-9 backdrop-blur-sm sm:p-11">
                <p className="font-display flex items-center gap-3 text-xs font-bold tracking-[0.22em] text-white/60 uppercase">
                  <span className="h-px w-6 bg-brand-primary-bright" />
                  {panel.label}
                </p>
                <p className="font-display mt-6 text-xl leading-[1.45] font-medium text-white sm:text-2xl">
                  {panel.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

/** Small numbers read better spelled out in a sentence than as digits. */
const COUNT_WORDS = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export function DivisionValues({ content }: { content: DivisionContent }) {
  // Derived rather than hardcoded: the previous copy said "Six commitments ... priced,
  // built, and handed over", which was both a fixed count and construction wording —
  // wrong on a surveying or agriculture division.
  const count = content.values.length;
  const countWord = COUNT_WORDS[count] ?? String(count);

  return (
    <section className="hv-aura-bg section relative">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Our Core Values"
          title="What we hold ourselves to"
          description={
            count > 0
              ? `${countWord} commitments that shape how every ${content.legalName} project is run.`
              : undefined
          }
        />

        <Stagger gap={0.07} className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.values.map((value, i) => (
            <StaggerItem key={value.title} y={28}>
              <TiltCard className="group h-full" intensity={6} depth={22}>
                <div className="relative flex h-full flex-col overflow-hidden rounded-card border border-brand-line-soft bg-white p-8 shadow-soft transition-shadow duration-500 group-hover:shadow-float">
                  <span className="font-display absolute top-6 right-7 text-4xl leading-none font-bold text-brand-secondary/10">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <ValueIcon index={i} />

                  <p className="font-display mt-7 text-lg font-semibold tracking-tight text-brand-ink">
                    {value.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-brand-ink/65">{value.description}</p>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export function DivisionClients({ content, slug }: { content: DivisionContent; slug: string }) {
  return (
    <section className="section bg-brand-tint">
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Who We Work With" title="Target clients" />

            <Stagger gap={0.06} as="ul" className="mt-10 flex flex-col gap-3">
              {content.clients.map((client) => (
                <StaggerItem as="li" key={client} y={14}>
                  <span className="flex items-center gap-4 rounded-card border border-brand-line-soft bg-white px-6 py-4 text-sm text-brand-ink/80 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                    <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                    {client}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal delay={0.15} className="lg:pt-24">
            <div className="relative overflow-hidden rounded-card bg-brand-secondary-deep p-10 shadow-lift sm:p-12">
              <BlueprintBackdrop primary={(DIVISION_ART[slug] ?? DIVISION_ART.infrastructure).secondary} />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-brand-primary/30 blur-3xl"
              />
              <p className="font-display relative flex items-center gap-3 text-xs font-bold tracking-[0.22em] text-white/60 uppercase">
                <span className="h-px w-6 bg-brand-primary-bright" />
                Operational Zone
              </p>
              <p className="font-display relative mt-6 text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl">
                {content.operationalZone}
              </p>
              {content.operationalNote && (
                <p className="relative mt-5 max-w-sm text-base leading-relaxed text-white/70">
                  {content.operationalNote}
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Value icons                                                                 */
/* -------------------------------------------------------------------------- */

const ICON_PATHS = [
  // Integrity — shield
  "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z",
  // Excellence — star
  "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5Z",
  // Professionalism — briefcase
  "M3.5 8.5h17v11h-17v-11ZM9 8.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v2.5",
  // Innovation — lightbulb
  "M9.5 18.5h5M10 21.5h4M12 2.5a6 6 0 0 0-3.5 10.9v2.1h7v-2.1A6 6 0 0 0 12 2.5Z",
  // Our People — group
  "M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2.5 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 6.2a3 3 0 0 1 0 5.6M17.5 14.8c2.3.6 4 2.5 4 5.2",
  // Safety — hard hat
  "M3.5 16.5h17M5.5 16.5v-3a6.5 6.5 0 0 1 13 0v3M10 7.6V4.5h4v3.1",
];

function ValueIcon({ index }: { index: number }) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-line bg-brand-tint text-brand-primary transition-colors duration-500 group-hover:border-brand-secondary group-hover:bg-brand-secondary group-hover:text-white">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path
          d={ICON_PATHS[index % ICON_PATHS.length]}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
