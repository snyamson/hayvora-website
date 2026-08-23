import Image from "next/image";

import { buildMarqueeTrack } from "@/lib/marquee";

export type MarqueeClient = { name: string; logoUrl: string; website?: string };

/**
 * Infinitely scrolling band of client logos. The animation is pure CSS
 * (`.hv-marquee-track` in globals.css), so this stays a server component.
 *
 * Logos sit desaturated at rest and come up to full colour on hover, which stops seven
 * competing brand palettes from pulling attention away from the page's own.
 */
export function ClientMarquee({ clients, label = "Trusted by" }: { clients: MarqueeClient[]; label?: string }) {
  if (clients.length === 0) return null;

  const { track, half } = buildMarqueeTrack(clients, 8);

  return (
    <section className="section-sm relative">
      <p className="font-display mb-10 text-center text-xs font-bold tracking-[0.25em] text-brand-ink/40 uppercase">
        {label}
      </p>

      {/* Mask fades the track out at both ends instead of cutting it off mid-logo. */}
      <div className="hv-marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
        <div className="hv-marquee-track flex w-max items-center gap-5">
          {track.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              // The second half is a visual duplicate — hide it from screen readers so
              // the client list isn't announced twice.
              aria-hidden={i >= half}
              className="group flex h-28 w-56 shrink-0 items-center justify-center rounded-card border border-brand-line-soft bg-white p-6 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-1 hover:border-brand-line hover:shadow-lift sm:h-32 sm:w-64"
            >
              {/* max-h-full inside a fixed-height flex box lets each logo scale up to
                  fill the card rather than being capped at a fixed pixel height —
                  these files carry a lot of internal whitespace. */}
              <Image
                src={client.logoUrl}
                alt={i >= half ? "" : client.name}
                width={288}
                height={120}
                className="max-h-full w-auto max-w-full object-contain opacity-55 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
