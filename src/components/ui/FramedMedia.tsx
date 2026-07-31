import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Image with an offset accent-colored frame behind it — the recurring
 * "squared-outline" motif borrowed from the 42 Parallel Construction reference site.
 * Defaults to the brand green; gold is reserved for the hero only.
 *
 * Hover (driven by a `group` on an ancestor, so a wrapping link controls it): the frame
 * slides in behind the image while the photo scales up and its tint lifts.
 */
export function FramedMedia({
  src,
  alt,
  className = "",
  frameClassName = "border-brand-accent",
  children,
}: {
  src?: string;
  alt: string;
  className?: string;
  frameClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute -right-4 -bottom-4 h-full w-full rounded-card border-2 transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:translate-y-2 ${frameClassName}`}
        aria-hidden="true"
      />
      <div className="relative h-full w-full overflow-hidden rounded-card bg-brand-surface">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 768px) 28rem, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-primary/10 to-brand-accent/20" />
        )}
        {/* Brand tint that lifts on hover, so the photo reads as interactive. */}
        <div className="absolute inset-0 bg-brand-primary/20 transition-opacity duration-500 group-hover:opacity-0" />
        {children}
      </div>
    </div>
  );
}
