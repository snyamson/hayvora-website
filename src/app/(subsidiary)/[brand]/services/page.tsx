import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { SERVICES_BY_BRAND_QUERY } from "../../../../../sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { DIVISION_ART } from "@/components/ui/BlueprintArt";
import { PageHero } from "@/components/layout/PageHero";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { isSubsidiarySlug } from "@/lib/brands";
import { FALLBACK_BRANDS } from "@/lib/fallbackContent";
import type { ServiceDoc } from "@/types/sanity";

export default async function SubsidiaryServicesPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const services = await safeFetch<ServiceDoc[]>(SERVICES_BY_BRAND_QUERY, { slug: brandSlug }, ["service"]);
  const brandName = FALLBACK_BRANDS[brandSlug]?.name ?? brandSlug;

  return (
    <>
      <PageHero
        art={DIVISION_ART[brandSlug]?.primary}
        secondaryArt={DIVISION_ART[brandSlug]?.secondary}
        eyebrow="What We Do"
        title="Services"
        description={`The work ${brandName} takes on, and what each engagement covers.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: brandName, href: `/${brandSlug}` },
        ]}
      />

      <section className="hv-aura-bg section relative">
        <Container>
          {services && services.length > 0 ? (
            <Stagger gap={0.07} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <StaggerItem key={service.slug.current} y={26}>
                  <ServiceCard
                    title={service.title}
                    shortDescription={service.shortDescription}
                    href={`/${brandSlug}/services/${service.slug.current}`}
                    index={i}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className="text-brand-ink/55">Services will appear here once they&apos;re published in the CMS.</p>
          )}
        </Container>
      </section>
    </>
  );
}
