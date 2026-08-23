/**
 * Builds the doubled track a CSS marquee needs.
 *
 * The `-50%` keyframe in `.hv-marquee-track` only loops seamlessly when the track is
 * exactly two identical halves, so the source list is first padded out to `minCount`
 * (enough items to span a wide viewport) and only then laid down twice.
 *
 * Returns the track plus the index at which the duplicate half begins, so callers can
 * mark it `aria-hidden` and avoid announcing every item twice.
 *
 * Lives in `lib/` rather than beside the motion primitives because both marquees are
 * server components — a helper exported from a `"use client"` module can only be
 * called on the client.
 */
export function buildMarqueeTrack<T>(items: T[], minCount: number): { track: T[]; half: number } {
  if (items.length === 0) return { track: [], half: 0 };
  const filled = Array.from({ length: Math.ceil(minCount / items.length) }).flatMap(() => items);
  return { track: [...filled, ...filled], half: filled.length };
}
