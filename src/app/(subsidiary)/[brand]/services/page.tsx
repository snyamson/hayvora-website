import Link from "next/link";
import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { BRAND_BY_SLUG_QUERY, SERVICES_BY_BRAND_QUERY } from "../../../../../sanity/lib/queries";
import { PageBanner } from "@/components/site/division/DivisionSections";
import { LongArrow } from "@/components/site/Icons";
import { isSubsidiarySlug } from "@/lib/brands";
import { divisionOwner, fill, getPageText } from "@/lib/content";
import { bannerImage, crumbsFor, divisionPageMetadata } from "@/lib/pageContext";
import type { BrandDoc, ServiceDoc } from "@/types/sanity";
import { describe } from "@/lib/imageAlt";

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  return divisionPageMetadata(brand, "/services", (text) => text?.services?.title);
}

export default async function SubsidiaryServicesPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const [brand, services, text] = await Promise.all([
    safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug: brandSlug }, ["brand", `brand:${brandSlug}`]),
    safeFetch<ServiceDoc[]>(SERVICES_BY_BRAND_QUERY, { slug: brandSlug }, ["service"]),
    getPageText(),
  ]);
  if (!brand) notFound();
  const t = text?.services;
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
        imageAlt={describe(undefined, await divisionOwner(brandSlug, brand.name))}
      />

      <section className="py-24">
        <div className="hv-wrap">
          {(services?.length ?? 0) === 0 ? (
            <p className="rounded-[20px] bg-[var(--hv-tint)] p-12 text-center text-lg text-[var(--hv-muted)]">{t?.emptyText}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
              {services!.map((service, i) => (
                <Link
                  key={service.slug.current}
                  href={`/${brandSlug}/services/${service.slug.current}`}
                  className="group border-t border-[var(--hv-line)] px-9 pt-10 pb-12 transition-colors duration-300 hover:bg-[#f4f7f5]"
                >
                  <span className="hv-mono text-xs text-[var(--hv-green)]">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="mt-4 text-[26px] leading-[1.1] text-[#17171b] transition-colors group-hover:text-[var(--hv-green)]">
                    {service.title}
                  </h2>
                  {service.shortDescription && (
                    <p className="mt-4 text-[17px] leading-[26px] text-[#3b484d]">{service.shortDescription}</p>
                  )}
                  {t?.learnMoreLabel && (
                    <span className="hv-tlink mt-8 group-hover:text-[var(--hv-ink)]">
                      {t.learnMoreLabel}
                      <LongArrow className="group-hover:animate-[hv-tnudge_1s_ease-in-out_infinite]" />
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
