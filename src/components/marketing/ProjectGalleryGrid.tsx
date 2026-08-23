import { Card, CardChip, CardMedia } from "@/components/ui/Card";
import { Stagger, StaggerItem } from "@/components/ui/Motion";

export type ProjectCard = {
  slug: string;
  title: string;
  location?: string;
  year?: number;
  imageUrl?: string;
  href: string;
};

/**
 * Project grid. Every fifth tile is promoted to a 2x2 feature so the grid has rhythm
 * instead of reading as a uniform contact sheet, and the whole set staggers in on
 * scroll.
 */
export function ProjectGalleryGrid({ projects }: { projects: ProjectCard[] }) {
  if (projects.length === 0) {
    return <p className="text-brand-ink/55">Projects will appear here once they&apos;re published in the CMS.</p>;
  }

  return (
    <Stagger gap={0.07} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => {
        const feature = i % 5 === 0;
        const meta = [project.location, project.year].filter(Boolean).join(" · ");

        return (
          <StaggerItem key={project.slug} y={26} className={feature ? "sm:col-span-2 sm:row-span-2" : ""}>
            <Card href={project.href} className="h-full">
              <CardMedia
                src={project.imageUrl}
                alt={project.title}
                aspect={feature ? "aspect-square sm:aspect-[4/3]" : "aspect-[4/3]"}
                sizes={feature ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
              >
                <div className="absolute inset-x-0 bottom-0 p-6">
                  {meta && (
                    <div className="mb-3 translate-y-1 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:translate-y-0 group-hover:opacity-100">
                      <CardChip>{meta}</CardChip>
                    </div>
                  )}
                  <p
                    className={`font-display font-semibold tracking-tight text-white ${
                      feature ? "text-2xl sm:text-3xl" : "text-lg"
                    }`}
                  >
                    {project.title}
                  </p>
                </div>
              </CardMedia>
            </Card>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
