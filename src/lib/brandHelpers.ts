import { fileUrlFor } from "../../sanity/lib/file";
import { urlFor } from "../../sanity/lib/image";
import type { BrandDoc, SanityImage } from "@/types/sanity";
import { buildThemeStyle } from "@/lib/theme";

export type HeroSlide =
  | { type: "image"; imageUrl: string; alt?: string }
  // The poster is the still shown while it loads, and the thumbnail search engines need to list the video.
  | { type: "video"; videoUrl: string; posterUrl?: string };

function still(image: SanityImage | undefined) {
  if (!image?.asset) return undefined;
  try {
    return urlFor(image).width(1920).height(1080).url();
  } catch {
    return undefined;
  }
}

export function getHeroSlides(brand: BrandDoc | undefined): HeroSlide[] {
  const media = brand?.hero?.media ?? [];
  // A video without a picture of its own takes the first picture among the slides, else the brand's narrative photo.
  const fallbackPoster = still(media.find((slide) => slide.image?.asset)?.image) ?? still(brand?.narrativeImage);

  // Goes by whichever asset is actually attached rather than trusting the editor's
  // "Type" dropdown to match — avoids a slide silently rendering nothing when someone
  // swaps the file but forgets to flip Type (or uploads both and only sets one).
  return media.flatMap((slide): HeroSlide[] => {
    if (slide.video?.asset) {
      const videoUrl = fileUrlFor(slide.video);
      if (videoUrl) return [{ type: "video", videoUrl, posterUrl: still(slide.image) ?? fallbackPoster }];
    }
    if (slide.image?.asset) {
      try {
        return [{ type: "image", imageUrl: urlFor(slide.image).width(1920).height(1080).url(), alt: slide.caption }];
      } catch {
        return [];
      }
    }
    return [];
  });
}

export function getBrandThemeStyle(brand: BrandDoc | undefined) {
  return buildThemeStyle(
    brand?.colors
      ? {
          primary: brand.colors.primary,
          secondary: brand.colors.secondary,
          accent: brand.colors.accent,
          surface: brand.colors.surface,
          ink: brand.colors.ink,
          textOnPrimary: brand.colors.textOnPrimary,
        }
      : undefined,
  );
}
