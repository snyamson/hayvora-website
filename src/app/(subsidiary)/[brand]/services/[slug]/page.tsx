import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../../sanity/lib/client";
import { SERVICE_BY_SLUG_QUERY } from "../../../../../../sanity/lib/queries";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Motion";
import { DIVISION_ART } from "@/components/ui/BlueprintArt";
import { PageHero } from "@/components/layout/PageHero";
import { PortableText } from "@/components/portable-text/PortableText";
import { isSubsidiarySlug } from "@/lib/brands";
import { FALLBACK_BRANDS } from "@/lib/fallbackContent";
import type { ServiceDoc } from "@/types/sanity";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ brand: string; slug: string }> }) {
  const { brand: brandSlug, slug } = await params;
  if (!isSubsidiarySlug(brandSlug)) return {};

  const service = await safeFetch<ServiceDoc>(SERVICE_BY_SLUG_QUERY, { slug }, ["service", `service:${slug}`]);
  if (!service) return { title: "Service not found" };

  return buildMetadata({
    title: service.title,
    description: service.shortDescription,
    path: `/${brandSlug}/services/${slug}`,
  });
}

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

  const brandName = FALLBACK_BRANDS[brandSlug]?.name ?? brandSlug;

  return (
    <>
      <PageHero
        art={DIVISION_ART[brandSlug]?.primary}
        secondaryArt={DIVISION_ART[brandSlug]?.secondary}
        eyebrow="Service"
        title={service.title}
        description={service.shortDescription}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: brandName, href: `/${brandSlug}` },
          { label: "Services", href: `/${brandSlug}/services` },
        ]}
      />

      <section className="hv-aura-bg section relative">
        <Container className="max-w-3xl">
          <Reveal>
            <PortableText value={service.description} />
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-14 flex flex-wrap items-center gap-4 rounded-card border border-brand-line-soft bg-white p-8 shadow-soft">
              <div className="flex-1">
                <p className="font-display text-lg font-semibold tracking-tight text-brand-ink">
                  Need this on a project?
                </p>
                <p className="mt-1.5 text-sm text-brand-ink/65">
                  Tell us the scope and we&apos;ll come back with an approach and a timeline.
                </p>
              </div>
              <Button href={`/${brandSlug}/contact`} variant="secondary" withArrow>
                Talk to {brandName}
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
