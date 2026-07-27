import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../sanity/lib/client";
import { SERVICES_BY_BRAND_QUERY } from "../../../../../sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { isSubsidiarySlug } from "@/lib/brands";
import type { ServiceDoc } from "@/types/sanity";

export default async function SubsidiaryServicesPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const services = await safeFetch<ServiceDoc[]>(SERVICES_BY_BRAND_QUERY, { slug: brandSlug }, ["service"]);

  return (
    <section className="pt-40 pb-24">
      <Container>
        <SectionHeading eyebrow="What We Do" title="Services" />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services && services.length > 0 ? (
            services.map((service) => (
              <ServiceCard
                key={service.slug.current}
                title={service.title}
                shortDescription={service.shortDescription}
                href={`/${brandSlug}/services/${service.slug.current}`}
              />
            ))
          ) : (
            <p className="text-brand-ink/60">Services will appear here once they&apos;re published in the CMS.</p>
          )}
        </div>
      </Container>
    </section>
  );
}
