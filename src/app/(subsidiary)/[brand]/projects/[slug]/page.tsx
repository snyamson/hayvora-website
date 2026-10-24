import Image from "next/image";
import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY, PROJECT_BY_SLUG_QUERY } from "../../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../../sanity/lib/image";
import { PillLink } from "@/components/site/Actions";
import { PageBanner } from "@/components/site/division/DivisionSections";
import { Reveal } from "@/components/ui/Motion";
import { PortableText } from "@/components/portable-text/PortableText";
import { isSubsidiarySlug } from "@/lib/brands";
import { divisionHref, fill, getPageText, getSiteSettings } from "@/lib/content";
import { crumbsFor } from "@/lib/pageContext";
import { getProjectHero } from "@/lib/projectHelpers";
import { buildMetadata, ogImageUrl } from "@/lib/seo";
import type { BrandDoc, ProjectDoc } from "@/types/sanity";

const fetchProject = (slug: string) =>
  safeFetch<ProjectDoc & { description?: unknown }>(PROJECT_BY_SLUG_QUERY, { slug }, ["project", `project:${slug}`]);

export async function generateMetadata({ params }: { params: Promise<{ brand: string; slug: string }> }) {
  const { brand: brandSlug, slug } = await params;
  if (!isSubsidiarySlug(brandSlug)) return {};
  const [project, text] = await Promise.all([fetchProject(slug), getPageText()]);
  if (!project) return { title: text?.projects?.notFoundTitle };

  return buildMetadata({
    title: [project.title, project.location].filter(Boolean).join(" — "),
    description: project.summary,
    path: `/${brandSlug}/projects/${slug}`,
    image: ogImageUrl(project.coverImage),
    type: "article",
  });
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ brand: string; slug: string }> }) {
  const { brand: brandSlug, slug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const [project, brand, text, settings] = await Promise.all([
    fetchProject(slug),
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]),
    getPageText(),
    getSiteSettings(),
  ]);
  if (!project || !brand) notFound();

  const t = text?.projects;
  const hero = getProjectHero(project);
  const facts = [
    project.client && { label: t?.clientLabel, value: project.client },
    project.location && { label: t?.locationLabel, value: project.location },
    project.duration && { label: t?.durationLabel, value: project.duration },
    project.year && { label: t?.yearLabel, value: String(project.year) },
  ].filter(Boolean) as { label?: string; value: string }[];
  const { crumbs, crumbLabel } = await crumbsFor([
    { label: brand.name, href: `/${brandSlug}` },
    { label: t?.title ?? "", href: `/${brandSlug}/projects` },
    { label: project.title },
  ]);

  return (
    <>
      <PageBanner
        short
        crumbs={crumbs}
        crumbLabel={crumbLabel}
        eyebrow={project.category?.[0]}
        heading={project.title}
        description={project.summary}
        imageUrl={project.coverImage?.asset ? urlFor(project.coverImage).width(1920).url() : undefined}
      />

      <section className="py-24">
        <div className="mx-auto max-w-[960px] px-5 sm:px-10">
          {hero && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[var(--hv-tint)]">
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
                  sizes="(min-width: 1024px) 60rem, 100vw"
                  loading="eager"
                  className="object-cover"
                />
              )}
            </div>
          )}

          {facts.length > 0 && (
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-[var(--hv-line)] py-8 sm:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.value}>
                  <dt className="hv-mono text-xs tracking-[0.06em] text-[var(--hv-muted)]">{fact.label}</dt>
                  <dd className="mt-2 text-lg text-[var(--hv-blue)]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <Reveal delay={0.1} className="mt-12">
            <PortableText value={project.description} />
          </Reveal>

          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {project.gallery.map((img, i) => (
                <div key={i} className="hv-zoom relative aspect-square">
                  <Image src={urlFor(img).width(500).height(500).url()} alt={img.alt ?? ""} fill sizes="(min-width: 640px) 18rem, 45vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {t?.ctaHeading && (
            <div className="mt-16 flex flex-wrap items-center gap-6 rounded-[20px] bg-[var(--hv-blue)] p-8 text-white sm:p-10">
              <div className="flex-1">
                <p className="text-2xl font-bold tracking-[-0.03em]">{t.ctaHeading}</p>
                <p className="mt-2 text-base text-white/85">{fill(t.ctaBody, { division: brand.name })}</p>
              </div>
              <PillLink link={{ label: t.ctaLabel, href: divisionHref(settings?.header?.cta?.href, brandSlug) }} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
