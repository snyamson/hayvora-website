import { notFound } from "next/navigation";

import { safeFetch } from "../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY, FEATURED_PROJECTS_BY_BRAND_QUERY } from "../../../../sanity/lib/queries";
import { urlFor } from "../../../../sanity/lib/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeroCarousel } from "@/components/marketing/HeroCarousel";
import { ProjectGalleryGrid, type ProjectCard } from "@/components/marketing/ProjectGalleryGrid";
import { getHeroSlides } from "@/lib/brandHelpers";
import { isSubsidiarySlug } from "@/lib/brands";
import { FALLBACK_BRANDS } from "@/lib/fallbackContent";
import type { BrandDoc, ProjectDoc } from "@/types/sanity";

export default async function SubsidiaryHomePage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const [brand, projects] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]),
    safeFetch<ProjectDoc[]>(FEATURED_PROJECTS_BY_BRAND_QUERY, { slug: brandSlug }, ["project"]),
  ]);

  const resolvedBrand = brand ?? FALLBACK_BRANDS[brandSlug];
  const modules = new Set(resolvedBrand.enabledModules ?? []);

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
      <HeroCarousel
        headline={resolvedBrand.hero?.headline ?? resolvedBrand.tagline ?? resolvedBrand.name}
        subheadline={resolvedBrand.hero?.subheadline}
        slides={getHeroSlides(resolvedBrand)}
        ctaLabel={resolvedBrand.hero?.ctaLabel ?? (modules.has("projects") ? "Our Projects" : undefined)}
        ctaHref={resolvedBrand.hero?.ctaHref ?? (modules.has("projects") ? `/${brandSlug}/projects` : undefined)}
      />

      <section className="py-24">
        <Container>
          <SectionHeading eyebrow="Overview" title={resolvedBrand.name} description={resolvedBrand.shortDescription} />
        </Container>
      </section>

      {modules.has("projects") && (
        <section className="pb-24">
          <Container>
            <SectionHeading eyebrow="Featured Work" title="Selected Projects" />
            <div className="mt-10">
              <ProjectGalleryGrid projects={projectCards} />
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
