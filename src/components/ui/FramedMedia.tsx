import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Image with an offset outlined frame behind it — the recurring "squared-outline"
 * motif used through the divisions section. Defaults to the brand green.
 *
 * Hover (driven by a `group` on an ancestor, so a wrapping link controls it): the frame
 * slides further out while the photo scales up and its brand tint lifts.
 */
export function FramedMedia({
  src,
  alt,
  className = "",
  frameClassName = "border-brand-secondary",
  sizes = "(min-width: 768px) 30rem, 100vw",
  children,
}: {
  src?: string;
  alt: string;
  className?: string;
  frameClassName?: string;
  sizes?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute -right-4 -bottom-4 h-full w-full rounded-card border-2 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:translate-x-2 group-hover:translate-y-2 ${frameClassName}`}
        aria-hidden="true"
      />
      <div className="relative h-full w-full overflow-hidden rounded-card bg-brand-tint-deep shadow-soft">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-primary/12 to-brand-secondary/20" />
        )}
        {/* Brand tint that lifts on hover, so the photo reads as interactive. */}
        <div className="absolute inset-0 bg-brand-primary/20 transition-opacity duration-500 group-hover:opacity-0" />
        {children}
      </div>
    </div>
  );
}
