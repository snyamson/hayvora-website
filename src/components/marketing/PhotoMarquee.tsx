import Image from "next/image";

import { buildMarqueeTrack } from "@/lib/marquee";
import type { GalleryItem } from "@/lib/galleryHelpers";

function Row({ items, reverse = false, duration }: { items: GalleryItem[]; reverse?: boolean; duration: string }) {
  if (items.length === 0) return null;

  const { track, half } = buildMarqueeTrack(items, 6);

  return (
    <div className="hv-marquee relative overflow-hidden">
      <div
        className={`hv-marquee-track flex w-max gap-4 ${reverse ? "hv-marquee-track--reverse" : ""}`}
        style={{ ["--hv-marquee-duration" as string]: duration }}
      >
        {track.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            aria-hidden={i >= half}
            className="group relative h-48 w-64 shrink-0 overflow-hidden rounded-card sm:h-60 sm:w-80"
          >
            <Image
              src={item.url}
              alt={i >= half ? "" : item.alt}
              fill
              sizes="320px"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105"
            />
            {/* Green veil that lifts on hover — keeps the two moving rows calm enough to
                read as texture, while still rewarding a pause on any one photo. */}
            <div className="absolute inset-0 bg-brand-primary/25 transition-opacity duration-500 group-hover:opacity-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Two stacked photo strips scrolling in opposite directions. Splits the supplied images
 * in half so the same photo isn't visible in both rows at once, and masks both ends so
 * the strips fade rather than stop.
 */
export function PhotoMarquee({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;

  const midpoint = Math.ceil(items.length / 2);
  const topRow = items.slice(0, midpoint);
  const bottomRow = items.length > 1 ? items.slice(midpoint) : items;

  return (
    <div className="flex flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <Row items={topRow} duration="55s" />
      <Row items={bottomRow} reverse duration="70s" />
    </div>
  );
}
