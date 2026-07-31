import Image from "next/image";
import Link from "next/link";

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
import { FramedMedia } from "@/components/ui/FramedMedia";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
        headline={resolvedBrand.hero?.headline ?? resolvedBrand.tagline ?? resolvedBrand.name}
        slides={getHeroSlides(resolvedBrand)}
        ctaLabel={resolvedBrand.hero?.ctaLabel}
        ctaHref={resolvedBrand.hero?.ctaHref}
      />

      {resolvedBrand.hero?.subheadline && (
        <HeroStatementCard eyebrow="Our Commitment" text={resolvedBrand.hero.subheadline} />
      )}

      <ClientMarquee clients={resolvedClients} />

      {whyChoose && <WhyChoose content={whyChoose} />}

      {/* Divisions */}
      <section id="divisions" className="scroll-mt-28 bg-brand-surface py-24">
        <Container>
          <SectionHeading
            eyebrow="Our Divisions"
            title="Three specialist divisions, one standard of excellence"
          />

          <div className="mt-16 flex flex-col gap-20 sm:gap-28">
            {resolvedSubsidiaries.map((sub, i) => {
              const heroImage = getHeroSlides(sub).find((s) => s.type === "image");
              const reversed = i % 2 === 1;

              return (
                <Reveal
                  key={sub.slug.current}
                  className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16"
                >
                  <div className={reversed ? "md:order-2" : ""}>
                    <h3 className="font-display text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
                      {sub.name}
                    </h3>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-brand-ink/70">
                      {sub.shortDescription}
                    </p>
                    <Button href={`/${sub.slug.current}`} variant="primary" className="mt-8">
                      Learn More
                    </Button>
                  </div>

                  {/* The image links to the division too — the hover motion in
                      FramedMedia is keyed off this `group`. */}
                  <Link
                    href={`/${sub.slug.current}`}
                    aria-label={`Visit ${sub.name}`}
                    className={`group block ${reversed ? "md:order-1" : ""}`}
                  >
                    <FramedMedia
                      src={heroImage?.type === "image" ? heroImage.imageUrl : undefined}
                      alt={sub.name}
                      className="aspect-[4/3] w-full max-w-md"
                    />
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Narrative statement */}
      <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden">
        {resolvedBrand.narrativeImage ? (
          <Image
            src={urlFor(resolvedBrand.narrativeImage).width(1920).height(1080).url()}
            alt=""
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-accent" />
        )}

        <Container className="relative flex justify-center px-6 py-20">
          <Reveal className="max-w-2xl rounded-card border-2 border-brand-primary bg-white/90 p-10 text-center backdrop-blur-sm sm:p-14">
            <p className="font-display text-2xl leading-snug font-bold tracking-tight text-brand-ink sm:text-3xl">
              One holding company. Three specialist divisions.{" "}
              <span className="text-brand-accent">One point of contact</span> for every project, from ground survey
              to final handover.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Process */}
      <section className="py-24">
        <Container>
          <SectionHeading eyebrow="How We Work" title="Our process" />
          <Reveal delay={0.1} className="mt-14">
            <ProcessSteps steps={resolvedBrand.process ?? []} />
          </Reveal>
        </Container>
      </section>

      {/* Featured projects */}
      <section className="bg-brand-surface py-24">
        <Container>
          <SectionHeading eyebrow="Selected Work" title="Featured projects" />
          <Reveal delay={0.1} className="mt-14">
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
          </Reveal>
        </Container>
      </section>

      {/* Project gallery — every project's photos pooled with the loose Home Gallery
          uploads. Full-bleed marquee, then a contained masonry grid. */}
      {galleryItems.length > 0 && (
        <section className="py-24">
          <Container>
            <SectionHeading
              eyebrow={homeGallery?.eyebrow ?? "Project Gallery"}
              title={homeGallery?.heading ?? "Our work in pictures"}
            />
          </Container>

          <div className="mt-14">
            <PhotoMarquee items={galleryItems} />
          </div>
        </section>
      )}

      {/* Properties CTA */}
      <section className="py-28">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Property Listings"
            title="Explore available properties across all our companies"
          />

          <Reveal delay={0.1} className="mt-14">
            <PropertiesCarousel
              properties={(latestProperties ?? []).map((p) => ({
                slug: p.slug.current,
                title: p.title,
                imageUrl: p.images?.[0] ? urlFor(p.images[0]).width(800).height(600).url() : undefined,
                location: [p.location?.city, p.location?.region].filter(Boolean).join(", "),
                status: p.status,
              }))}
            />
          </Reveal>

          <div className="mt-12 flex justify-center">
            <Button href="/properties" variant="secondary">
              View All Properties
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
