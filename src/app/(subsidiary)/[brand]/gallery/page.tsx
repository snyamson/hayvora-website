import Image from "next/image";
import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { GALLERY_IMAGES_BY_BRAND_QUERY } from "../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../sanity/lib/image";
import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { DIVISION_ART } from "@/components/ui/BlueprintArt";
import { PageHero } from "@/components/layout/PageHero";
import { isSubsidiarySlug } from "@/lib/brands";
import { FALLBACK_BRANDS } from "@/lib/fallbackContent";
import type { SanityImage } from "@/types/sanity";

type GalleryGroup = { title: string; images?: SanityImage[] };

export default async function SubsidiaryGalleryPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const groups = await safeFetch<GalleryGroup[]>(GALLERY_IMAGES_BY_BRAND_QUERY, { slug: brandSlug }, ["project"]);
  const images = (groups ?? []).flatMap((g) => g.images ?? []);
  const brandName = FALLBACK_BRANDS[brandSlug]?.name ?? brandSlug;

  return (
    <>
      <PageHero
        art={DIVISION_ART[brandSlug]?.primary}
        secondaryArt={DIVISION_ART[brandSlug]?.secondary}
        eyebrow="Gallery"
        title="Project Gallery"
        description={`Photography from ${brandName} sites and completed work.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: brandName, href: `/${brandSlug}` },
        ]}
      />

      <section className="hv-aura-bg section relative">
        <Container>
          {images.length > 0 ? (
            // Masonry via CSS columns — the source images are mixed portrait and
            // landscape, and a fixed grid would crop most of them badly.
            <Stagger gap={0.05} className="columns-2 gap-4 sm:columns-3">
              {images.map((img, i) => (
                <StaggerItem key={i} y={20} className="mb-4 break-inside-avoid">
                  <div className="group relative aspect-square w-full overflow-hidden rounded-card shadow-soft">
                    <Image
                      src={urlFor(img).width(600).height(600).url()}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-brand-primary/20 transition-opacity duration-500 group-hover:opacity-0" />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className="text-brand-ink/55">Gallery images will appear here once projects are published.</p>
          )}
        </Container>
      </section>
    </>
  );
}
