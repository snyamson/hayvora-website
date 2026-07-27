import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Image with an offset accent-colored frame behind it — the recurring
 * "squared-outline" motif borrowed from the 42 Parallel Construction reference site.
 * Defaults to the brand green; gold is reserved for the hero only.
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
      <div className={`absolute -bottom-4 -right-4 h-full w-full border-2 ${frameClassName}`} aria-hidden="true" />
      <div className="relative h-full w-full overflow-hidden bg-brand-surface">
        {src ? (
          <Image src={src} alt={alt} fill className="object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-primary/10 to-brand-accent/20" />
        )}
        {children}
      </div>
    </div>
  );
}
