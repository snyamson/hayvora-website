export function StatsRow({ stats }: { stats: { value: string; label: string }[] }) {
  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-8 sm:flex sm:flex-wrap sm:gap-16">
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="font-display text-4xl font-bold tracking-tight text-brand-primary sm:text-5xl">
            {stat.value}
          </p>
          <p className="mt-1 text-sm font-medium tracking-wide text-brand-ink/60 uppercase">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
