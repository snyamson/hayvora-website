import { notFound } from "next/navigation";

import { safeFetch } from "../../../../sanity/lib/client";
import {
  BRAND_BY_SLUG_QUERY,
  DIVISION_PROFILE_BY_BRAND_QUERY,
  FEATURED_PROJECTS_BY_BRAND_QUERY,
} from "../../../../sanity/lib/queries";
import { NumberedAccordion } from "@/components/site/Accordion";
import { Chip, MixedHeading } from "@/components/site/Actions";
import {
  CentredOverview,
  ClientsAndZone,
  PageBanner,
  ProjectsGrid,
  ValuesGrid,
  VisionMission,
} from "@/components/site/division/DivisionSections";
import { getHeroSlides } from "@/lib/brandHelpers";
import { isSubsidiarySlug } from "@/lib/brands";
import { divisionHref, getDivisionPage, getSiteSettings } from "@/lib/content";
import { getProjectThumbnail, projectImageAlt } from "@/lib/projectHelpers";
import { buildMetadata } from "@/lib/seo";
import type { BrandDoc, DivisionProfileDoc, LinkDoc, ProjectDoc } from "@/types/sanity";
import { describe } from "@/lib/imageAlt";

const fetchBrand = (slug: string) =>
  safeFetch<BrandDoc>(BRAND_BY_SLUG_QUERY, { slug }, ["brand", `brand:${slug}`]);
const fetchProfile = (slug: string) =>
  safeFetch<DivisionProfileDoc>(DIVISION_PROFILE_BY_BRAND_QUERY, { slug }, ["divisionProfile", `divisionProfile:${slug}`]);

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) return {};
  const [brand, profile] = await Promise.all([fetchBrand(brandSlug), fetchProfile(brandSlug)]);
  return buildMetadata({
    title: [brand?.name, profile?.tagline ?? brand?.tagline].filter(Boolean).join(" — ") || undefined,
    description: profile?.overview?.[0] ?? brand?.shortDescription,
    path: `/${brandSlug}`,
    seo: brand?.seo,
  });
}

export default async function DivisionHomePage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  if (!isSubsidiarySlug(brandSlug)) notFound();

  const [brand, profile, projects, page, settings] = await Promise.all([
    fetchBrand(brandSlug),
    fetchProfile(brandSlug),
    safeFetch<ProjectDoc[]>(FEATURED_PROJECTS_BY_BRAND_QUERY, { slug: brandSlug }, ["project"]),
    getDivisionPage(),
    getSiteSettings(),
  ]);
  if (!brand) notFound();

  const local = (link?: LinkDoc) => (link ? { label: link.label, href: divisionHref(link.href, brandSlug) } : undefined);
  const still = getHeroSlides(brand).find((s) => s.type === "image");
  const divisionsNav = settings?.header?.navItems?.find((n) => n.opensDivisionsMenu);
  const crumbs = [
    ...(settings?.labels?.home ? [{ label: settings.labels.home, href: "/" }] : []),
    ...(divisionsNav?.label ? [{ label: divisionsNav.label, href: divisionsNav.href }] : []),
    { label: brand.name },
  ];

  return (
    <>
      <PageBanner
        crumbs={crumbs}
        crumbLabel={settings?.labels?.breadcrumb}
        eyebrow={profile?.legalName}
        heading={profile?.tagline ?? brand.hero?.headline}
        imageUrl={still?.type === "image" ? still.imageUrl : undefined}
        imageAlt={describe(still?.type === "image" ? still.alt : undefined, profile?.legalName ?? brand.name)}
      />

      <CentredOverview
        heading={brand.tagline}
        paragraphs={profile?.overview ?? (brand.shortDescription ? [brand.shortDescription] : [])}
        cta={local(page?.overviewCta)}
      />

      <VisionMission
        vision={profile?.vision}
        mission={profile?.mission}
        visionLabel={page?.visionLabel}
        missionLabel={page?.missionLabel}
      />

      {(profile?.services?.length ?? 0) > 0 && (
        <section className="px-3 pb-10 sm:px-6">
          <div className="mx-auto max-w-[1392px] rounded-[20px] bg-[var(--hv-tint)] px-5 py-[clamp(56px,7vw,96px)] sm:px-[clamp(20px,8vw,122px)]">
            <Chip>{page?.servicesEyebrow}</Chip>
            <div className="mt-6 grid items-end gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <MixedHeading heading={profile?.servicesHeading} emphasis={profile?.servicesHeadingEmphasis} />
              {profile?.servicesIntro && (
                <p className="m-0 text-lg leading-[26px] text-[var(--hv-blue)]">{profile.servicesIntro}</p>
              )}
            </div>
            <div className="mt-14">
              <NumberedAccordion
                closeLabel={settings?.labels?.close}
                items={profile!.services!.map((s, i) => ({
                  key: `${i}-${s.title}`,
                  title: s.title,
                  body: (
                    <div className="mt-3.5 grid gap-10 lg:grid-cols-2">
                      {s.description && <p className="text-lg leading-[26px] text-[var(--hv-blue)]">{s.description}</p>}
                      {(s.items?.length ?? 0) > 0 && (
                        <ul className="flex flex-col">
                          {s.items!.map((item, j) => (
                            <li key={item} className="flex items-baseline gap-3.5 border-b border-[#e3ece7] py-3 text-[17px] leading-6">
                              <span className="hv-mono text-xs text-[var(--hv-green)]">{String(j + 1).padStart(2, "0")}</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ),
                }))}
              />
            </div>
          </div>
        </section>
      )}

      <ValuesGrid intro={page?.valuesIntro} values={profile?.values ?? []} />

      <ClientsAndZone
        clientsIntro={page?.clientsIntro}
        clients={profile?.clients ?? []}
        zoneLabel={page?.zoneEyebrow}
        zone={profile?.operationalZone}
        zoneNote={profile?.operationalNote}
      />

      <ProjectsGrid
        heading={page?.projects?.heading}
        cta={local(page?.projects?.cta)}
        emptyText={page?.projects?.emptyText}
        projects={(projects ?? []).map((p) => ({
          href: `/${brandSlug}/projects/${p.slug.current}`,
          title: p.title,
          eyebrow: [p.category?.[0], p.location].filter(Boolean).join(" · "),
          meta: [p.client, p.duration].filter(Boolean).join(" · "),
          imageUrl: getProjectThumbnail(p, 800, 1100),
          imageAlt: projectImageAlt(p, p.coverImage?.alt, profile?.legalName ?? brand.name),
        }))}
      />
    </>
  );
}
