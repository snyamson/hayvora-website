export type SubsidiarySlug = "infrastructure" | "jhm-geo-consult" | "agrisystem-analytics";

export const SUBSIDIARY_SLUGS: SubsidiarySlug[] = ["infrastructure", "jhm-geo-consult", "agrisystem-analytics"];

export const HOLDINGS_SLUG = "holdings" as const;

export function isSubsidiarySlug(value: string): value is SubsidiarySlug {
  return (SUBSIDIARY_SLUGS as string[]).includes(value);
}

/**
 * The header/footer nav is intentionally identical on every page — Holdings and every
 * subsidiary — so visitors always see the same wayfinding regardless of which site
 * they're on. Home/Divisions/Properties always point back to the Holdings site.
 */
export const GLOBAL_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Divisions", href: "/#divisions" },
  { label: "Properties", href: "/properties" },
];
