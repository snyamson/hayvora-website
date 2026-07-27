"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";

export type HeroSlide = { type: "image"; imageUrl: string; alt?: string } | { type: "video"; videoUrl: string };

export function HeroCarousel({
  headline,
  subheadline,
  slides,
  ctaLabel,
  ctaHref,
}: {
  headline: string;
  subheadline?: string;
  slides: HeroSlide[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000 })]);
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

  const displaySlides: HeroSlide[] = slides.length > 0 ? slides : [{ type: "image", imageUrl: "" }];

  return (
    <div className="relative h-[85vh] min-h-[560px] w-full overflow-hidden bg-brand-secondary">
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {displaySlides.map((slide, i) => (
            <div key={i} className="relative h-full min-w-0 flex-[0_0_100%]">
              {slide.type === "video" ? (
                <video
                  src={slide.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : slide.imageUrl ? (
                <Image
                  src={slide.imageUrl}
                  alt={slide.alt ?? ""}
                  fill
                  priority={i === 0}
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-brand-secondary" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/70 via-brand-secondary/25 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl border-2 border-brand-highlight py-8 pr-6 pl-8 sm:py-10 sm:pr-10 sm:pl-12">
            <h1 className="font-display text-4xl leading-[0.95] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {headline}
            </h1>
            {subheadline && (
              <p className="font-display mt-5 max-w-xl text-lg font-bold italic text-brand-highlight sm:text-xl">
                {subheadline}
              </p>
            )}
          </div>
          {ctaLabel && ctaHref && (
            <div className="mt-10 pl-8 sm:pl-12">
              <Button href={ctaHref} variant="secondary">
                {ctaLabel}
              </Button>
            </div>
          )}
        </div>
      </div>

      {displaySlides.length > 1 && (
        <div className="absolute bottom-8 right-8 flex gap-2">
          {displaySlides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === selectedIndex ? "w-8 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
