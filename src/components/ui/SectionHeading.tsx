import { Reveal } from "@/components/ui/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
}) {
  const titleColor = theme === "dark" ? "text-white" : "text-brand-ink";
  const descriptionColor = theme === "dark" ? "text-white/70" : "text-brand-ink/70";

  return (
    <Reveal className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p className="mb-3 font-display text-sm font-bold tracking-[0.25em] text-brand-secondary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className={`font-display text-4xl font-bold tracking-tight sm:text-5xl ${titleColor}`}>{title}</h2>
      {description && (
        <p className={`mt-4 max-w-2xl text-base ${descriptionColor} ${align === "center" ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
      <div className={`mt-6 h-1 w-16 bg-brand-secondary ${align === "center" ? "mx-auto" : ""}`} />
    </Reveal>
  );
}
