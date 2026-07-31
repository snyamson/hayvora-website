import { notFound } from "next/navigation";

import { safeFetch } from "../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY, FEATURED_PROJECTS_BY_BRAND_QUERY } from "../../../../sanity/lib/queries";
import { urlFor } from "../../../../sanity/lib/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeroCarousel } from "@/components/marketing/HeroCarousel";
import { HeroStatementCard } from "@/components/marketing/HeroStatementCard";
import { ProjectGalleryGrid, type ProjectCard } from "@/components/marketing/ProjectGalleryGrid";
import { getHeroSlides } from "@/lib/brandHelpers";
import { isSubsidiarySlug } from "@/lib/brands";
import { FALLBACK_BRANDS } from "@/lib/fallbackContent";
import type { BrandDoc, ProjectDoc } from "@/types/sanity";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) return {};

  const brand = await safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]);
  const resolved = brand ?? FALLBACK_BRANDS[brandSlug];

  return buildMetadata({
    title: `${resolved.name} — ${resolved.tagline ?? "Hayvora Holdings"}`,
    description: resolved.shortDescription,
    path: `/${brandSlug}`,
    seo: resolved.seo,
  });
}

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
        slides={getHeroSlides(resolvedBrand)}
        ctaLabel={resolvedBrand.hero?.ctaLabel ?? (modules.has("projects") ? "Our Projects" : undefined)}
        ctaHref={resolvedBrand.hero?.ctaHref ?? (modules.has("projects") ? `/${brandSlug}/projects` : undefined)}
      />

      {resolvedBrand.hero?.subheadline && (
        <HeroStatementCard eyebrow="What We Do" text={resolvedBrand.hero.subheadline} />
      )}

      {/* No description here — the hero card above already carries the brand summary. */}
      <section className="pt-16 pb-24">
        <Container>
          <SectionHeading eyebrow="Overview" title={resolvedBrand.name} />
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
