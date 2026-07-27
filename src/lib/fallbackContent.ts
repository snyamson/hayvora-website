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
    stats: [
      { value: "232", label: "Projects Completed" },
      { value: "98.99%", label: "Client Satisfaction Rate" },
    ],
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
