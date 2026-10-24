import Image from "next/image";
import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY, GALLERY_IMAGES_BY_BRAND_QUERY } from "../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../sanity/lib/image";
import { PageBanner } from "@/components/site/division/DivisionSections";
import { isSubsidiarySlug } from "@/lib/brands";
import { fill, getPageText } from "@/lib/content";
import { bannerImage, crumbsFor, divisionPageMetadata } from "@/lib/pageContext";
import type { BrandDoc, SanityImage } from "@/types/sanity";

type GalleryGroup = { title: string; coverImage?: SanityImage; images?: (SanityImage & { alt?: string })[] };

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  return divisionPageMetadata(brand, "/gallery", (text) => text?.gallery?.title);
}

export default async function SubsidiaryGalleryPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const [brand, groups, text] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]),
    safeFetch<GalleryGroup[]>(GALLERY_IMAGES_BY_BRAND_QUERY, { slug: brandSlug }, ["project"]),
    getPageText(),
  ]);
  if (!brand) notFound();
  const t = text?.gallery;
  // A project without its own gallery photos still shows its cover.
  const images = (groups ?? []).flatMap((g) => {
    const own = (g.images ?? []).filter((img) => img?.asset);
    const list = own.length > 0 ? own : g.coverImage?.asset ? [g.coverImage as SanityImage & { alt?: string }] : [];
    return list.map((img) => ({ img, alt: img.alt ?? g.title ?? t?.imageAlt }));
  });
  const { crumbs, crumbLabel } = await crumbsFor([
    { label: brand.name, href: `/${brandSlug}` },
    { label: t?.title ?? "" },
  ]);

  return (
    <>
      <PageBanner
        short
        crumbs={crumbs}
        crumbLabel={crumbLabel}
        eyebrow={t?.eyebrow}
        heading={t?.title}
        description={fill(t?.description, { division: brand.name })}
        imageUrl={bannerImage(brand)}
      />

      <section className="py-24">
        <div className="hv-wrap">
          {images.length === 0 ? (
            <p className="rounded-[20px] bg-[var(--hv-tint)] p-12 text-center text-lg text-[var(--hv-muted)]">{t?.emptyText}</p>
          ) : (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
              {images.map(({ img, alt }, i) => (
                <div key={i} className="hv-zoom relative aspect-[4/3]">
                  <Image
                    src={urlFor(img).width(800).height(600).url()}
                    alt={alt ?? ""}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
