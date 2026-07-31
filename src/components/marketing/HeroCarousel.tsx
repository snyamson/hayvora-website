"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";

export type HeroSlide = { type: "image"; imageUrl: string; alt?: string } | { type: "video"; videoUrl: string };

export function HeroCarousel({
  headline,
  slides,
  ctaLabel,
  ctaHref,
}: {
  headline: string;
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
        {/* Top padding on a vertically centred block pushes the copy down, opening up
            breathing room above the headline. */}
        <div className="mx-auto w-full max-w-7xl px-6 pt-32 sm:pt-36 lg:px-8 lg:pt-40">
          {/* Semibold, not bold: Montserrat's 700 is a very heavy cut and turns into a
              slab of black at hero sizes. 600 keeps the presence without the weight. */}
          <h1 className="font-display max-w-4xl text-4xl leading-[1] font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {headline}
          </h1>
          {ctaLabel && ctaHref && (
            <div className="mt-10">
              <Button href={ctaHref} variant="secondary">
                {ctaLabel}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Dots sit left, lifted on mobile, so the bottom-right statement card never covers them. */}
      {displaySlides.length > 1 && (
        <div className="absolute bottom-20 left-6 flex gap-2 sm:bottom-8 sm:left-8">
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
