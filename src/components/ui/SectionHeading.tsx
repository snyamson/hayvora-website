import type { ReactNode } from "react";

import { Reveal, TextReveal } from "@/components/ui/Motion";

/**
 * The heading block that opens every section on the site. Keeping the eyebrow rule,
 * type scale, measure and reveal timing in one place is what makes the page rhythm
 * feel deliberate rather than assembled.
 *
 * The title animates word-by-word via TextReveal; the eyebrow and description fade in
 * behind it, so the eye lands on the headline first.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "light",
  action,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  /** Optional trailing control — a "View all" button that sits opposite the heading. */
  action?: ReactNode;
  className?: string;
}) {
  const centered = align === "center";
  const titleColor = theme === "dark" ? "text-white" : "text-brand-ink";
  const descriptionColor = theme === "dark" ? "text-white/65" : "text-brand-ink/65";
  const eyebrowColor = theme === "dark" ? "text-white/70" : "text-brand-secondary";
  const ruleColor = theme === "dark" ? "bg-white/40" : "bg-brand-secondary";

  return (
    <div
      className={`flex flex-col gap-8 ${
        action && !centered ? "md:flex-row md:items-end md:justify-between" : ""
      } ${className}`}
    >
      <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
        {eyebrow && (
          <Reveal>
            <p
              className={`font-display flex items-center gap-3 text-xs font-bold tracking-[0.22em] uppercase ${eyebrowColor} ${
                centered ? "justify-center" : ""
              }`}
            >
              <span className={`h-px w-6 ${ruleColor}`} />
              {eyebrow}
              {centered && <span className={`h-px w-6 ${ruleColor}`} />}
            </p>
          </Reveal>
        )}

        <TextReveal
          as="h2"
          text={title}
          delay={0.08}
          className={`font-display mt-5 text-[2rem] leading-[1.08] font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] ${titleColor}`}
        />

        {description && (
          <Reveal delay={0.25}>
            <p className={`mt-5 text-base leading-relaxed sm:text-lg ${descriptionColor} ${centered ? "mx-auto" : ""}`}>
              {description}
            </p>
          </Reveal>
        )}
      </div>

      {action && (
        <Reveal delay={0.3} className={centered ? "mt-2 flex justify-center" : "shrink-0"}>
          {action}
        </Reveal>
      )}
    </div>
  );
}
