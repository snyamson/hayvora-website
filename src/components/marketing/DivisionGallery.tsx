import Image from "next/image";

import { Stagger, StaggerItem } from "@/components/ui/Motion";

/**
 * Site photography as an irregular bento wall.
 *
 * The spans repeat on a 12-tile cycle rather than a uniform grid, and `grid-flow-dense`
 * backfills the gaps, so the wall keeps its rhythm at any photo count — including the
 * awkward ones (7, 11) where a fixed pattern would leave a hole in the last row.
 */
const SPANS = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
];

export type GalleryPhoto = { url: string; alt?: string };

export function DivisionGallery({ photos }: { photos: GalleryPhoto[] }) {
  if (photos.length === 0) return null;

  return (
    <Stagger
      gap={0.05}
      className="grid auto-rows-[110px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[150px] sm:grid-cols-4 sm:gap-4 lg:auto-rows-[170px] lg:grid-cols-6"
    >
      {photos.map((photo, i) => (
        <StaggerItem key={`${photo.url}-${i}`} y={20} className={SPANS[i % SPANS.length]}>
          <div className="group relative h-full w-full overflow-hidden rounded-card bg-brand-tint-deep shadow-soft">
            <Image
              src={photo.url}
              alt={photo.alt ?? ""}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-110"
            />
            {/* Green veil lifts on hover, so the wall reads as texture at rest and
                rewards a pause on any one frame. */}
            <div className="absolute inset-0 bg-brand-secondary-deep/25 transition-opacity duration-500 group-hover:opacity-0" />
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
