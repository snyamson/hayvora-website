import { safeFetch } from "../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY } from "../../sanity/lib/queries";
import { getHeroSlides } from "@/lib/brandHelpers";
import { isSubsidiarySlug } from "@/lib/brands";
import { fill, getPageText, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { PageTextDoc } from "@/types/sanity";
import type { Crumb } from "@/components/site/division/DivisionSections";
import type { BrandDoc } from "@/types/sanity";

/** First still from a brand's hero, used as the banner photo on its inner pages. */
export function bannerImage(brand: BrandDoc | null | undefined) {
  const still = getHeroSlides(brand ?? undefined).find((s) => s.type === "image");
  return still?.type === "image" ? still.imageUrl : undefined;
}

/**
 * Breadcrumbs start with the Home label from Site Settings; the trail after it is the
 * page's own. Returns the label for screen readers too.
 */
export async function crumbsFor(trail: Crumb[]) {
  const settings = await getSiteSettings();
  const home = settings?.labels?.home;
  return {
    crumbs: [...(home ? [{ label: home, href: "/" }] : []), ...trail.filter((c) => c.label)],
    crumbLabel: settings?.labels?.breadcrumb,
  };
}

/**
 * Metadata for a division's inner page: "<page title> — <division>". `pick` chooses the
 * page title from Page text; {division} in it is filled in.
 */
export async function divisionPageMetadata(
  brandSlug: string,
  path: string,
  pick: (text: PageTextDoc | null) => string | undefined,
) {
  if (!isSubsidiarySlug(brandSlug)) return {};
  const [brand, text] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]),
    getPageText(),
  ]);
  const title = fill(pick(text), { division: brand?.name });
  return buildMetadata({
    // Skip the division name when the title already says it ("Talk to Infrastructure").
    title: (brand?.name && title.includes(brand.name) ? title : [title, brand?.name].filter(Boolean).join(" — ")) || undefined,
    description: brand?.shortDescription,
    path: `/${brandSlug}${path}`,
  });
}
