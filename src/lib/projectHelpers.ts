import { fileUrlFor } from "../../sanity/lib/file";
import { urlFor } from "../../sanity/lib/image";
import type { ProjectDoc } from "@/types/sanity";

export type ProjectHero =
  | { type: "video"; videoUrl: string; posterUrl?: string }
  | { type: "image"; imageUrl: string };

function imageUrl(image: ProjectDoc["coverImage"], width: number, height: number) {
  if (!image?.asset) return undefined;
  try {
    return urlFor(image).width(width).height(height).url();
  } catch {
    return undefined;
  }
}

/**
 * Media for the top of a project's own page. Goes by whichever asset is actually
 * attached — hero video, then hero image, then the thumbnail as a last resort — so a
 * project that predates the hero field still renders something rather than nothing.
 * Same rule as getHeroSlides() uses for brand heroes.
 */
export function getProjectHero(project: ProjectDoc | undefined): ProjectHero | undefined {
  if (!project) return undefined;

  const videoUrl = fileUrlFor(project.hero?.video);
  if (videoUrl) {
    return { type: "video", videoUrl, posterUrl: imageUrl(project.hero?.poster, 1600, 900) };
  }

  const heroImage = imageUrl(project.hero?.image, 1600, 900);
  if (heroImage) return { type: "image", imageUrl: heroImage };

  const cover = imageUrl(project.coverImage, 1600, 900);
  return cover ? { type: "image", imageUrl: cover } : undefined;
}

/** Thumbnail for cards and grids — always the cover image, never the hero. */
export function getProjectThumbnail(project: ProjectDoc | undefined, width = 1000, height = 1200) {
  return imageUrl(project?.coverImage, width, height);
}
