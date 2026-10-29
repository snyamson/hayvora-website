import Image from "next/image";
import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { PROPERTY_BY_SLUG_QUERY } from "../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../sanity/lib/image";
import { PageBanner } from "@/components/site/division/DivisionSections";
import { Reveal } from "@/components/ui/Motion";
import { PortableText } from "@/components/portable-text/PortableText";
import { InquiryForm } from "@/components/marketing/InquiryForm";
import { fill, getPageText } from "@/lib/content";
import { crumbsFor } from "@/lib/pageContext";
import { statusLabel } from "@/lib/propertyCards";
import { buildMetadata, ogImageUrl } from "@/lib/seo";
import type { PropertyDoc } from "@/types/sanity";
import { describe } from "@/lib/imageAlt";

const fetchProperty = (slug: string) =>
  safeFetch<PropertyDoc & { description?: unknown }>(PROPERTY_BY_SLUG_QUERY, { slug }, ["property", `property:${slug}`]);

const STATUS_STYLE: Record<PropertyDoc["status"], string> = {
  available: "bg-[var(--hv-green-faded)] text-[var(--hv-green-dark)]",
  reserved: "bg-[#fdecc8] text-[#7a4a00]",
  sold: "bg-[#e5e7eb] text-[#374151]",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [property, text] = await Promise.all([fetchProperty(slug), getPageText()]);
  const t = text?.properties;
  if (!property) return { title: t?.notFoundTitle };

  const where = [property.location?.city, property.location?.region].filter(Boolean).join(", ");
  return buildMetadata({
    title: [property.title, where].filter(Boolean).join(" — "),
    description: fill(t?.detailDescription, {
      property: property.title,
      place: where,
      status: statusLabel(property.status, t),
    }),
    path: `/properties/${slug}`,
    image: ogImageUrl(property.images?.[0]),
    type: "article",
  });
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [property, text] = await Promise.all([fetchProperty(slug), getPageText()]);
  if (!property) notFound();

  const t = text?.properties;
  const where = [property.location?.city, property.location?.region].filter(Boolean).join(", ");
  const cover = property.images?.[0];
  const s = property.specs;
  const specs = [
    s?.bedrooms && { label: t?.bedroomsLabel, value: String(s.bedrooms) },
    s?.bathrooms && { label: t?.bathroomsLabel, value: String(s.bathrooms) },
    s?.sizeSqm && { label: t?.floorAreaLabel, value: [s.sizeSqm, t?.areaUnit].filter(Boolean).join(" ") },
    s?.landSizeAcres && { label: t?.landSizeLabel, value: [s.landSizeAcres, t?.landUnit].filter(Boolean).join(" ") },
  ].filter(Boolean) as { label?: string; value: string }[];
  const { crumbs, crumbLabel } = await crumbsFor([
    { label: t?.eyebrow ?? "", href: "/properties" },
    { label: property.title },
  ]);

  return (
    <>
      <PageBanner
        short
        crumbs={crumbs}
        crumbLabel={crumbLabel}
        eyebrow={property.brand?.name}
        heading={property.title}
        description={where || undefined}
        imageUrl={cover?.asset ? urlFor(cover).width(1920).url() : undefined}
        imageAlt={describe(cover?.alt, property.title, where, property.brand?.legalName ?? property.brand?.name)}
      />

      <section className="py-24">
        <div className="hv-wrap grid gap-12 lg:grid-cols-3 lg:gap-14">
          <div className="lg:col-span-2">
            {cover?.asset && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                <Image
                  src={urlFor(cover).width(1200).height(900).url()}
                  alt={describe(cover?.alt, property.title, where, property.brand?.legalName ?? property.brand?.name)}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  loading="eager"
                  className="object-cover"
                />
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className={`hv-mono inline-flex rounded-full px-2.5 py-1 text-xs tracking-[0.06em] ${STATUS_STYLE[property.status]}`}>
                {statusLabel(property.status, t)}
              </span>
              {where && <span className="text-sm text-[var(--hv-muted)]">{where}</span>}
            </div>

            {specs.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-[var(--hv-line)] py-8 sm:grid-cols-4">
                {specs.map((spec) => (
                  <div key={spec.value + spec.label}>
                    <dt className="hv-mono text-xs tracking-[0.06em] text-[var(--hv-muted)]">{spec.label}</dt>
                    <dd className="mt-2 text-2xl text-[var(--hv-blue)]">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {property.images && property.images.length > 1 && (
              <div className="mt-10 grid grid-cols-3 gap-3">
                {property.images.slice(1).map((img, i) => (
                  <div key={i} className="hv-zoom relative aspect-square">
                    <Image src={urlFor(img).width(400).height(400).url()} alt={describe(img.alt, property.title, where, property.brand?.legalName ?? property.brand?.name)} fill sizes="20vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            <Reveal delay={0.1} className="mt-12">
              <PortableText value={property.description} />
            </Reveal>
          </div>

          {/* Enquiry rail. Sticks below the fixed header so the form stays in reach. */}
          <div>
            <div className="sticky top-32">
              {property.status === "sold" ? (
                <div className="rounded-[20px] bg-[var(--hv-tint)] p-8 text-center">
                  <p className="text-lg font-semibold text-[var(--hv-blue)]">{t?.soldNoticeTitle}</p>
                  <p className="mt-2 text-sm text-[var(--hv-muted)]">{t?.soldNoticeBody}</p>
                </div>
              ) : (
                <InquiryForm
                  kind="property_viewing"
                  propertyId={property._id}
                  propertyTitle={property.title}
                  brandId={property.brand?._id}
                  copy={text?.form ?? {}}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
