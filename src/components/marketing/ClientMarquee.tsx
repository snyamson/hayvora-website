import Image from "next/image";

export type MarqueeClient = { name: string; logoUrl: string; website?: string };

/**
 * Infinitely scrolling band of client logos. The animation is pure CSS
 * (`.hv-marquee-track` in globals.css), so this stays a server component.
 */
export function ClientMarquee({ clients }: { clients: MarqueeClient[] }) {
  if (clients.length === 0) return null;

  // Repeat the source list until it's wide enough to span a large viewport, then lay
  // that down twice. The -50% keyframe only loops seamlessly if the track is exactly
  // two identical halves, so both steps matter.
  const filled = Array.from({ length: Math.ceil(8 / clients.length) }).flatMap(() => clients);
  const half = filled.length;
  const track = [...filled, ...filled];

  return (
    <section className="mt-16 border-y border-black/5 py-10 lg:mt-24">
      {/* mask fades the track out at both ends instead of cutting it off mid-logo */}
      <div className="hv-marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="hv-marquee-track flex w-max items-center gap-6">
          {track.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              // The second half is a visual duplicate — hide it from screen readers so
              // the client list isn't announced twice.
              aria-hidden={i >= half}
              className="flex h-32 w-64 shrink-0 items-center justify-center rounded-card border border-black/10 bg-white p-6 sm:h-36 sm:w-72"
            >
              {/* max-h-full inside a fixed-height flex box lets each logo scale up to
                  fill the card rather than being capped at a fixed pixel height —
                  these files carry a lot of internal whitespace. */}
              <Image
                src={client.logoUrl}
                alt={i >= half ? "" : client.name}
                width={288}
                height={120}
                className="max-h-full w-auto max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
