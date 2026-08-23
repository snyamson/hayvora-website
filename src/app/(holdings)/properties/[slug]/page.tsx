import Image from "next/image";
import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { PROPERTY_BY_SLUG_QUERY } from "../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../sanity/lib/image";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/Badge";
import { ClipReveal, Reveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { PageHero } from "@/components/layout/PageHero";
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
  const where = [property.location?.city, property.location?.region].filter(Boolean).join(", ");

  const specs = [
    property.specs?.bedrooms && { label: "Bedrooms", value: String(property.specs.bedrooms) },
    property.specs?.bathrooms && { label: "Bathrooms", value: String(property.specs.bathrooms) },
    property.specs?.sizeSqm && { label: "Floor area", value: `${property.specs.sizeSqm} sqm` },
    property.specs?.landSizeAcres && { label: "Land size", value: `${property.specs.landSizeAcres} acres` },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <PageHero
        art="crane"
        eyebrow={property.brand?.name ?? "Property"}
        title={property.title}
        description={where || undefined}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
        ]}
      />

      <section className="hv-aura-bg section relative">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-14">
            <div className="lg:col-span-2">
              {coverImage && (
                <ClipReveal className="relative aspect-[4/3] w-full overflow-hidden rounded-card shadow-lift">
                  <Image
                    src={urlFor(coverImage).width(1200).height(900).url()}
                    alt={property.title}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    loading="eager"
                    fetchPriority="high"
                    className="object-cover"
                  />
                </ClipReveal>
              )}

              <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-3">
                <StatusBadge status={property.status} />
                {where && <span className="text-sm text-brand-ink/60">{where}</span>}
              </Reveal>

              {specs.length > 0 && (
                <Stagger
                  as="dl"
                  gap={0.08}
                  className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-brand-line-soft py-8 sm:grid-cols-4"
                >
                  {specs.map((spec) => (
                    <StaggerItem key={spec.label} y={14}>
                      <dt className="font-display text-[0.6875rem] font-bold tracking-[0.15em] text-brand-ink/45 uppercase">
                        {spec.label}
                      </dt>
                      <dd className="font-display mt-2 text-xl font-semibold text-brand-ink">{spec.value}</dd>
                    </StaggerItem>
                  ))}
                </Stagger>
              )}

              {property.images && property.images.length > 1 && (
                <Stagger gap={0.06} className="mt-10 grid grid-cols-3 gap-3">
                  {property.images.slice(1).map((img, i) => (
                    <StaggerItem key={i} y={18}>
                      <div className="group relative aspect-square overflow-hidden rounded-card shadow-soft">
                        <Image
                          src={urlFor(img).width(400).height(400).url()}
                          alt=""
                          fill
                          sizes="20vw"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105"
                        />
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              )}

              <Reveal delay={0.1} className="mt-12">
                <PortableText value={property.description} />
              </Reveal>
            </div>

            {/* Enquiry rail. Sticks past the fixed header so the form stays reachable
                while reading a long listing. */}
            <div>
              <div className="sticky top-28">
                {property.status === "sold" ? (
                  <div className="rounded-card border border-brand-line-soft bg-white p-8 text-center shadow-soft">
                    <p className="font-display text-lg font-semibold text-brand-ink">This property has been sold.</p>
                    <p className="mt-2 text-sm text-brand-ink/65">
                      Browse current listings, or tell us what you&apos;re looking for.
                    </p>
                  </div>
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
          </div>
        </Container>
      </section>
    </>
  );
}
