import { fileUrlFor } from "../../sanity/lib/file";
import { urlFor } from "../../sanity/lib/image";
import type { BrandDoc } from "@/types/sanity";
import type { HeroSlide } from "@/components/marketing/HeroCarousel";
import { buildThemeStyle } from "@/lib/theme";

export function getLogoUrl(brand: BrandDoc | undefined, variant: "primary" | "reversed" | "mark" = "reversed") {
  const logo = brand?.logos?.find((l) => l.variant === variant) ?? brand?.logos?.[0];
  if (!logo?.image?.asset) return undefined;
  try {
    return urlFor(logo.image).width(280).url();
  } catch {
    return undefined;
  }
}

export function getHeroSlides(brand: BrandDoc | undefined): HeroSlide[] {
  const media = brand?.hero?.media ?? [];

  // Goes by whichever asset is actually attached rather than trusting the editor's
  // "Type" dropdown to match — avoids a slide silently rendering nothing when someone
  // swaps the file but forgets to flip Type (or uploads both and only sets one).
  return media.flatMap((slide): HeroSlide[] => {
    if (slide.video?.asset) {
      const videoUrl = fileUrlFor(slide.video);
      if (videoUrl) return [{ type: "video", videoUrl }];
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
