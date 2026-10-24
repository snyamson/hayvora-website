/**
 * Fills {placeholders} in editor-written text. When a value is empty the placeholder
 * goes together with the word before it, so "{property} in {place}" reads "Villa" when
 * there is no place, not "Villa in ".
 */
export function fill(template: string | undefined, values: Record<string, string | number | undefined>) {
  if (!template) return "";
  let out = template;
  for (const [key, value] of Object.entries(values)) {
    const token = `{${key}}`;
    if (value === undefined || value === "") {
      out = out.replace(new RegExp(`\\s+\\S+\\s+\\{${key}\\}`, "g"), "").split(token).join("");
    } else {
      out = out.split(token).join(String(value));
    }
  }
  return out;
}

/**
 * A link written in "Division pages" points inside the division: "/contact" on the
 * Infrastructure page becomes "/infrastructure/contact". Full URLs and in-page anchors
 * are left as they are.
 */
export function divisionHref(href: string | undefined, divisionSlug: string) {
  if (!href) return undefined;
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
  return `/${divisionSlug}${href === "/" ? "" : href}`;
}
