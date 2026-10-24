import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY, PROJECTS_BY_BRAND_QUERY } from "../../../../../sanity/lib/queries";
import { PageBanner } from "@/components/site/division/DivisionSections";
import { ProjectCard } from "@/components/site/ProjectCard";
import { isSubsidiarySlug } from "@/lib/brands";
import { fill, getPageText } from "@/lib/content";
import { bannerImage, crumbsFor, divisionPageMetadata } from "@/lib/pageContext";
import { getProjectThumbnail } from "@/lib/projectHelpers";
import type { BrandDoc, ProjectDoc } from "@/types/sanity";

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  return divisionPageMetadata(brand, "/projects", (text) => text?.projects?.title);
}

export default async function SubsidiaryProjectsPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const [brand, projects, text] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]),
    safeFetch<ProjectDoc[]>(PROJECTS_BY_BRAND_QUERY, { slug: brandSlug }, ["project"]),
    getPageText(),
  ]);
  if (!brand) notFound();
  const t = text?.projects;
  const { crumbs, crumbLabel } = await crumbsFor([
    { label: brand.name, href: `/${brandSlug}` },
    { label: t?.title ?? "" },
  ]);

  return (
    <>
      <PageBanner
        short
        crumbs={crumbs}
        crumbLabel={crumbLabel}
        eyebrow={t?.eyebrow}
        heading={t?.title}
        description={fill(t?.description, { division: brand.name })}
        imageUrl={bannerImage(brand)}
      />

      <section className="py-24">
        <div className="hv-wrap">
          {(projects?.length ?? 0) === 0 ? (
            <p className="rounded-[20px] bg-[var(--hv-tint)] p-12 text-center text-lg text-[var(--hv-muted)]">{t?.emptyText}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects!.map((p) => (
                <ProjectCard
                  key={p.slug.current}
                  className="h-[clamp(420px,42vw,600px)]"
                  project={{
                    href: `/${brandSlug}/projects/${p.slug.current}`,
                    title: p.title,
                    eyebrow: [p.category?.[0], p.location].filter(Boolean).join(" · "),
                    meta: [p.client, p.duration].filter(Boolean).join(" · "),
                    imageUrl: getProjectThumbnail(p, 900, 1200),
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
