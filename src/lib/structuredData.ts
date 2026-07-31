import { SITE_NAME, SITE_URL, absoluteUrl, DEFAULT_DESCRIPTION } from "@/lib/seo";
import type { SiteSettingsDoc } from "@/types/sanity";

/**
 * JSON-LD graph for the site. Google uses this to build the knowledge panel and
 * sitelinks, and to associate the logo with the brand in search results. The `@id`
 * values let the nodes reference each other instead of repeating themselves.
 */
export function organizationSchema(settings: SiteSettingsDoc | undefined, subsidiaries: { name: string; slug: string }[]) {
  const contact = settings?.contactInfo;
  const social = (settings?.socialLinks ?? []).map((l) => l.url).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: "Hayvora",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: absoluteUrl("/icon.png"),
          width: 512,
          height: 512,
          caption: SITE_NAME,
        },
        image: { "@id": `${SITE_URL}/#logo` },
        description: DEFAULT_DESCRIPTION,
        ...(contact?.email ? { email: contact.email } : {}),
        ...(contact?.phone ? { telephone: contact.phone } : {}),
        address: {
          "@type": "PostalAddress",
          streetAddress: settings?.footerText ?? "Adenta Shopping Mall",
          addressLocality: "Accra",
          addressCountry: "GH",
        },
        areaServed: [
          { "@type": "Country", name: "Ghana" },
          { "@type": "Place", name: "West Africa" },
        ],
        ...(social.length > 0 ? { sameAs: social } : {}),
        subOrganization: subsidiaries.map((s) => ({
          "@type": "Organization",
          name: s.name,
          url: absoluteUrl(`/${s.slug}`),
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-GH",
      },
    ],
  };
}

/** Breadcrumb trail — renders the path under the result instead of a bare URL. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
