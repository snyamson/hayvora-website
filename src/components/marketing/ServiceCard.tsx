import Link from "next/link";

export function ServiceCard({
  title,
  shortDescription,
  href,
}: {
  title: string;
  shortDescription?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-black/5 bg-brand-surface p-8 transition hover:shadow-lg"
    >
      <p className="text-lg font-semibold text-brand-ink">{title}</p>
      {shortDescription && <p className="mt-2 text-sm text-brand-ink/70">{shortDescription}</p>}
      <span className="mt-6 inline-block text-sm font-semibold text-brand-primary group-hover:underline">
        Learn more →
      </span>
    </Link>
  );
}
