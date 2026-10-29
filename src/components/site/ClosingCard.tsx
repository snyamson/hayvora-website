/* eslint-disable @next/next/no-img-element */
import type { LinkDoc } from "@/types/sanity";
import { Chip, PillLink } from "./Actions";

/** EllisDon's closing photo card: chip, big bold line, short text, two pills. */
export function ClosingCard({
  eyebrow,
  heading,
  body,
  primary,
  secondary,
  imageUrl,
  imageAlt = "",
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  primary?: LinkDoc;
  secondary?: LinkDoc;
  imageUrl?: string;
  /** What the photo shows; empty only for decoration. */
  imageAlt?: string;
}) {
  if (!heading) return null;
  return (
    <section className="px-3 pt-20 sm:px-6">
      <div className="relative mx-auto flex min-h-[520px] max-w-[1392px] items-center overflow-hidden rounded-[20px] bg-[#0b1f16] text-white">
        {imageUrl && <img src={imageUrl} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-[rgb(6_14_10/0.55)]" />
        <div className="relative px-6 py-20 sm:px-[clamp(24px,8vw,114px)] sm:py-24">
          <Chip>{eyebrow}</Chip>
          <h2 className="mt-6 max-w-[1000px] text-[clamp(44px,5vw,72px)] leading-none font-bold tracking-[-0.04em]">
            {heading}
          </h2>
          {body && <p className="mt-7 max-w-[720px] text-[22px] leading-[30.8px]">{body}</p>}
          <div className="mt-10 flex flex-wrap gap-3">
            <PillLink link={primary} />
            <PillLink link={secondary} variant="ghost" arrow={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
