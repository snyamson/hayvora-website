export function ProcessSteps({ steps }: { steps: { title: string; description?: string }[] }) {
  if (steps.length === 0) return null;

  return (
    <ol className="grid grid-cols-1 gap-px overflow-hidden bg-brand-primary/15 sm:grid-cols-3">
      {steps.map((step, i) => (
        <li key={step.title} className="bg-white p-8">
          <span className="font-display text-sm font-bold text-brand-secondary">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="font-display mt-4 text-xl font-bold tracking-tight text-brand-ink">{step.title}</p>
          {step.description && <p className="mt-3 text-sm leading-relaxed text-brand-ink/70">{step.description}</p>}
        </li>
      ))}
    </ol>
  );
}
