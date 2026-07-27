import Image from "next/image";
import { notFound } from "next/navigation";

import { safeFetch } from "../../../../../../sanity/lib/client";
import { PROJECT_BY_SLUG_QUERY } from "../../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../../sanity/lib/image";
import { Container } from "@/components/ui/Container";
import { PortableText } from "@/components/portable-text/PortableText";
import { isSubsidiarySlug } from "@/lib/brands";
import type { ProjectDoc } from "@/types/sanity";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ brand: string; slug: string }>;
}) {
  const { brand: brandSlug, slug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const project = await safeFetch<ProjectDoc & { description?: unknown; gallery?: { asset?: unknown }[] }>(
    PROJECT_BY_SLUG_QUERY,
    { slug },
    ["project", `project:${slug}`],
  );

  if (!project) notFound();

  return (
    <section className="pt-40 pb-24">
      <Container className="max-w-4xl">
        {project.coverImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
            <Image
              src={urlFor(project.coverImage).width(1600).height(900).url()}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <p className="mt-8 text-sm font-medium tracking-wide text-brand-secondary uppercase">
          {[project.location, project.year].filter(Boolean).join(" · ")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-ink">{project.title}</h1>
        {project.summary && <p className="mt-4 text-brand-ink/70">{project.summary}</p>}

        <div className="mt-8">
          <PortableText value={project.description} />
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {project.gallery.map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                <Image src={urlFor(img).width(500).height(500).url()} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
