import type { BrandDoc } from "@/types/sanity";

/**
 * Placeholder content shown until real brand documents are authored in Studio.
 * Sourced from staging.hayvora.com where available; keeps every page renderable
 * during development instead of erroring or showing a blank screen.
 */
export const FALLBACK_BRANDS: Record<string, BrandDoc> = {
  holdings: {
    _id: "fallback-holdings",
    name: "Hayvora Holdings Limited",
    slug: { current: "holdings" },
    isParent: true,
    tagline: "Building Futures. Measuring Impact. Powering Innovation.",
    shortDescription:
      "Multidisciplinary civil and architectural construction delivering durable builds — the parent company behind Infrastructure, JHM Geo Consult, and AgriSystem & Analytics.",
    hero: {
      headline: "Building Futures. Measuring Impact. Powering Innovation.",
      subheadline:
        "We are committed to delivering resilient infrastructure through engineering excellence, innovation, and integrity — helping communities and clients grow with confidence.",
      media: [],
      ctaLabel: "View Properties",
      ctaHref: "/properties",
    },
    // Mirrors the live Sanity brand document. Every figure on the site reads from here
    // (or its Sanity equivalent) — never hardcode a number in a component.
    stats: [
      { value: "22", label: "Projects Completed" },
      { value: "98.99%", label: "Client Satisfaction Rate" },
    ],
    whyChoose: {
      eyebrow: "Why Choose Hayvora",
      heading:
        "At Hayvora Holdings, quality, safety, and precision are the foundation of everything we build",
      statDescription: "Delivering civil, architectural, and infrastructure projects across Ghana and beyond",
      ctaLabel: "Get in touch",
      ctaHref: "/contact",
    },
    process: [
      {
        title: "Start with Certainty",
        description: "Scope, budget, and timeline defined up front, so every project begins with a clear plan.",
      },
      {
        title: "Build with Discipline",
        description: "Quality execution against strict safety standards, at every stage of the build.",
      },
      {
        title: "Hand Over with Confidence",
        description: "Full inspections and a final walkthrough before every project is handed over.",
      },
    ],
  },
  infrastructure: {
    _id: "fallback-infrastructure",
    name: "Infrastructure",
    slug: { current: "infrastructure" },
    tagline: "Built to last.",
    shortDescription:
      "Comprehensive civil and architectural solutions including structural works, interior finishing, and landscape design.",
    hero: {
      headline: "Built to last.",
      subheadline:
        "Comprehensive civil and architectural solutions including structural works, interior finishing, and landscape design.",
      media: [],
    },
    enabledModules: ["projects", "gallery", "services", "team", "testimonials"],
  },
  "jhm-geo-consult": {
    _id: "fallback-jhm-geo-consult",
    name: "JHM Geo Consult",
    slug: { current: "jhm-geo-consult" },
    tagline: "Precision, mapped.",
    shortDescription:
      "Advanced land surveying, drone mapping, GIS, geotechnical investigations, and environmental assessments across Ghana and West Africa.",
    hero: {
      headline: "Precision, mapped.",
      subheadline:
        "Advanced land surveying, drone mapping, GIS, geotechnical investigations, and environmental assessments across Ghana and West Africa.",
      media: [],
    },
    enabledModules: ["projects", "services", "team", "testimonials"],
  },
  "agrisystem-analytics": {
    _id: "fallback-agrisystem-analytics",
    name: "AgriSystem & Analytics",
    slug: { current: "agrisystem-analytics" },
    tagline: "Grow smarter.",
    shortDescription:
      "Greenhouse construction, smart irrigation, and climate-smart farming solutions, alongside M&E, field analytics, and development impact reporting.",
    hero: {
      headline: "Grow smarter.",
      subheadline:
        "Greenhouse construction, smart irrigation, and climate-smart farming solutions, alongside M&E, field analytics, and development impact reporting.",
      media: [],
    },
    enabledModules: ["projects", "gallery", "services", "team", "testimonials"],
  },
};

/**
 * Client logos shown in the homepage marquee until `client` documents are authored in
 * Studio. Files live in `public/clients/` — add the image there and the entry here.
 */
export const FALLBACK_CLIENTS = [
  { name: "Ropeak", logoUrl: "/clients/partner-ropeak.png" },
  { name: "Nathawo Properties & Investment Limited", logoUrl: "/clients/partner-nathawo.png" },
  { name: "Bauer Services", logoUrl: "/clients/partner-bauer.png" },
  { name: "Greatjoy", logoUrl: "/clients/partner-greatjoy.png" },
  { name: "DeSimone", logoUrl: "/clients/partner-desimone.png" },
  { name: "Fabrico", logoUrl: "/clients/partner-fabrico.png" },
  { name: "Sienna", logoUrl: "/clients/partner-sienna.png" },
];

export const FALLBACK_SITE_SETTINGS = {
  title: "Hayvora Holdings Limited",
  contactInfo: {
    email: "info@hayvora.com",
    phone: "+233 208 529 113",
    whatsapp: "+233 262 319 932",
  },
  // Only LinkedIn had a real, company-specific URL on staging.hayvora.com — the
  // Twitter/Instagram/Facebook links there pointed at generic, unconfigured pages,
  // so they're left out here rather than guessed. Add real handles once you have them.
  socialLinks: [{ platform: "linkedin", url: "https://www.linkedin.com/company/hayvora-holdings-ltd/" }],
  footerText: "Adenta Shopping Mall, Accra, Ghana",
};
