"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { StatusBadge } from "@/components/ui/Badge";

export type CarouselProperty = {
  slug: string;
  title: string;
  imageUrl?: string;
  location?: string;
  status: "available" | "reserved" | "sold";
};

export function PropertiesCarousel({ properties }: { properties: CarouselProperty[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (properties.length === 0) {
    return <p className="text-brand-ink/60">New listings will appear here soon.</p>;
  }

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-6 flex">
          {properties.map((property) => (
            <Link
              key={property.slug}
              href={`/properties/${property.slug}`}
              className="group relative block min-w-0 flex-[0_0_85%] pl-6 sm:flex-[0_0_60%] lg:flex-[0_0_42%]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {property.imageUrl ? (
                  <Image
                    src={property.imageUrl}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-white/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-brand-primary/20 to-transparent" />

                <div className="absolute top-4 left-4">
                  <StatusBadge status={property.status} />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display text-xl font-bold text-white sm:text-2xl">{property.title}</p>
                  {property.location && <p className="mt-1 text-sm text-white/80">{property.location}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {properties.length > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {properties.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === selectedIndex ? "w-8 bg-brand-accent" : "w-1.5 bg-brand-accent/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
