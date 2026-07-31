import type { MetadataRoute } from "next";

import { safeFetch } from "../../sanity/lib/client";
import { SUBSIDIARY_SLUGS } from "@/lib/brands";
import { absoluteUrl } from "@/lib/seo";

type SitemapRow = { slug?: { current?: string }; brandSlug?: string; _updatedAt?: string };

const SITEMAP_QUERY = `{
  "projects": *[_type == "project" && defined(slug.current)]{ slug, _updatedAt, "brandSlug": brand->slug.current },
  "services": *[_type == "service" && defined(slug.current)]{ slug, _updatedAt, "brandSlug": brand->slug.current },
  "properties": *[_type == "property" && defined(slug.current)]{ slug, _updatedAt }
}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await safeFetch<{
    projects: SitemapRow[];
    services: SitemapRow[];
    properties: SitemapRow[];
  }>(SITEMAP_QUERY, {}, ["project", "service", "property"]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/properties"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  // Every subsidiary's hub plus its sub-pages. Listed from the known slug constant
  // rather than from Sanity so the sitemap stays complete even if a brand document
  // hasn't been authored yet.
  const brandRoutes: MetadataRoute.Sitemap = SUBSIDIARY_SLUGS.flatMap((slug) => [
    { url: absoluteUrl(`/${slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    ...["about", "services", "projects", "gallery", "contact"].map((page) => ({
      url: absoluteUrl(`/${slug}/${page}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]);

  const lastMod = (row: SitemapRow) => (row._updatedAt ? new Date(row._updatedAt) : now);

  const projectRoutes: MetadataRoute.Sitemap = (data?.projects ?? [])
    .filter((p) => p.slug?.current && p.brandSlug)
    .map((p) => ({
      url: absoluteUrl(`/${p.brandSlug}/projects/${p.slug!.current}`),
      lastModified: lastMod(p),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const serviceRoutes: MetadataRoute.Sitemap = (data?.services ?? [])
    .filter((s) => s.slug?.current && s.brandSlug)
    .map((s) => ({
      url: absoluteUrl(`/${s.brandSlug}/services/${s.slug!.current}`),
      lastModified: lastMod(s),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const propertyRoutes: MetadataRoute.Sitemap = (data?.properties ?? [])
    .filter((p) => p.slug?.current)
    .map((p) => ({
      url: absoluteUrl(`/properties/${p.slug!.current}`),
      lastModified: lastMod(p),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [...staticRoutes, ...brandRoutes, ...projectRoutes, ...serviceRoutes, ...propertyRoutes];
}
