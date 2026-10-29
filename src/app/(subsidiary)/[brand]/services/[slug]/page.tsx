import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY, SERVICE_BY_SLUG_QUERY } from "../../../../../../sanity/lib/queries";
import { PillLink } from "@/components/site/Actions";
import { PageBanner } from "@/components/site/division/DivisionSections";
import { Reveal } from "@/components/ui/Motion";
import { PortableText } from "@/components/portable-text/PortableText";
import { isSubsidiarySlug } from "@/lib/brands";
import { divisionHref, divisionOwner, fill, getPageText, getSiteSettings } from "@/lib/content";
import { bannerImage, crumbsFor } from "@/lib/pageContext";
import { buildMetadata } from "@/lib/seo";
import type { BrandDoc, ServiceDoc } from "@/types/sanity";
import { describe } from "@/lib/imageAlt";

const fetchService = (slug: string) =>
  safeFetch<ServiceDoc & { description?: unknown }>(SERVICE_BY_SLUG_QUERY, { slug }, ["service", `service:${slug}`]);

export async function generateMetadata({ params }: { params: Promise<{ brand: string; slug: string }> }) {
  const { brand: brandSlug, slug } = await params;
  if (!isSubsidiarySlug(brandSlug)) return {};
  const [service, text] = await Promise.all([fetchService(slug), getPageText()]);
  if (!service) return { title: text?.services?.notFoundTitle };

  return buildMetadata({
    title: service.title,
    description: service.shortDescription,
    path: `/${brandSlug}/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ brand: string; slug: string }> }) {
  const { brand: brandSlug, slug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const [service, brand, text, settings] = await Promise.all([
    fetchService(slug),
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]),
    getPageText(),
    getSiteSettings(),
  ]);
  if (!service || !brand) notFound();
  const t = text?.services;
  const { crumbs, crumbLabel } = await crumbsFor([
    { label: brand.name, href: `/${brandSlug}` },
    { label: t?.title ?? "", href: `/${brandSlug}/services` },
    { label: service.title },
  ]);

  return (
    <>
      <PageBanner
        short
        crumbs={crumbs}
        crumbLabel={crumbLabel}
        eyebrow={t?.detailEyebrow}
        heading={service.title}
        description={service.shortDescription}
        imageUrl={bannerImage(brand)}
        imageAlt={describe(undefined, await divisionOwner(brandSlug, brand.name))}
      />

      <section className="py-24">
        <div className="mx-auto max-w-[810px] px-5 sm:px-10">
          <Reveal>
            <PortableText value={service.description} />
          </Reveal>

          {t?.ctaHeading && (
            <div className="mt-14 flex flex-wrap items-center gap-6 rounded-[20px] bg-[var(--hv-blue)] p-8 text-white sm:p-10">
              <div className="flex-1">
                <p className="text-2xl font-bold tracking-[-0.03em]">{t.ctaHeading}</p>
                {t.ctaBody && <p className="mt-2 text-base text-white/85">{t.ctaBody}</p>}
              </div>
              <PillLink
                link={{
                  label: fill(t.ctaLabel, { division: brand.name }),
                  href: divisionHref(settings?.header?.cta?.href, brandSlug),
                }}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
