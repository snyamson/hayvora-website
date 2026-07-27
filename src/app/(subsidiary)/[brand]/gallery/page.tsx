import Image from "next/image";
import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { GALLERY_IMAGES_BY_BRAND_QUERY } from "../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../sanity/lib/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isSubsidiarySlug } from "@/lib/brands";
import type { SanityImage } from "@/types/sanity";

type GalleryGroup = { title: string; images?: SanityImage[] };

export default async function SubsidiaryGalleryPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const groups = await safeFetch<GalleryGroup[]>(GALLERY_IMAGES_BY_BRAND_QUERY, { slug: brandSlug }, ["project"]);
  const images = (groups ?? []).flatMap((g) => g.images ?? []);

  return (
    <section className="pt-40 pb-24">
      <Container>
        <SectionHeading eyebrow="Gallery" title="Project Gallery" />
        {images.length > 0 ? (
          <div className="mt-10 columns-2 gap-4 sm:columns-3">
            {images.map((img, i) => (
              <div key={i} className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg break-inside-avoid">
                <Image src={urlFor(img).width(600).height(600).url()} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-brand-ink/60">Gallery images will appear here once projects are published.</p>
        )}
      </Container>
    </section>
  );
}
