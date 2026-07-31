import { urlFor } from "../../sanity/lib/image";
import type { HomeGalleryDoc, ProjectGallerySource, SanityImage } from "@/types/sanity";

export type GalleryItem = {
  /** Stable key + dedupe identity: the underlying Sanity asset ref. */
  id: string;
  url: string;
  alt: string;
};

function toItem(
  image: (SanityImage & { alt?: string; caption?: string }) | undefined,
  fallbackAlt: string,
): GalleryItem[] {
  if (!image?.asset?._ref) return [];
  try {
    return [
      {
        id: image.asset._ref,
        // Cropped to the marquee tile's 4:3-ish box, so no need for the full-size file.
        url: urlFor(image).width(640).height(480).quality(80).url(),
        alt: image.alt ?? fallbackAlt,
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
): GalleryItem[] {
  const loose = (homeGallery?.images ?? []).flatMap((img) => toItem(img, homeGallery?.heading ?? "Hayvora project"));

  const fromProjects = (projects ?? []).flatMap((project) => {
    const gallery = (project.gallery ?? []).flatMap((img) => toItem(img, project.title));
    return gallery.length > 0 ? gallery : toItem(project.coverImage, project.title);
  });

  // Dedupe by asset ref — a project's cover often also sits in its own gallery.
  const seen = new Set<string>();
  return [...loose, ...fromProjects].filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
