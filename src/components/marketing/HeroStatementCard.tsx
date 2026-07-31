import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Solid white card anchored bottom-right that straddles the hero's bottom edge — the top
 * of it sits on the hero video, the rest on the section below. The negative top margin
 * keeps it in normal flow, so the following section simply starts underneath it and the
 * carousel's overflow-hidden never clips it.
 */
export function HeroStatementCard({ eyebrow = "Our Commitment", text }: { eyebrow?: string; text: string }) {
  return (
    <Container className="relative z-10 -mt-14 sm:-mt-20 lg:-mt-28">
      <Reveal className="ml-auto max-w-md rounded-card bg-white p-8 shadow-[0_24px_60px_-24px_rgba(10,10,10,0.45)] sm:max-w-lg sm:p-12">
        <div className="h-1 w-12 bg-brand-secondary" />
        <p className="font-display mt-5 text-xs font-bold tracking-[0.2em] text-brand-secondary uppercase">
          {eyebrow}
        </p>
        <p className="mt-4 text-base leading-relaxed text-brand-ink/80 sm:text-lg">{text}</p>
      </Reveal>
    </Container>
  );
}
