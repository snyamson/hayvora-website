import { Stagger, StaggerItem } from "@/components/ui/Motion";

/**
 * The "how we work" sequence. Rendered as an ordered list of numbered cards joined by
 * a hairline, so the steps read as one path rather than three unrelated tiles.
 *
 * The connector is drawn on the card (not between them) and hidden on the last item,
 * which keeps it correct at any step count without the parent needing to know one.
 */
export function ProcessSteps({ steps }: { steps: { title: string; description?: string }[] }) {
  if (steps.length === 0) return null;

  return (
    <Stagger as="ol" gap={0.12} className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-5">
      {steps.map((step, i) => (
        <StaggerItem
          as="li"
          key={step.title}
          y={28}
          className="group relative flex flex-col rounded-card border border-brand-line-soft bg-white p-8 shadow-soft transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-1 hover:border-brand-line hover:shadow-lift sm:p-9"
        >
          {/* Connector to the next step. Sits in the gutter between cards. */}
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="absolute top-14 -right-5 hidden h-px w-5 bg-brand-line sm:block"
            />
          )}

          <span className="font-display flex h-12 w-12 items-center justify-center rounded-full border border-brand-line bg-brand-tint text-sm font-bold text-brand-secondary transition-colors duration-500 group-hover:border-brand-secondary group-hover:bg-brand-secondary group-hover:text-white">
            {String(i + 1).padStart(2, "0")}
          </span>

          <p className="font-display mt-7 text-xl font-semibold tracking-tight text-brand-ink">{step.title}</p>

          {step.description && (
            <p className="mt-3 text-sm leading-relaxed text-brand-ink/65">{step.description}</p>
          )}
        </StaggerItem>
      ))}
    </Stagger>
  );
}
