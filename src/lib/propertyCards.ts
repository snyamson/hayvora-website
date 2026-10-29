import { urlFor } from "../../sanity/lib/image";
import type { PropertyCard } from "@/components/site/home/HomeSections";
import type { PageTextDoc, PropertyDoc } from "@/types/sanity";
import { describe, placeOf } from "@/lib/imageAlt";

type PropertyText = NonNullable<PageTextDoc["properties"]>;

export function statusLabel(status: PropertyDoc["status"], text: PropertyText | undefined) {
  return { available: text?.statusAvailable, reserved: text?.statusReserved, sold: text?.statusSold }[status];
}

/** Specs as one line, e.g. "3 bed · 2 bath · 240 sqm", units from Page text. */
export function specsLine(p: PropertyDoc, text: PropertyText | undefined) {
  const s = p.specs;
  return [
    s?.bedrooms ? [s.bedrooms, text?.bedUnit].filter(Boolean).join(" ") : null,
    s?.bathrooms ? [s.bathrooms, text?.bathUnit].filter(Boolean).join(" ") : null,
    s?.sizeSqm ? [s.sizeSqm, text?.areaUnit].filter(Boolean).join(" ") : null,
    s?.landSizeAcres ? [s.landSizeAcres, text?.landUnit].filter(Boolean).join(" ") : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function toPropertyCard(p: PropertyDoc, text: PropertyText | undefined, withDetail = false): PropertyCard {
  let imageUrl: string | undefined;
  try {
    imageUrl = p.images?.[0]?.asset ? urlFor(p.images[0]).width(800).height(600).url() : undefined;
  } catch {
    imageUrl = undefined;
  }
  return {
    href: `/properties/${p.slug.current}`,
    title: p.title,
    location: [p.location?.city, p.location?.region].filter(Boolean).join(", "),
    imageUrl,
    imageAlt: describe(p.images?.[0]?.alt, p.title, placeOf(p.location), p.brand?.legalName ?? p.brand?.name),
    status: p.status,
    statusLabel: statusLabel(p.status, text),
    ...(withDetail ? { eyebrow: p.brand?.name, specs: specsLine(p, text) || undefined } : {}),
  };
}
