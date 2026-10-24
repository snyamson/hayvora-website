import { cache } from "react";

import { safeFetch } from "../../sanity/lib/client";
import {
  ALL_SUBSIDIARY_BRANDS_QUERY,
  DIVISION_PAGE_QUERY,
  FEATURED_PROJECTS_ACROSS_BRANDS_QUERY,
  HOME_PAGE_QUERY,
  PAGE_TEXT_QUERY,
  SITE_SETTINGS_QUERY,
} from "../../sanity/lib/queries";
import type {
  BrandDoc,
  DivisionPageDoc,
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

export { divisionHref, fill } from "@/lib/fill";
