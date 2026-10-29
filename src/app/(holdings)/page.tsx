import { safeFetch } from "../../../sanity/lib/client";
import { urlFor } from "../../../sanity/lib/image";
import {
  BRAND_BY_SLUG_QUERY,
  HOME_GALLERY_QUERY,
  LATEST_AVAILABLE_PROPERTIES_QUERY,
  PROJECT_GALLERY_POOL_QUERY,
} from "../../../sanity/lib/queries";
import { NumberedAccordion } from "@/components/site/Accordion";
import { PillLink, Chip, MixedHeading } from "@/components/site/Actions";
import { HomeHero } from "@/components/site/home/HomeHero";
import {
  DivisionCards,
  GalleryGrid,
  Metrics,
  NarrativeBand,
  PropertyGrid,
  StatementPanel,
  WhyChooseBlock,
} from "@/components/site/home/HomeSections";
import { ProjectsCarousel } from "@/components/site/ProjectsCarousel";
import { getHeroSlides } from "@/lib/brandHelpers";
import { getDivisions, getFeaturedProjects, getHomePage, getPageText, getSiteSettings } from "@/lib/content";
import { getGalleryItems } from "@/lib/galleryHelpers";
import { getProjectThumbnail, projectImageAlt } from "@/lib/projectHelpers";
import { toPropertyCard } from "@/lib/propertyCards";
import { buildMetadata } from "@/lib/seo";
import type { BrandDoc, HomeGalleryDoc, ProjectDoc, ProjectGallerySource, PropertyDoc, SanityImage } from "@/types/sanity";
import { describe } from "@/lib/imageAlt";

const img = (image: SanityImage | undefined, width: number, height?: number) => {
  if (!image?.asset) return undefined;
  try {
    const b = urlFor(image).width(width);
    return (height ? b.height(height) : b).url();
  } catch {
    return undefined;
  }
};

export async function generateMetadata() {
  const [home, brand] = await Promise.all([
    getHomePage(),
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: "holdings" }, ["brand", "brand:holdings"]),
  ]);
  return buildMetadata({ path: "/", seo: home?.seo ?? brand?.seo });
}

const projectEyebrow = (p: ProjectDoc) => [p.category?.[0], p.location].filter(Boolean).join(" · ");
const projectMeta = (p: ProjectDoc) => [p.client, p.duration].filter(Boolean).join(" · ");
const projectHref = (p: ProjectDoc) => `/${p.brand?.slug.current ?? ""}/projects/${p.slug.current}`;

export default async function HoldingsHomePage() {
  const [brand, home, settings, text, divisions, featured, properties, gallery, pool] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: "holdings" }, ["brand", "brand:holdings"]),
    getHomePage(),
    getSiteSettings(),
    getPageText(),
    getDivisions(),
    getFeaturedProjects(),
    safeFetch<PropertyDoc[]>(LATEST_AVAILABLE_PROPERTIES_QUERY, {}, ["property"]),
    safeFetch<HomeGalleryDoc>(HOME_GALLERY_QUERY, {}, ["homeGallery"]),
    safeFetch<ProjectGallerySource[]>(PROJECT_GALLERY_POOL_QUERY, {}, ["project"]),
  ]);

  const labels = settings?.labels;
  const projects = featured ?? [];
  const galleryImages = getGalleryItems(gallery, pool, {
    fallbackAlt: text?.gallery?.imageAlt,
    owner: brand?.name,
    size: { width: 1200, height: 800 },
  });
  const wc = brand?.whyChoose;
  const process = home?.process;

  return (
    <>
      <HomeHero
        headline={brand?.hero?.headline}
        subheadline={brand?.hero?.subheadline}
        cta={{ label: brand?.hero?.ctaLabel, href: brand?.hero?.ctaHref }}
        media={getHeroSlides(brand ?? undefined)[0]}
        projects={projects.map((p) => ({
          title: p.title,
          eyebrow: projectEyebrow(p),
          imageUrl: getProjectThumbnail(p, 600, 340),
          imageAlt: projectImageAlt(p, p.coverImage?.alt),
          href: projectHref(p),
        }))}
        labels={{ previous: labels?.previous, next: labels?.next }}
      />

      <StatementPanel text={home?.statement?.text} cta={home?.statement?.cta} />

      <WhyChooseBlock
        eyebrow={wc?.eyebrow}
        heading={wc?.heading}
        body={wc?.statDescription}
        cta={{ label: wc?.ctaLabel, href: wc?.ctaHref }}
        imageUrl={img(wc?.statImage, 1200)}
        imageAlt={describe(undefined, brand?.name)}
      />

      <Metrics intro={home?.metrics} stats={brand?.stats ?? []} />

      <DivisionCards
        intro={home?.divisions}
        linkLabel={home?.divisionCardLabel}
        divisions={(divisions ?? []).map((d) => {
          const still = getHeroSlides(d).find((s) => s.type === "image");
          return {
            slug: d.slug.current,
            name: d.name,
            tagline: d.tagline,
            description: d.shortDescription,
            imageUrl: still?.type === "image" ? still.imageUrl : undefined,
            imageAlt: describe(still?.type === "image" ? still.alt : undefined, d.name),
          };
        })}
      />

      <NarrativeBand
        heading={home?.narrative?.heading}
        body={home?.narrative?.body}
        cta={home?.narrative?.cta}
        imageUrl={img(brand?.narrativeImage, 1920)}
        imageAlt={describe(undefined, brand?.name)}
      />

      {(brand?.process?.length ?? 0) > 0 && (
        <section className="px-3 py-10 sm:px-6">
          <div className="mx-auto max-w-[1392px] rounded-[20px] bg-[var(--hv-tint)] px-5 py-[clamp(56px,7vw,96px)] sm:px-[clamp(20px,8vw,122px)]">
            <Chip>{process?.intro?.eyebrow}</Chip>
            <div className="mt-6">
              <MixedHeading heading={process?.intro?.heading} emphasis={process?.intro?.headingEmphasis} />
            </div>
            <div className="mt-14">
              <NumberedAccordion
                closeLabel={labels?.close}
                items={brand!.process!.map((step, i) => ({
                  key: `${i}-${step.title}`,
                  title: step.title,
                  imageUrl: img(step.image, 1000, 700),
                  imageAlt: describe(undefined, step.title, brand?.name),
                  body: (
                    <>
                      {step.description && (
                        <p className="mt-3.5 max-w-[460px] text-lg leading-[26px] text-[var(--hv-blue)]">{step.description}</p>
                      )}
                      {process?.cta?.label && (
                        <div className="mt-auto pt-8">
                          <PillLink link={process.cta} variant="solid" />
                        </div>
                      )}
                    </>
                  ),
                }))}
              />
            </div>
          </div>
        </section>
      )}

      <ProjectsCarousel
        heading={home?.featuredProjects?.heading}
        cta={home?.featuredProjects?.cta}
        emptyText={home?.featuredProjects?.emptyText}
        labels={{ previous: labels?.previous, next: labels?.next, counter: labels?.counter }}
        projects={projects.map((p) => ({
          href: projectHref(p),
          title: p.title,
          eyebrow: projectEyebrow(p),
          meta: projectMeta(p),
          imageUrl: getProjectThumbnail(p, 1000, 1334),
          imageAlt: projectImageAlt(p, p.coverImage?.alt),
        }))}
      />

      <GalleryGrid
        eyebrow={gallery?.eyebrow}
        heading={gallery?.heading}
        link={gallery?.link}
        images={galleryImages.map((g) => ({ url: g.url, alt: g.alt }))}
      />

      <PropertyGrid
        intro={home?.properties?.intro}
        cardLinkLabel={home?.properties?.cardLinkLabel}
        cta={home?.properties?.cta}
        emptyText={home?.properties?.emptyText}
        properties={(properties ?? []).map((p) => toPropertyCard(p, text?.properties))}
      />
    </>
  );
}
