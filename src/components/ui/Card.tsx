import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The card system. Every panel on the site — services, properties, projects, stats —
 * is built from these three pieces, so radius, border, elevation and hover behaviour
 * are the same everywhere.
 *
 * Hover is a 4px lift plus a shadow step, matching the rest of the site's 300ms
 * `--ease-brand` motion. The lift is a transform, so it never triggers layout.
 */

export function Card({
  children,
  href,
  className = "",
  interactive = true,
}: {
  children: ReactNode;
  /** Renders the card as a link. Adds the `group` hook that CardMedia's zoom reads. */
  href?: string;
  className?: string;
  interactive?: boolean;
}) {
  const base = `group relative flex flex-col overflow-hidden rounded-card border border-brand-line-soft bg-white shadow-soft transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
    interactive ? "hover:-translate-y-1 hover:border-brand-line hover:shadow-lift" : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return <div className={base}>{children}</div>;
}

/**
 * Card image. Scales gently on hover of the enclosing `Card` and carries a green scrim
 * that lifts at the same time, so the photo reads as interactive.
 *
 * `aspect` takes a Tailwind aspect class rather than a number so callers stay on the
 * design system's ratios instead of inventing new ones per card.
 */
export function CardMedia({
  src,
  alt,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className = "",
  overlay = true,
  grayscale = false,
  children,
}: {
  src?: string;
  alt: string;
  aspect?: string;
  sizes?: string;
  className?: string;
  overlay?: boolean;
  grayscale?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`relative w-full overflow-hidden ${aspect} ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={`object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.06] ${
            grayscale ? "grayscale" : ""
          }`}
        />
      ) : (
        // Placeholder built from the brand hues, so a missing photo still looks
        // deliberate rather than like a broken image. It goes dark whenever the card
        // overlays white text on the media — otherwise a listing with no photo yet
        // renders white-on-pale and the title becomes unreadable.
        <div
          className={
            overlay
              ? "h-full w-full bg-gradient-to-br from-brand-primary via-brand-secondary-deep to-brand-secondary"
              : "h-full w-full bg-gradient-to-br from-brand-primary/12 via-brand-tint-deep to-brand-secondary/15"
          }
        />
      )}

      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary-deep/90 via-brand-secondary-deep/25 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
      )}

      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-1 flex-col p-6 sm:p-7 ${className}`}>{children}</div>;
}

/**
 * Small pill used for categories and metadata on top of media.
 *
 * `tone` matters for contrast, so it isn't cosmetic: `onDark` is the frosted white
 * treatment for chips sitting on a photo behind the green scrim, while `onLight` is
 * blue-on-white for cards that show the media untinted — where white-on-frosted-white
 * disappears entirely against a pale photo or the no-image placeholder.
 */
export function CardChip({
  children,
  tone = "onDark",
  className = "",
}: {
  children: ReactNode;
  tone?: "onDark" | "onLight";
  className?: string;
}) {
  const toneStyles =
    tone === "onDark"
      ? "border-white/25 bg-white/15 text-white"
      : "border-brand-line bg-white/95 text-brand-primary shadow-soft";

  return (
    <span
      className={`font-display inline-flex items-center rounded-full border px-3 py-1 text-[0.6875rem] font-bold tracking-[0.12em] uppercase backdrop-blur-md ${toneStyles} ${className}`}
    >
      {children}
    </span>
  );
}
