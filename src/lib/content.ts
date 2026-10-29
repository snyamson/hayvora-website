import { cache } from "react";

import { safeFetch } from "../../sanity/lib/client";
import {
  ALL_SUBSIDIARY_BRANDS_QUERY,
  DIVISION_PAGE_QUERY,
  DIVISION_PROFILE_BY_BRAND_QUERY,
  FEATURED_PROJECTS_ACROSS_BRANDS_QUERY,
  HOME_PAGE_QUERY,
  PAGE_TEXT_QUERY,
  SITE_SETTINGS_QUERY,
} from "../../sanity/lib/queries";
import type {
  BrandDoc,
  DivisionPageDoc,
  DivisionProfileDoc,
  HomePageDoc,
  PageTextDoc,
  ProjectDoc,
  SiteSettingsDoc,
} from "@/types/sanity";

// One fetch per request for the documents nearly every page reads: layouts,
// generateMetadata and the page itself all share the result.
export const getSiteSettings = cache(() => safeFetch<SiteSettingsDoc>(SITE_SETTINGS_QUERY, {}, ["siteSettings"]));
export const getHomePage = cache(() => safeFetch<HomePageDoc>(HOME_PAGE_QUERY, {}, ["homePage"]));
export const getDivisionPage = cache(() => safeFetch<DivisionPageDoc>(DIVISION_PAGE_QUERY, {}, ["divisionPage"]));
export const getPageText = cache(() => safeFetch<PageTextDoc>(PAGE_TEXT_QUERY, {}, ["pageText"]));
export const getDivisions = cache(() => safeFetch<BrandDoc[]>(ALL_SUBSIDIARY_BRANDS_QUERY, {}, ["brand"]));
export const getFeaturedProjects = cache(() =>
  safeFetch<ProjectDoc[]>(FEATURED_PROJECTS_ACROSS_BRANDS_QUERY, {}, ["project"]),
);

export const getDivisionProfile = cache((slug: string) =>
  safeFetch<DivisionProfileDoc>(DIVISION_PROFILE_BY_BRAND_QUERY, { slug }, ["divisionProfile", `divisionProfile:${slug}`]),
);

/** Who a division's photos belong to, by its full name ("Hayvora Infrastructure Ltd") when its profile gives one. */
export async function divisionOwner(slug: string, name: string | undefined): Promise<string | undefined> {
  return (await getDivisionProfile(slug))?.legalName ?? name;
}

export { divisionHref, fill } from "@/lib/fill";
