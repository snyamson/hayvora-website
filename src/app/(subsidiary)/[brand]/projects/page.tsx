import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { PROJECTS_BY_BRAND_QUERY } from "../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../sanity/lib/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGalleryGrid, type ProjectCard } from "@/components/marketing/ProjectGalleryGrid";
import { isSubsidiarySlug } from "@/lib/brands";
import type { ProjectDoc } from "@/types/sanity";

export default async function SubsidiaryProjectsPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const projects = await safeFetch<ProjectDoc[]>(PROJECTS_BY_BRAND_QUERY, { slug: brandSlug }, ["project"]);

  const projectCards: ProjectCard[] = (projects ?? []).map((p) => ({
    slug: p.slug.current,
    title: p.title,
    location: p.location,
    year: p.year,
    imageUrl: p.coverImage ? urlFor(p.coverImage).width(900).height(700).url() : undefined,
    href: `/${brandSlug}/projects/${p.slug.current}`,
  }));

  return (
    <section className="pt-40 pb-24">
      <Container>
        <SectionHeading eyebrow="Portfolio" title="Projects" />
        <div className="mt-10">
          <ProjectGalleryGrid projects={projectCards} />
        </div>
      </Container>
    </section>
  );
}
