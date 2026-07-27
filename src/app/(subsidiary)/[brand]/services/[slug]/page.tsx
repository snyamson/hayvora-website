import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../../sanity/lib/client";
import { SERVICE_BY_SLUG_QUERY } from "../../../../../../sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { PortableText } from "@/components/portable-text/PortableText";
import { isSubsidiarySlug } from "@/lib/brands";
import type { ServiceDoc } from "@/types/sanity";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ brand: string; slug: string }>;
}) {
  const { brand: brandSlug, slug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const service = await safeFetch<ServiceDoc & { description?: unknown }>(
    SERVICE_BY_SLUG_QUERY,
    { slug },
    ["service", `service:${slug}`],
  );

  if (!service) notFound();

  return (
    <section className="pt-40 pb-24">
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-brand-ink">{service.title}</h1>
        {service.shortDescription && <p className="mt-4 text-brand-ink/70">{service.shortDescription}</p>}
        <div className="mt-8">
          <PortableText value={service.description} />
        </div>
      </Container>
    </section>
  );
}
