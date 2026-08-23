import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { PROJECTS_BY_BRAND_QUERY } from "../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../sanity/lib/image";
import { Container } from "@/components/ui/Container";
import { DIVISION_ART } from "@/components/ui/BlueprintArt";
import { PageHero } from "@/components/layout/PageHero";
import { ProjectGalleryGrid, type ProjectCard } from "@/components/marketing/ProjectGalleryGrid";
import { isSubsidiarySlug } from "@/lib/brands";
import { FALLBACK_BRANDS } from "@/lib/fallbackContent";
import type { ProjectDoc } from "@/types/sanity";

export default async function SubsidiaryProjectsPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const projects = await safeFetch<ProjectDoc[]>(PROJECTS_BY_BRAND_QUERY, { slug: brandSlug }, ["project"]);
  const brandName = FALLBACK_BRANDS[brandSlug]?.name ?? brandSlug;

  const projectCards: ProjectCard[] = (projects ?? []).map((p) => ({
    slug: p.slug.current,
    title: p.title,
    location: p.location,
    year: p.year,
    imageUrl: p.coverImage ? urlFor(p.coverImage).width(900).height(700).url() : undefined,
    href: `/${brandSlug}/projects/${p.slug.current}`,
  }));

  return (
    <>
      <PageHero
        art={DIVISION_ART[brandSlug]?.primary}
        secondaryArt={DIVISION_ART[brandSlug]?.secondary}
        eyebrow="Portfolio"
        title="Projects"
        description={`Selected work delivered by ${brandName}.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: brandName, href: `/${brandSlug}` },
        ]}
      />

      <section className="hv-aura-bg section relative">
        <Container>
          <ProjectGalleryGrid projects={projectCards} />
        </Container>
      </section>
    </>
  );
}
