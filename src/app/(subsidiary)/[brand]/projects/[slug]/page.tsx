import Image from "next/image";
import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../../sanity/lib/client";
import { PROJECT_BY_SLUG_QUERY } from "../../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../../sanity/lib/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ClipReveal, Reveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { DIVISION_ART } from "@/components/ui/BlueprintArt";
import { PageHero } from "@/components/layout/PageHero";
import { PortableText } from "@/components/portable-text/PortableText";
import { isSubsidiarySlug } from "@/lib/brands";
import { FALLBACK_BRANDS } from "@/lib/fallbackContent";
import { getProjectHero } from "@/lib/projectHelpers";
import type { ProjectDoc } from "@/types/sanity";
import { buildMetadata, ogImageUrl } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ brand: string; slug: string }> }) {
  const { brand: brandSlug, slug } = await params;
  if (!isSubsidiarySlug(brandSlug)) return {};

  const project = await safeFetch<ProjectDoc>(PROJECT_BY_SLUG_QUERY, { slug }, ["project", `project:${slug}`]);
  if (!project) return { title: "Project not found" };

  return buildMetadata({
    title: project.location ? `${project.title} — ${project.location}` : project.title,
    description: project.summary,
    path: `/${brandSlug}/projects/${slug}`,
    image: ogImageUrl(project.coverImage),
    type: "article",
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ brand: string; slug: string }>;
}) {
  const { brand: brandSlug, slug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const project = await safeFetch<ProjectDoc & { description?: unknown; gallery?: { asset?: unknown }[] }>(
    PROJECT_BY_SLUG_QUERY,
    { slug },
    ["project", `project:${slug}`],
  );

  if (!project) notFound();

  const hero = getProjectHero(project);
  const brandName = FALLBACK_BRANDS[brandSlug]?.name ?? brandSlug;

  const facts = [
    project.client && { label: "Client", value: project.client },
    project.location && { label: "Location", value: project.location },
    project.duration && { label: "Duration", value: project.duration },
    project.year && { label: "Year", value: String(project.year) },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <PageHero
        art={DIVISION_ART[brandSlug]?.primary}
        secondaryArt={DIVISION_ART[brandSlug]?.secondary}
        eyebrow={project.category?.[0] ?? "Project"}
        title={project.title}
        description={project.summary}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: brandName, href: `/${brandSlug}` },
          { label: "Projects", href: `/${brandSlug}/projects` },
        ]}
      />

      <section className="hv-aura-bg section relative">
        <Container className="max-w-4xl">
          {hero && (
            <ClipReveal className="relative aspect-video w-full overflow-hidden rounded-card bg-brand-tint-deep shadow-lift">
              {hero.type === "video" ? (
                <video
                  src={hero.videoUrl}
                  poster={hero.posterUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={project.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={hero.imageUrl}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 56rem, 100vw"
                  // Next 16 deprecates `priority` in favour of explicit loading hints.
                  loading="eager"
                  fetchPriority="high"
                  className="object-cover"
                />
              )}
            </ClipReveal>
          )}

          {facts.length > 0 && (
            <Stagger
              as="dl"
              gap={0.08}
              className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-brand-line-soft py-8 sm:grid-cols-4"
            >
              {facts.map((fact) => (
                <StaggerItem key={fact.label} y={14}>
                  <dt className="font-display text-[0.6875rem] font-bold tracking-[0.15em] text-brand-ink/45 uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-brand-ink/85">{fact.value}</dd>
                </StaggerItem>
              ))}
            </Stagger>
          )}

          <Reveal delay={0.1} className="mt-12">
            <PortableText value={project.description} />
          </Reveal>

          {project.gallery && project.gallery.length > 0 && (
            <Stagger gap={0.06} className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {project.gallery.map((img, i) => (
                <StaggerItem key={i} y={20}>
                  <div className="group relative aspect-square overflow-hidden rounded-card shadow-soft">
                    <Image
                      src={urlFor(img).width(500).height(500).url()}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 18rem, 45vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105"
                    />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          )}

          <Reveal delay={0.1}>
            <div className="mt-16 flex flex-wrap items-center gap-4 rounded-card border border-brand-line-soft bg-white p-8 shadow-soft">
              <div className="flex-1">
                <p className="font-display text-lg font-semibold tracking-tight text-brand-ink">
                  Planning something similar?
                </p>
                <p className="mt-1.5 text-sm text-brand-ink/65">
                  {brandName} can walk you through how this one was delivered.
                </p>
              </div>
              <Button href={`/${brandSlug}/contact`} variant="secondary" withArrow>
                Start a conversation
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
