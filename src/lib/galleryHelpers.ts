import { urlFor } from "../../sanity/lib/image";
import { describe } from "@/lib/imageAlt";
import type { HomeGalleryDoc, ProjectGallerySource, SanityImage } from "@/types/sanity";

export type GalleryItem = {
  /** Stable key + dedupe identity: the underlying Sanity asset ref. */
  id: string;
  url: string;
  alt: string;
};

type Size = { width: number; height: number };

function toItem(
  image: (SanityImage & { alt?: string; caption?: string }) | undefined,
  fallbackAlt: string,
  size: Size,
): GalleryItem[] {
  if (!image?.asset?._ref) return [];
  try {
    return [
      {
        id: image.asset._ref,
        url: urlFor(image).width(size.width).height(size.height).quality(80).url(),
        // Its own Alt text, else its caption, else what it belongs to.
        alt: describe(image.alt) || describe(image.caption) || fallbackAlt,
      },
    ];
  } catch {
    return [];
  }
}

/**
 * Pools the homepage gallery's loose images together with every project's gallery,
 * falling back to a project's cover image when it has no gallery yet — otherwise the
 * section would be empty until someone uploads per-project photos.
 */
export function getGalleryItems(
  homeGallery: HomeGalleryDoc | null | undefined,
  projects: ProjectGallerySource[] | null | undefined,
  { fallbackAlt = "", owner, size = { width: 640, height: 480 } }: { fallbackAlt?: string; owner?: string; size?: Size } = {},
): GalleryItem[] {
  const loose = (homeGallery?.images ?? []).flatMap((img) =>
    toItem(img, describe(undefined, homeGallery?.heading ?? fallbackAlt, owner), size),
  );

  const fromProjects = (projects ?? []).flatMap((project) => {
    const about = describe(undefined, project.title, owner);
    const gallery = (project.gallery ?? []).flatMap((img) => toItem(img, about, size));
    return gallery.length > 0 ? gallery : toItem(project.coverImage, about, size);
  });

  // Dedupe by asset ref — a project's cover often also sits in its own gallery.
  const seen = new Set<string>();
  return [...loose, ...fromProjects].filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
