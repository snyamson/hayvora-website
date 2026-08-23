import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Motion";

/**
 * Solid card anchored bottom-right that straddles the hero's bottom edge — the top of
 * it sits on the hero media, the rest on the section below. The negative top margin
 * keeps it in normal flow, so the following section simply starts underneath it and
 * the hero's `overflow-hidden` never clips it.
 */
export function HeroStatementCard({ eyebrow = "Our Commitment", text }: { eyebrow?: string; text: string }) {
  return (
    <Container className="relative z-20 -mt-20 sm:-mt-24 lg:-mt-32">
      <Reveal delay={0.15} className="ml-auto max-w-md sm:max-w-lg">
        <div className="relative overflow-hidden rounded-card bg-white p-8 shadow-float sm:p-11">
          {/* Blue rule across the top edge — blue is the accent hue against the site's
              green, and this marks the card as the hero's closing statement. */}
          <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-brand-primary" />

          <p className="font-display flex items-center gap-3 text-xs font-bold tracking-[0.22em] text-brand-secondary uppercase">
            <span className="h-px w-6 bg-brand-secondary" />
            {eyebrow}
          </p>

          <p className="mt-5 text-base leading-relaxed text-brand-ink/75 sm:text-lg">{text}</p>
        </div>
      </Reveal>
    </Container>
  );
}
