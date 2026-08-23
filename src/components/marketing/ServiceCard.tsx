import { Card, CardBody } from "@/components/ui/Card";

/**
 * Service tile. The index is optional — when a caller passes one it's shown as a faint
 * number in the corner, which gives a grid of otherwise text-only cards some structure.
 */
export function ServiceCard({
  title,
  shortDescription,
  href,
  index,
}: {
  title: string;
  shortDescription?: string;
  href: string;
  index?: number;
}) {
  return (
    <Card href={href} className="h-full">
      {/* Green wipe along the top edge on hover — the same gesture as TextLink's
          underline, scaled up to card width. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-secondary transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-x-100"
      />

      <CardBody>
        {index !== undefined && (
          <span className="font-display absolute top-6 right-7 text-4xl leading-none font-bold text-brand-primary/8 transition-colors duration-500 group-hover:text-brand-secondary/20">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}

        <p className="font-display max-w-[85%] text-lg font-semibold tracking-tight text-brand-ink">{title}</p>

        {shortDescription && (
          <p className="mt-3 text-sm leading-relaxed text-brand-ink/65">{shortDescription}</p>
        )}

        <span className="font-display mt-8 inline-flex items-center gap-2 text-sm font-bold tracking-wide text-brand-primary transition-colors group-hover:text-brand-secondary">
          Learn more
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
            <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </CardBody>
    </Card>
  );
}
