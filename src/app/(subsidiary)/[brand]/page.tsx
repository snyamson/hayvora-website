import { notFound } from "next/navigation";

import { safeFetch } from "../../../../sanity/lib/client";
import {
  BRAND_BY_SLUG_QUERY,
  DIVISION_PROFILE_BY_BRAND_QUERY,
  FEATURED_PROJECTS_BY_BRAND_QUERY,
  GALLERY_IMAGES_BY_BRAND_QUERY,
  SERVICES_BY_BRAND_QUERY,
} from "../../../../sanity/lib/queries";
import { urlFor } from "../../../../sanity/lib/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeroCarousel } from "@/components/marketing/HeroCarousel";
import { HeroStatementCard } from "@/components/marketing/HeroStatementCard";
import { DivisionGallery, type GalleryPhoto } from "@/components/marketing/DivisionGallery";
import {
  DivisionClients,
  DivisionOverview,
  DivisionValues,
  DivisionVisionMission,
} from "@/components/marketing/DivisionProfile";
import { DivisionServices } from "@/components/marketing/DivisionServices";
import { ProjectGalleryGrid, type ProjectCard } from "@/components/marketing/ProjectGalleryGrid";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { getHeroSlides } from "@/lib/brandHelpers";
import { isSubsidiarySlug } from "@/lib/brands";
import { resolveDivisionContent } from "@/lib/divisionContent";
import { FALLBACK_BRANDS } from "@/lib/fallbackContent";
import type { BrandDoc, DivisionProfileDoc, ProjectDoc, SanityImage, ServiceDoc } from "@/types/sanity";
import { buildMetadata } from "@/lib/seo";

type GalleryGroup = { title: string; images?: SanityImage[] };

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) return {};

  const [brand, profileDoc] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]),
    safeFetch<DivisionProfileDoc>(DIVISION_PROFILE_BY_BRAND_QUERY, { slug: brandSlug }, [
      "divisionProfile",
      `divisionProfile:${brandSlug}`,
    ]),
  ]);
  const resolved = brand ?? FALLBACK_BRANDS[brandSlug];
  const profile = resolveDivisionContent(brandSlug, profileDoc);

  return buildMetadata({
    title: `${resolved.name} — ${profile?.tagline ?? resolved.tagline ?? "Hayvora Holdings"}`,
    description: profile?.overview[0] ?? resolved.shortDescription,
    path: `/${brandSlug}`,
    seo: resolved.seo,
  });
}

export default async function SubsidiaryHomePage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const [brand, profileDoc, projects, services, galleryGroups] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]),
    safeFetch<DivisionProfileDoc>(DIVISION_PROFILE_BY_BRAND_QUERY, { slug: brandSlug }, [
      "divisionProfile",
      `divisionProfile:${brandSlug}`,
    ]),
    safeFetch<ProjectDoc[]>(FEATURED_PROJECTS_BY_BRAND_QUERY, { slug: brandSlug }, ["project"]),
    safeFetch<ServiceDoc[]>(SERVICES_BY_BRAND_QUERY, { slug: brandSlug }, ["service"]),
    safeFetch<GalleryGroup[]>(GALLERY_IMAGES_BY_BRAND_QUERY, { slug: brandSlug }, ["project"]),
  ]);

  const resolvedBrand = brand ?? FALLBACK_BRANDS[brandSlug];
  const modules = new Set(resolvedBrand.enabledModules ?? []);

  // Long-form profile copy: the Sanity document, merged over the repo fallback so a
  // missing or partially-filled profile never blanks a section.
  const profile = resolveDivisionContent(brandSlug, profileDoc);

  const projectCards: ProjectCard[] = (projects ?? []).map((p) => ({
    slug: p.slug.current,
    title: p.title,
    location: p.location,
    year: p.year,
    imageUrl: p.coverImage ? urlFor(p.coverImage).width(900).height(700).url() : undefined,
    href: `/${brandSlug}/projects/${p.slug.current}`,
  }));

  const photos: GalleryPhoto[] = (galleryGroups ?? [])
    .flatMap((group) => group.images ?? [])
    .slice(0, 12)
    .map((img) => ({ url: urlFor(img).width(900).height(900).url(), alt: "" }));

  // Hero stills double as the profile and service-explorer photography, so a division
  // page still looks art-directed before anyone uploads section-specific imagery.
  const heroStills = getHeroSlides(resolvedBrand)
    .filter((slide) => slide.type === "image")
    .map((slide) => (slide.type === "image" ? slide.imageUrl : ""))
    .filter(Boolean);

  const serviceImages = photos.length > 0 ? photos.map((p) => p.url) : heroStills;

  const previewServices = (services ?? []).slice(0, 6);

  return (
    <>
      <HeroCarousel
        eyebrow="A Hayvora Holdings division"
        headline={resolvedBrand.hero?.headline ?? profile?.tagline ?? resolvedBrand.tagline ?? resolvedBrand.name}
        slides={getHeroSlides(resolvedBrand)}
        ctaLabel={resolvedBrand.hero?.ctaLabel ?? (modules.has("projects") ? "Our projects" : undefined)}
        ctaHref={resolvedBrand.hero?.ctaHref ?? (modules.has("projects") ? `/${brandSlug}/projects` : undefined)}
        secondaryCtaLabel="Talk to us"
        secondaryCtaHref={`/${brandSlug}/contact`}
      />

      {resolvedBrand.hero?.subheadline && (
        <HeroStatementCard eyebrow="What We Do" text={resolvedBrand.hero.subheadline} />
      )}

      {/* ---- Long-form profile ---- */}
      {profile && (
        <>
          <DivisionOverview
            content={profile}
            imageUrl={heroStills[0] ?? photos[0]?.url}
            secondaryImageUrl={heroStills[1] ?? photos[1]?.url}
          />

          <DivisionVisionMission content={profile} slug={brandSlug} />

          {/* ---- Service catalogue ---- */}
          <section className="hv-grid-bg section relative bg-brand-tint">
            <Container>
              <SectionHeading
                eyebrow="Our Services"
                title={profile.servicesHeading ?? `What ${resolvedBrand.name} delivers`}
                description={profile.servicesIntro}
                action={
                  modules.has("services") && previewServices.length > 0 ? (
                    <Button href={`/${brandSlug}/services`} variant="outline" withArrow>
                      Service pages
                    </Button>
                  ) : undefined
                }
              />

              <div className="mt-16">
                <DivisionServices services={profile.services} imageUrls={serviceImages} />
              </div>
            </Container>
          </section>

          <DivisionValues content={profile} />
        </>
      )}

      {/* ---- Featured projects ---- */}
      {modules.has("projects") && projectCards.length > 0 && (
        <section className="hv-aura-bg section relative">
          <Container>
            <SectionHeading
              eyebrow="Featured Work"
              title="Selected projects"
              action={
                <Button href={`/${brandSlug}/projects`} variant="outline" withArrow>
                  View all projects
                </Button>
              }
            />
            <div className="mt-16">
              <ProjectGalleryGrid projects={projectCards} />
            </div>
          </Container>
        </section>
      )}

      {/* ---- Photography ---- */}
      {photos.length > 0 && (
        <section className="section bg-brand-tint">
          <Container>
            <SectionHeading
              align="center"
              eyebrow="On Site"
              title="The work in progress"
              description="Photography from live sites and completed handovers."
            />
            <div className="mt-16">
              <DivisionGallery photos={photos} />
            </div>
            {modules.has("gallery") && (
              <div className="mt-14 flex justify-center">
                <Button href={`/${brandSlug}/gallery`} variant="outline" withArrow>
                  Open the full gallery
                </Button>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* ---- Target clients ---- */}
      {profile && <DivisionClients content={profile} slug={brandSlug} />}

      {/* ---- Individual service pages ---- */}
      {/* Only shown when the CMS actually holds service documents; the catalogue above
          is the editorial description, these are the deep-dive pages. */}
      {modules.has("services") && previewServices.length > 0 && (
        <section className="hv-aura-bg section relative">
          <Container>
            <SectionHeading
              eyebrow="Go Deeper"
              title="Service detail"
              action={
                <Button href={`/${brandSlug}/services`} variant="outline" withArrow>
                  All services
                </Button>
              }
            />

            <Stagger gap={0.07} className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {previewServices.map((service, i) => (
                <StaggerItem key={service.slug.current} y={26}>
                  <ServiceCard
                    title={service.title}
                    shortDescription={service.shortDescription}
                    href={`/${brandSlug}/services/${service.slug.current}`}
                    index={i}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>
      )}

      {/* Divisions with no profile copy yet still need something under the hero. */}
      {!profile && (
        <section className="hv-aura-bg section relative">
          <Container>
            <SectionHeading
              eyebrow="Overview"
              title={resolvedBrand.name}
              description={resolvedBrand.shortDescription}
            />
            <Reveal delay={0.15} className="mt-10">
              <Button href={`/${brandSlug}/contact`} variant="primary" withArrow>
                Talk to {resolvedBrand.name}
              </Button>
            </Reveal>
          </Container>
        </section>
      )}
    </>
  );
}
