import Image from "next/image";

/**
 * The Hayvora logo — the single source for brand identity across the whole site.
 *
 * Every page (Holdings *and* every subsidiary) renders this exact component in the
 * header and footer, so the mark never changes as visitors move between divisions.
 * Subsidiaries deliberately do not get their own logo here: they're divisions of one
 * company, and swapping the mark per route made the site feel like four separate
 * websites stitched together.
 *
 * Assets are cropped, transparent-background derivatives of `hayvora_logo.svg`
 * (kept in the repo as the original). The source file baked in a white square plus
 * ~740 anti-aliasing halo paths sized for a white ground, which made it 451 KB and
 * unusable on anything but white — and illegible at header size, since the artwork
 * sat inside a lot of empty padding. These are the same vectors, tightly cropped:
 *
 *   hayvora-mark.svg      841 x 834   the two-tone "H" monogram      24 KB
 *   hayvora-wordmark.svg  1253 x 311  "HAYVORA" + LIMITED rule      109 KB
 *   hayvora-logo.svg      1253 x 1258 the stacked lockup            133 KB
 *
 * Each has a `-reversed` twin drawn entirely in white, for dark grounds — the green
 * would sit at poor contrast on the deep green, and lightening it would introduce a colour
 * that isn't in the brand palette.
 */

type Tone = "color" | "reversed";

/** Intrinsic aspect ratios, taken from each asset's viewBox. Passed to next/image so
 *  the browser reserves the right box and the header never shifts on load. */
const MARK = { w: 841, h: 834 };
const WORDMARK = { w: 1253, h: 311 };
const STACKED = { w: 1253, h: 1258 };

/**
 * Horizontal lockup: monogram beside the wordmark. Used in the header, where vertical
 * space is tight and a stacked logo would shrink the wordmark past legibility.
 */
export function Logo({
  tone = "color",
  className = "",
  markClassName = "h-9 w-auto sm:h-10",
  wordmarkClassName = "hidden h-5 w-auto sm:block",
}: {
  tone?: Tone;
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  const suffix = tone === "reversed" ? "-reversed" : "";

  return (
    // One accessible name for the pair; the images themselves are decorative so a
    // screen reader announces "Hayvora Holdings Limited" once, not twice.
    <span className={`inline-flex items-center gap-2.5 ${className}`} role="img" aria-label="Hayvora Holdings Limited">
      <Image
        src={`/hayvora-mark${suffix}.svg`}
        alt=""
        width={MARK.w}
        height={MARK.h}
        className={markClassName}
      />
      <Image
        src={`/hayvora-wordmark${suffix}.svg`}
        alt=""
        width={WORDMARK.w}
        height={WORDMARK.h}
        className={wordmarkClassName}
      />
    </span>
  );
}

/** Stacked lockup — monogram over wordmark. Used where there's room to let it breathe. */
export function LogoStacked({
  tone = "color",
  className = "h-24 w-auto",
}: {
  tone?: Tone;
  className?: string;
}) {
  return (
    <Image
      src={`/hayvora-logo${tone === "reversed" ? "-reversed" : ""}.svg`}
      alt="Hayvora Holdings Limited"
      width={STACKED.w}
      height={STACKED.h}
      className={className}
    />
  );
}

/** Monogram on its own — for tight spots (favicons, badges, the back-to-top control). */
export function LogoMark({
  tone = "color",
  className = "h-8 w-auto",
}: {
  tone?: Tone;
  className?: string;
}) {
  return (
    <Image
      src={`/hayvora-mark${tone === "reversed" ? "-reversed" : ""}.svg`}
      alt=""
      width={MARK.w}
      height={MARK.h}
      className={className}
    />
  );
}
