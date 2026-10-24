import { safeFetch } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
import { BRAND_BY_SLUG_QUERY } from "../../sanity/lib/queries";
import { getDivisions, getFeaturedProjects, getSiteSettings } from "@/lib/content";
import { getHeroSlides } from "@/lib/brandHelpers";
import { getProjectThumbnail } from "@/lib/projectHelpers";
import type { BrandDoc, LogoAssetDoc, SanityImage } from "@/types/sanity";

export type LogoSet = { name?: string; mark?: string; wordmark?: string; stacked?: string };

export type DivisionLink = {
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  imageUrl?: string;
};

export type ProjectLink = { title: string; href: string; imageUrl?: string };

const imageUrl = (image: SanityImage | undefined, width?: number) => {
  if (!image?.asset) return undefined;
  try {
    const builder = urlFor(image);
    return (width ? builder.width(width) : builder).url();
  } catch {
    return undefined;
  }
};

function logoUrl(logos: LogoAssetDoc[] | undefined, variant: LogoAssetDoc["variant"]) {
  return imageUrl(logos?.find((l) => l.variant === variant)?.image);
}

/** The header and footer read the same things on every page: settings, the logo, the divisions and the featured projects. */
export async function getChrome() {
  const [settings, holdings, divisions, projects] = await Promise.all([
    getSiteSettings(),
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: "holdings" }, ["brand", "brand:holdings"]),
    getDivisions(),
    getFeaturedProjects(),
  ]);

  const logo: LogoSet = {
    name: settings?.companyName ?? holdings?.name,
    mark: logoUrl(holdings?.logos, "mark"),
    wordmark: logoUrl(holdings?.logos, "wordmark"),
    stacked: logoUrl(holdings?.logos, "stacked") ?? logoUrl(holdings?.logos, "primary"),
  };

  const divisionLinks: DivisionLink[] = (divisions ?? []).map((d) => {
    const still = getHeroSlides(d).find((s) => s.type === "image");
    return {
      slug: d.slug.current,
      name: d.name,
      tagline: d.tagline,
      description: d.shortDescription,
      imageUrl: still?.type === "image" ? still.imageUrl : undefined,
    };
  });

  const projectLinks: ProjectLink[] = (projects ?? []).map((p) => ({
    title: p.title,
    href: `/${p.brand?.slug.current ?? ""}/projects/${p.slug.current}`,
    imageUrl: getProjectThumbnail(p, 300, 300),
  }));

  return { settings, holdings, logo, divisions: divisionLinks, projects: projectLinks };
}
