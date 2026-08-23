import { StatusBadge } from "@/components/ui/Badge";
import { Card, CardMedia } from "@/components/ui/Card";
import { Carousel } from "@/components/ui/Carousel";

export type CarouselProperty = {
  slug: string;
  title: string;
  imageUrl?: string;
  location?: string;
  status: "available" | "reserved" | "sold";
};

/**
 * Latest listings as a draggable carousel. A server component: the interactive parts
 * live inside `<Carousel>`, and these cards are passed to it as children, so the
 * property markup never ships to the browser as client JavaScript.
 */
export function PropertiesCarousel({ properties }: { properties: CarouselProperty[] }) {
  if (properties.length === 0) {
    return <p className="text-brand-ink/55">New listings will appear here soon.</p>;
  }

  return (
    <Carousel
      label="Available properties"
      autoplay
      slideClassName="flex-[0_0_85%] sm:flex-[0_0_55%] lg:flex-[0_0_38%]"
    >
      {properties.map((property) => (
        <Card key={property.slug} href={`/properties/${property.slug}`} className="h-full">
          <CardMedia
            src={property.imageUrl}
            alt={property.title}
            aspect="aspect-[4/3]"
            sizes="(min-width: 1024px) 38vw, (min-width: 640px) 55vw, 85vw"
            grayscale={property.status === "sold"}
          >
            <div className="absolute top-4 left-4">
              <StatusBadge status={property.status} />
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {property.title}
              </p>
              {property.location && (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/80">
                  <PinIcon />
                  {property.location}
                </p>
              )}
            </div>
          </CardMedia>
        </Card>
      ))}
    </Carousel>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
      <path
        d="M8 14s5-4.35 5-8A5 5 0 0 0 3 6c0 3.65 5 8 5 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
