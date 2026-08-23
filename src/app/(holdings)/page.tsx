import Image from "next/image";

import { safeFetch } from "../../../sanity/lib/client";
import {
  ALL_CLIENTS_QUERY,
  ALL_SUBSIDIARY_BRANDS_QUERY,
  BRAND_BY_SLUG_QUERY,
  FEATURED_PROJECTS_ACROSS_BRANDS_QUERY,
  HOME_GALLERY_QUERY,
  LATEST_AVAILABLE_PROPERTIES_QUERY,
  PROJECT_GALLERY_POOL_QUERY,
} from "../../../sanity/lib/queries";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Parallax, Reveal, TextReveal } from "@/components/ui/Motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DivisionsShowcase } from "@/components/marketing/DivisionsShowcase";
import { HeroCarousel } from "@/components/marketing/HeroCarousel";
import { HeroStatementCard } from "@/components/marketing/HeroStatementCard";
import { ClientMarquee } from "@/components/marketing/ClientMarquee";
import { WhyChoose } from "@/components/marketing/WhyChoose";
import { PhotoMarquee } from "@/components/marketing/PhotoMarquee";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { FeaturedProjectsBento } from "@/components/marketing/FeaturedProjectsBento";
import { PropertiesCarousel } from "@/components/marketing/PropertiesCarousel";
import { getHeroSlides, getMarqueeClients, getWhyChooseContent } from "@/lib/brandHelpers";
import { getGalleryItems } from "@/lib/galleryHelpers";
import { getProjectThumbnail } from "@/lib/projectHelpers";
import { FALLBACK_BRANDS, FALLBACK_CLIENTS } from "@/lib/fallbackContent";
import { urlFor } from "../../../sanity/lib/image";
import type {
  BrandDoc,
  ClientDoc,
  HomeGalleryDoc,
  ProjectDoc,
  ProjectGallerySource,
  PropertyDoc,
} from "@/types/sanity";

export default async function HoldingsHomePage() {
  const [brand, subsidiaries, featuredProjects, latestProperties, clients, homeGallery, galleryProjects] =
    await Promise.all([
      safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: "holdings" }, ["brand", "brand:holdings"]),
      safeFetch<BrandDoc[]>(ALL_SUBSIDIARY_BRANDS_QUERY, {}, ["brand"]),
      safeFetch<ProjectDoc[]>(FEATURED_PROJECTS_ACROSS_BRANDS_QUERY, {}, ["project"]),
      safeFetch<PropertyDoc[]>(LATEST_AVAILABLE_PROPERTIES_QUERY, {}, ["property"]),
      safeFetch<ClientDoc[]>(ALL_CLIENTS_QUERY, {}, ["client"]),
      safeFetch<HomeGalleryDoc>(HOME_GALLERY_QUERY, {}, ["homeGallery"]),
      safeFetch<ProjectGallerySource[]>(PROJECT_GALLERY_POOL_QUERY, {}, ["project"]),
    ]);

  const resolvedBrand = brand ?? FALLBACK_BRANDS.holdings;
  const resolvedSubsidiaries =
    subsidiaries && subsidiaries.length > 0
      ? subsidiaries
      : Object.values(FALLBACK_BRANDS).filter((b) => !b.isParent);

  const marqueeClients = getMarqueeClients(clients);
  const resolvedClients = marqueeClients.length > 0 ? marqueeClients : FALLBACK_CLIENTS;
  const whyChoose = getWhyChooseContent(resolvedBrand, FALLBACK_BRANDS.holdings);
  const galleryItems = getGalleryItems(homeGallery, galleryProjects);

  return (
    <>
      <HeroCarousel
        eyebrow="Hayvora Holdings Limited"
        headline={resolvedBrand.hero?.headline ?? resolvedBrand.tagline ?? resolvedBrand.name}
        slides={getHeroSlides(resolvedBrand)}
        ctaLabel={resolvedBrand.hero?.ctaLabel}
        ctaHref={resolvedBrand.hero?.ctaHref}
        secondaryCtaLabel="Our divisions"
        secondaryCtaHref="/#divisions"
      />

      {resolvedBrand.hero?.subheadline && (
        <HeroStatementCard eyebrow="Our Commitment" text={resolvedBrand.hero.subheadline} />
      )}

      <ClientMarquee clients={resolvedClients} label="Trusted by teams across Ghana and West Africa" />

      {whyChoose && <WhyChoose content={whyChoose} />}

      {/* ---- Divisions ---- */}
      <section id="divisions" className="hv-grid-bg section relative scroll-mt-28 bg-brand-tint">
        <Container>
          <SectionHeading
            eyebrow="Our Divisions"
            title="Three specialist divisions, one standard of excellence"
            description="Each division runs its own specialists and equipment — and shares a single point of contact, so a project never falls between them."
          />

          <Reveal delay={0.1} className="mt-16">
            <DivisionsShowcase
              divisions={resolvedSubsidiaries.map((sub) => {
                const heroImage = getHeroSlides(sub).find((s) => s.type === "image");
                return {
                  slug: sub.slug.current,
                  name: sub.name,
                  tagline: sub.tagline,
                  description: sub.shortDescription,
                  imageUrl: heroImage?.type === "image" ? heroImage.imageUrl : undefined,
                };
              })}
            />
          </Reveal>
        </Container>
      </section>

      {/* ---- Narrative statement ---- */}
      <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-brand-secondary-deep">
        {resolvedBrand.narrativeImage ? (
          <Parallax speed={50} className="absolute inset-0">
            <Image
              src={urlFor(resolvedBrand.narrativeImage).width(1920).height(1080).url()}
              alt=""
              fill
              sizes="100vw"
              className="scale-110 object-cover"
            />
          </Parallax>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary-deep via-brand-primary to-brand-secondary" />
        )}

        <div aria-hidden className="absolute inset-0 bg-brand-secondary-deep/70" />

        <Container className="relative flex justify-center px-6 py-24">
          <div className="max-w-3xl text-center">
            <TextReveal
              as="p"
              text="One holding company. Three specialist divisions. One point of contact for every project, from ground survey to final handover."
              className="font-display text-2xl leading-[1.3] font-semibold tracking-tight text-white sm:text-3xl lg:text-[2.5rem]"
            />
            <Reveal delay={0.4} className="mt-10 flex justify-center">
              <Button href="/about" variant="white" withArrow>
                About Hayvora
              </Button>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---- Process ---- */}
      <section className="hv-aura-bg section relative">
        <Container>
          <SectionHeading
            eyebrow="How We Work"
            title="Our process"
            description="Three stages, the same on every job — so you always know what happens next."
          />
          <div className="mt-16">
            <ProcessSteps steps={resolvedBrand.process ?? []} />
          </div>
        </Container>
      </section>

      {/* ---- Featured projects ---- */}
      <section className="section bg-brand-tint">
        <Container>
          <SectionHeading
            eyebrow="Selected Work"
            title="Featured projects"
            action={
              <Button href="/#divisions" variant="outline" withArrow>
                Browse by division
              </Button>
            }
          />
          <div className="mt-16">
            <FeaturedProjectsBento
              projects={(featuredProjects ?? []).map((p) => ({
                slug: p.slug.current,
                brandSlug: p.brand?.slug.current ?? "",
                title: p.title,
                category: p.category?.[0],
                client: p.client,
                duration: p.duration,
                location: p.location,
                summary: p.summary,
                description: p.description,
                // Thumbnail, deliberately not the project's hero media — those are
                // separate uploads so the card and the project page differ.
                coverImageUrl: getProjectThumbnail(p),
                gallery: p.gallery?.map((img) => ({
                  url: urlFor(img).width(600).height(600).url(),
                  alt: img.alt,
                })),
              }))}
            />
          </div>
        </Container>
      </section>

      {/* ---- Project gallery ---- */}
      {/* Every project's photos pooled with the loose Home Gallery uploads. Full-bleed
          marquee under a contained heading. */}
      {galleryItems.length > 0 && (
        <section className="section">
          <Container>
            <SectionHeading
              align="center"
              eyebrow={homeGallery?.eyebrow ?? "Project Gallery"}
              title={homeGallery?.heading ?? "Our work in pictures"}
            />
          </Container>

          <div className="mt-16">
            <PhotoMarquee items={galleryItems} />
          </div>
        </section>
      )}

      {/* ---- Properties ---- */}
      <section className="hv-grid-bg section relative bg-brand-tint">
        <Container>
          <SectionHeading
            eyebrow="Property Listings"
            title="Available properties across the group"
            description="Land and developments from every Hayvora company, in one place."
            action={
              <Button href="/properties" variant="outline" withArrow>
                View all properties
              </Button>
            }
          />

          <div className="mt-16">
            <PropertiesCarousel
              properties={(latestProperties ?? []).map((p) => ({
                slug: p.slug.current,
                title: p.title,
                imageUrl: p.images?.[0] ? urlFor(p.images[0]).width(800).height(600).url() : undefined,
                location: [p.location?.city, p.location?.region].filter(Boolean).join(", "),
                status: p.status,
              }))}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
