import { fileUrlFor } from "../../sanity/lib/file";
import { urlFor } from "../../sanity/lib/image";
import type { BrandDoc, ClientDoc } from "@/types/sanity";
import type { HeroSlide } from "@/components/marketing/HeroCarousel";
import type { MarqueeClient } from "@/components/marketing/ClientMarquee";
import type { WhyChooseContent } from "@/components/marketing/WhyChoose";
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

/**
 * Resolves the brand's Why Choose block into plain URLs for the component. Returns
 * undefined when the block (or its required heading) is missing, so the caller can skip
 * the section entirely rather than render an empty shell.
 */
export function getWhyChooseContent(
  brand: BrandDoc | undefined,
  fallbackBrand?: BrandDoc,
): WhyChooseContent | undefined {
  // Falls back field-by-field rather than document-by-document: the live brand document
  // predates `whyChoose`, but its `stats` are real and must win over any fallback copy.
  const wc = brand?.whyChoose ?? fallbackBrand?.whyChoose;
  if (!wc?.heading) return undefined;

  const imageUrl = (image: typeof wc.statImage) => {
    if (!image?.asset) return undefined;
    try {
      return urlFor(image).width(900).url();
    } catch {
      return undefined;
    }
  };

  // Both figures come from the brand's `stats` array so numbers live in exactly one
  // place: first stat on the photo card, second on the video card. Extra stats are
  // ignored here — the section only has two slots.
  const [firstStat, secondStat] = brand?.stats ?? fallbackBrand?.stats ?? [];

  return {
    eyebrow: wc.eyebrow,
    heading: wc.heading,
    statValue: firstStat?.value,
    statLabel: firstStat?.label,
    statDescription: wc.statDescription,
    statImageUrl: imageUrl(wc.statImage),
    ctaLabel: wc.ctaLabel,
    ctaHref: wc.ctaHref,
    highlightValue: secondStat?.value,
    highlightLabel: secondStat?.label,
    highlightVideoUrl: fileUrlFor(wc.highlightVideo),
    highlightPosterUrl: imageUrl(wc.highlightPoster),
  };
}

/** Maps `client` documents to the shape the marquee renders, dropping any without a logo. */
export function getMarqueeClients(clients: ClientDoc[] | null | undefined): MarqueeClient[] {
  return (clients ?? []).flatMap((c): MarqueeClient[] => {
    if (!c.logo?.asset) return [];
    try {
      return [{ name: c.name, logoUrl: urlFor(c.logo).width(360).url(), website: c.website }];
    } catch {
      return [];
    }
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
