import Image from "next/image";

import { safeFetch } from "../../../sanity/lib/client";
import {
  ALL_SUBSIDIARY_BRANDS_QUERY,
  BRAND_BY_SLUG_QUERY,
  FEATURED_PROJECTS_ACROSS_BRANDS_QUERY,
  LATEST_AVAILABLE_PROPERTIES_QUERY,
} from "../../../sanity/lib/queries";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FramedMedia } from "@/components/ui/FramedMedia";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeroCarousel } from "@/components/marketing/HeroCarousel";
import { StatsRow } from "@/components/marketing/StatsRow";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { FeaturedProjectsBento } from "@/components/marketing/FeaturedProjectsBento";
import { PropertiesCarousel } from "@/components/marketing/PropertiesCarousel";
import { getHeroSlides } from "@/lib/brandHelpers";
import { FALLBACK_BRANDS } from "@/lib/fallbackContent";
import { urlFor } from "../../../sanity/lib/image";
import type { BrandDoc, ProjectDoc, PropertyDoc } from "@/types/sanity";

export default async function HoldingsHomePage() {
  const [brand, subsidiaries, featuredProjects, latestProperties] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: "holdings" }, ["brand", "brand:holdings"]),
    safeFetch<BrandDoc[]>(ALL_SUBSIDIARY_BRANDS_QUERY, {}, ["brand"]),
    safeFetch<ProjectDoc[]>(FEATURED_PROJECTS_ACROSS_BRANDS_QUERY, {}, ["project"]),
    safeFetch<PropertyDoc[]>(LATEST_AVAILABLE_PROPERTIES_QUERY, {}, ["property"]),
  ]);

  const resolvedBrand = brand ?? FALLBACK_BRANDS.holdings;
  const resolvedSubsidiaries =
    subsidiaries && subsidiaries.length > 0
      ? subsidiaries
      : Object.values(FALLBACK_BRANDS).filter((b) => !b.isParent);

  return (
    <>
      <HeroCarousel
        headline={resolvedBrand.hero?.headline ?? resolvedBrand.tagline ?? resolvedBrand.name}
        subheadline={resolvedBrand.hero?.subheadline}
        slides={getHeroSlides(resolvedBrand)}
        ctaLabel={resolvedBrand.hero?.ctaLabel}
        ctaHref={resolvedBrand.hero?.ctaHref}
      />

      {/* Mission + stats */}
      <section className="py-24">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <SectionHeading eyebrow="Our Mission" title={resolvedBrand.tagline ?? resolvedBrand.name} />
          <Reveal delay={0.1} className="flex flex-col justify-between gap-10">
            <p className="max-w-xl text-lg leading-relaxed text-brand-ink/70">{resolvedBrand.shortDescription}</p>
            {resolvedBrand.stats && <StatsRow stats={resolvedBrand.stats} />}
          </Reveal>
        </Container>
      </section>

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

                  <div className={reversed ? "md:order-1" : ""}>
                    <FramedMedia
                      src={heroImage?.type === "image" ? heroImage.imageUrl : undefined}
                      alt={sub.name}
                      className="aspect-[4/3] w-full max-w-md"
                    />
                  </div>
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
          <Reveal className="max-w-2xl border-2 border-brand-primary bg-white/90 p-10 text-center backdrop-blur-sm sm:p-14">
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
                coverImageUrl: p.coverImage ? urlFor(p.coverImage).width(1000).height(1200).url() : undefined,
                gallery: p.gallery?.map((img) => ({
                  url: urlFor(img).width(600).height(600).url(),
                  alt: img.alt,
                })),
              }))}
            />
          </Reveal>
        </Container>
      </section>

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
            <Button href="/properties" variant="secondary" uppercase={false}>
              View All Properties
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
