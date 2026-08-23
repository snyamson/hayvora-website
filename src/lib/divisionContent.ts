import type { SubsidiarySlug } from "@/lib/brands";
import type { DivisionProfileDoc } from "@/types/sanity";
import { urlFor } from "../../sanity/lib/image";
import divisionProfiles from "../../sanity/seed/division-profiles.json";

/**
 * Fallback copy for each division's long-form profile.
 *
 * The live source is now the `divisionProfile` document in Sanity — see
 * `resolveDivisionContent` below, which prefers the CMS and falls back here field by
 * field. This file exists so that a missing, unpublished or partially-filled profile
 * degrades to known-good copy instead of blanking whole sections of the page.
 *
 * A division with no CMS document *and* no entry here simply renders without these
 * sections, so the remaining profiles can be added without touching any component.
 */

export type DivisionService = {
  title: string;
  description: string;
  items: string[];
  /** Photo for this group, resolved from the CMS. Falls back to pooled brand
   *  photography in the component when absent. */
  imageUrl?: string;
};

export type DivisionValue = {
  title: string;
  description: string;
};

export type DivisionContent = {
  /** Legal entity name, used in the profile headings. */
  legalName: string;
  tagline: string;
  /** Overview paragraphs, rendered in order. */
  overview: string[];
  vision: string;
  mission: string;
  values: DivisionValue[];
  /** Heading and intro for the services section — they differ per division. */
  servicesHeading?: string;
  servicesIntro?: string;
  services: DivisionService[];
  clients: string[];
  operationalZone: string;
  /** Supporting line under the operational zone. */
  operationalNote?: string;
};

/**
 * Read from the same JSON the migration script pushes to Sanity, so the fallback and
 * the seeded CMS content cannot drift apart. The cast is safe because the JSON is
 * checked against `DivisionContent` by the `satisfies` assertion below.
 */
export const DIVISION_CONTENT = divisionProfiles as Partial<Record<SubsidiarySlug, DivisionContent>>;

// Compile-time guard: fails the build if the JSON stops matching the shape above.
const _shapeCheck = divisionProfiles satisfies Record<string, DivisionContent>;
void _shapeCheck;

/**
 * Only the CMS shape carries an `image`; the JSON fallback has no photography, so this
 * quietly returns undefined for fallback entries and the component falls back to the
 * division's pooled images.
 */
function serviceImageUrl(service: { image?: unknown }): string | undefined {
  const image = service.image as { asset?: unknown } | undefined;
  if (!image?.asset) return undefined;
  try {
    return urlFor(image).width(900).height(1125).url();
  } catch {
    return undefined;
  }
}

/** The repo fallback for one division, if there is one. */
export function getFallbackDivisionContent(slug: string): DivisionContent | undefined {
  return DIVISION_CONTENT[slug as SubsidiarySlug];
}

/**
 * Merges the Sanity `divisionProfile` document over the fallback copy above.
 *
 * Field by field rather than document by document, matching how `getWhyChooseContent`
 * resolves brands: an editor who fills in only a new mission shouldn't blank the
 * values, and an empty array in the CMS shouldn't wipe a populated fallback list.
 * Returns undefined only when neither source has anything, so the page can skip the
 * profile sections entirely.
 */
export function resolveDivisionContent(
  slug: string,
  doc: DivisionProfileDoc | null | undefined,
): DivisionContent | undefined {
  const fallback = getFallbackDivisionContent(slug);
  if (!doc && !fallback) return undefined;

  const list = <T,>(fromCms: T[] | undefined, fromFallback: T[] | undefined): T[] =>
    fromCms && fromCms.length > 0 ? fromCms : (fromFallback ?? []);

  const legalName = doc?.legalName ?? fallback?.legalName;
  // Everything else is optional, but the Overview heading has to say something.
  if (!legalName) return undefined;

  return {
    legalName,
    tagline: doc?.tagline ?? fallback?.tagline ?? "",
    overview: list(doc?.overview, fallback?.overview),
    vision: doc?.vision ?? fallback?.vision ?? "",
    mission: doc?.mission ?? fallback?.mission ?? "",
    values: list(doc?.values, fallback?.values).map((value) => ({
      title: value.title,
      description: value.description ?? "",
    })),
    servicesHeading: doc?.servicesHeading ?? fallback?.servicesHeading,
    servicesIntro: doc?.servicesIntro ?? fallback?.servicesIntro,
    services: list(doc?.services, fallback?.services).map((service) => ({
      title: service.title,
      description: service.description ?? "",
      items: service.items ?? [],
      imageUrl: serviceImageUrl(service),
    })),
    clients: list(doc?.clients, fallback?.clients),
    operationalZone: doc?.operationalZone ?? fallback?.operationalZone ?? "",
    operationalNote: doc?.operationalNote ?? fallback?.operationalNote,
  };
}
