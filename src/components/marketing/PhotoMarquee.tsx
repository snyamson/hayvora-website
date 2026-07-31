import Image from "next/image";

import type { GalleryItem } from "@/lib/galleryHelpers";

function Row({
  items,
  reverse = false,
  duration,
}: {
  items: GalleryItem[];
  reverse?: boolean;
  duration: string;
}) {
  if (items.length === 0) return null;

  // Same seamless-loop rule as the logo marquee: pad the row out, then lay it down
  // twice so the -50% keyframe lands the copy exactly where the original started.
  const filled = Array.from({ length: Math.ceil(6 / items.length) }).flatMap(() => items);
  const half = filled.length;
  const track = [...filled, ...filled];

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
            className="relative h-44 w-64 shrink-0 overflow-hidden rounded-card sm:h-56 sm:w-80"
          >
            <Image
              src={item.url}
              alt={i >= half ? "" : item.alt}
              fill
              sizes="320px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Two stacked photo strips scrolling in opposite directions. Splits the supplied images
 * in half so the same photo isn't visible in both rows at once.
 */
export function PhotoMarquee({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;

  const midpoint = Math.ceil(items.length / 2);
  const topRow = items.slice(0, midpoint);
  const bottomRow = items.length > 1 ? items.slice(midpoint) : items;

  return (
    <div className="flex flex-col gap-4">
      <Row items={topRow} duration="55s" />
      <Row items={bottomRow} reverse duration="70s" />
    </div>
  );
}
