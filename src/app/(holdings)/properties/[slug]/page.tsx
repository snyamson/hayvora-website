import Image from "next/image";
import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { PROPERTY_BY_SLUG_QUERY } from "../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../sanity/lib/image";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/Badge";
import { PortableText } from "@/components/portable-text/PortableText";
import { InquiryForm } from "@/components/marketing/InquiryForm";
import type { PropertyDoc } from "@/types/sanity";
import { buildMetadata, ogImageUrl } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await safeFetch<PropertyDoc>(PROPERTY_BY_SLUG_QUERY, { slug }, ["property", `property:${slug}`]);
  if (!property) return { title: "Property not found" };

  const where = [property.location?.city, property.location?.region].filter(Boolean).join(", ");

  return buildMetadata({
    title: where ? `${property.title} — ${where}` : property.title,
    description: `${property.title}${where ? ` in ${where}` : ""}. ${
      property.status === "available" ? "Currently available" : `Status: ${property.status}`
    } through Hayvora Holdings.`,
    path: `/properties/${slug}`,
    image: ogImageUrl(property.images?.[0]),
    type: "article",
  });
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await safeFetch<PropertyDoc & { description?: unknown }>(
    PROPERTY_BY_SLUG_QUERY,
    { slug },
    ["property", `property:${slug}`],
  );

  if (!property) notFound();

  const coverImage = property.images?.[0];

  return (
    <section className="pt-40 pb-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {coverImage && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card">
              <Image src={urlFor(coverImage).width(1200).height(900).url()} alt={property.title} fill className="object-cover" />
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <StatusBadge status={property.status} />
            {property.brand?.name && (
              <span className="rounded-full bg-brand-surface px-3 py-1 text-xs font-semibold uppercase text-brand-ink">
                {property.brand.name}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand-ink">{property.title}</h1>
          <p className="mt-2 text-brand-ink/60">
            {[property.location?.city, property.location?.region].filter(Boolean).join(", ")}
          </p>

          {property.specs && (
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-brand-ink/70">
              {property.specs.bedrooms && <span>{property.specs.bedrooms} Bedrooms</span>}
              {property.specs.bathrooms && <span>{property.specs.bathrooms} Bathrooms</span>}
              {property.specs.sizeSqm && <span>{property.specs.sizeSqm} sqm</span>}
              {property.specs.landSizeAcres && <span>{property.specs.landSizeAcres} acres</span>}
            </div>
          )}

          {property.images && property.images.length > 1 && (
            <div className="mt-8 grid grid-cols-3 gap-3">
              {property.images.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-card">
                  <Image src={urlFor(img).width(400).height(400).url()} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-10">
            <PortableText value={property.description} />
          </div>
        </div>

        <div>
          <div className="sticky top-32 rounded-card border border-black/5 bg-white p-6 shadow-sm">
            {property.status === "sold" ? (
              <p className="text-brand-ink/70">This property has been sold.</p>
            ) : (
              <InquiryForm
                kind="property_viewing"
                propertyId={property._id}
                propertyTitle={property.title}
                brandId={property.brand?._id}
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
