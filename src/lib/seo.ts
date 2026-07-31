import type { Metadata } from "next";

import { urlFor } from "../../sanity/lib/image";
import type { SanityImage } from "@/types/sanity";

/**
 * Canonical origin for the site. Every absolute URL (canonicals, sitemap, OG tags,
 * JSON-LD) derives from this, so it must match the live domain exactly — a mismatch
 * makes Google treat the two as separate sites and split their ranking signals.
 * Override per-environment with NEXT_PUBLIC_SITE_URL (set it on Vercel for previews).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://hayvora.com").replace(/\/$/, "");

export const SITE_NAME = "Hayvora Holdings Limited";

export const DEFAULT_DESCRIPTION =
  "Hayvora Holdings Limited delivers civil and architectural construction, land surveying and " +
  "geospatial consulting, and climate-smart agricultural systems across Ghana and West Africa.";

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Resolves a Sanity image to a 1200x630 social card URL, or undefined if unset. */
export function ogImageUrl(image: SanityImage | undefined) {
  if (!image?.asset) return undefined;
  try {
    return urlFor(image).width(1200).height(630).fit("crop").url();
  } catch {
    return undefined;
  }
}

/**
 * Builds a page's Metadata with canonical URL, Open Graph and Twitter cards filled in
 * consistently. Sanity `seoMeta` values win when an editor has set them; otherwise the
 * page's own title/description are used.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  seo,
  type = "website",
  noIndex = false,
}: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: SanityImage };
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const resolvedTitle = seo?.metaTitle ?? title;
  const resolvedDescription = seo?.metaDescription ?? description ?? DEFAULT_DESCRIPTION;
  const resolvedImage = ogImageUrl(seo?.ogImage) ?? image;
  const url = absoluteUrl(path);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: url },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: SITE_NAME,
      locale: "en_GH",
      type,
      ...(resolvedImage ? { images: [{ url: resolvedImage, width: 1200, height: 630, alt: resolvedTitle }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      ...(resolvedImage ? { images: [resolvedImage] } : {}),
    },
  };
}
