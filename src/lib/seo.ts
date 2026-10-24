import type { Metadata } from "next";

import { urlFor } from "../../sanity/lib/image";
import { getSiteSettings } from "@/lib/content";
import type { SanityImage, SeoMetaDoc } from "@/types/sanity";

/**
 * Canonical origin for the site. Every absolute URL (canonicals, sitemap, OG tags,
 * JSON-LD) derives from this, so it must match the host that actually serves a 200.
 *
 * It is the `www` host deliberately: the apex `hayvora.com` 308-redirects to
 * `www.hayvora.com` on Vercel, so pointing canonicals at the apex would aim every one
 * of them at a redirect. If the domain config is ever flipped to make the apex primary,
 * change this at the same time.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hayvora.com").replace(/\/$/, "");

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
 * page's own title/description are used, then the site defaults from Site Settings.
 */
export async function buildMetadata({
  title,
  description,
  path,
  image,
  seo,
  type = "website",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path: string;
  image?: string;
  seo?: SeoMetaDoc;
  type?: "website" | "article";
  noIndex?: boolean;
}): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.companyName ?? settings?.title;
  const resolvedTitle = seo?.metaTitle ?? title;
  const shareTitle = resolvedTitle ?? siteName;
  const resolvedDescription = seo?.metaDescription ?? description ?? settings?.defaultSeo?.metaDescription;
  const resolvedImage = ogImageUrl(seo?.ogImage) ?? image ?? ogImageUrl(settings?.defaultSeo?.ogImage);
  const url = absoluteUrl(path);

  return {
    // No title of its own: keep the layout's default instead of "Name | Name".
    ...(resolvedTitle ? { title: resolvedTitle } : {}),
    description: resolvedDescription,
    alternates: { canonical: url },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: shareTitle,
      description: resolvedDescription,
      url,
      siteName,
      locale: "en_GH",
      type,
      ...(resolvedImage ? { images: [{ url: resolvedImage, width: 1200, height: 630, alt: shareTitle }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: resolvedDescription,
      ...(resolvedImage ? { images: [resolvedImage] } : {}),
    },
  };
}
