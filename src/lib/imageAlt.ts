/**
 * What a photo shows, for search engines and screen readers. A photo's own Alt
 * text from Sanity comes first; without it, the names it belongs to (a project,
 * its place, the company) describe it, so no photo is left undescribed. An empty
 * result is only right for an image that is pure decoration.
 */
export function describe(alt: unknown, ...context: (string | null | undefined)[]): string {
  // Sanity types an image's extra fields loosely, so its Alt text arrives as unknown.
  const own = typeof alt === "string" ? alt.trim() : "";
  if (own) return own;
  const parts = context.map((part) => part?.trim()).filter((part): part is string => !!part);
  return [...new Set(parts)].join(", ");
}

/** A property's place in words: its city and region, as Sanity holds them. */
export function placeOf(location: { line1?: string; city?: string; region?: string } | string | null | undefined): string {
  if (!location) return "";
  if (typeof location === "string") return location;
  return [location.city, location.region].filter(Boolean).join(", ");
}
