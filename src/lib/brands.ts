export type SubsidiarySlug = "infrastructure" | "jhm-geo-consult" | "agrisystem-analytics";

export const SUBSIDIARY_SLUGS: SubsidiarySlug[] = ["infrastructure", "jhm-geo-consult", "agrisystem-analytics"];

export const HOLDINGS_SLUG = "holdings" as const;

export function isSubsidiarySlug(value: string): value is SubsidiarySlug {
  return (SUBSIDIARY_SLUGS as string[]).includes(value);
}
