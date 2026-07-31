import Image from "next/image";
import Link from "next/link";

export type ProjectCard = {
  slug: string;
  title: string;
  location?: string;
  year?: number;
  imageUrl?: string;
  href: string;
};

export function ProjectGalleryGrid({ projects }: { projects: ProjectCard[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-brand-ink/60">
        Projects will appear here once they&apos;re published in the CMS.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => (
        <Link
          key={project.slug}
          href={project.href}
          className={`group relative block overflow-hidden rounded-card bg-brand-surface ${
            i % 5 === 0 ? "sm:col-span-2 sm:row-span-2" : ""
          }`}
        >
          <div className={`relative w-full ${i % 5 === 0 ? "aspect-square sm:aspect-[4/3]" : "aspect-[4/3]"}`}>
            {project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-brand-primary/20 to-brand-accent/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-lg font-semibold text-white">{project.title}</p>
            <p className="text-sm text-white/80">
              {[project.location, project.year].filter(Boolean).join(" · ")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
