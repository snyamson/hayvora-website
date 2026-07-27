// One-off content seed sourced from staging.hayvora.com (2026-07-27).
// Safe to re-run: every document uses a fixed _id and createOrReplace.
//
// Usage: node --env-file=.env.local scripts/seed-content.mjs
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const documents = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    title: "Hayvora Holdings Limited",
    contactInfo: {
      email: "info@hayvora.com",
      phone: "+233 208 529 113",
      whatsapp: "+233 262 319 932",
    },
    // Only LinkedIn had a real, company-specific URL on staging.hayvora.com.
    socialLinks: [{ platform: "linkedin", url: "https://www.linkedin.com/company/hayvora-holdings-ltd/" }],
    footerText: "Adenta Shopping Mall, Accra, Ghana",
  },
  {
    _id: "brand-holdings",
    _type: "brand",
    name: "Hayvora Holdings Limited",
    slug: { _type: "slug", current: "holdings" },
    isParent: true,
    tagline: "Building Futures. Measuring Impact. Powering Innovation.",
    shortDescription:
      "Multidisciplinary civil and architectural construction delivering durable builds — the parent company behind Infrastructure, JHM Geo Consult, and AgriSystem & Analytics.",
    hero: {
      headline: "Building Futures. Measuring Impact. Powering Innovation.",
      subheadline:
        "We are committed to delivering resilient infrastructure through engineering excellence, innovation, and integrity — helping communities and clients grow with confidence.",
      ctaLabel: "View Properties",
      ctaHref: "/properties",
    },
    stats: [
      { _key: "projects", value: "232", label: "Projects Completed" },
      { _key: "satisfaction", value: "98.99%", label: "Client Satisfaction Rate" },
    ],
    process: [
      {
        _key: "start",
        title: "Start with Certainty",
        description: "Scope, budget, and timeline defined up front, so every project begins with a clear plan.",
      },
      {
        _key: "build",
        title: "Build with Discipline",
        description: "Quality execution against strict safety standards, at every stage of the build.",
      },
      {
        _key: "handover",
        title: "Hand Over with Confidence",
        description: "Full inspections and a final walkthrough before every project is handed over.",
      },
    ],
    orderRank: 0,
  },
  {
    _id: "brand-infrastructure",
    _type: "brand",
    name: "Infrastructure",
    slug: { _type: "slug", current: "infrastructure" },
    isParent: false,
    tagline: "Built to last.",
    shortDescription:
      "Comprehensive civil and architectural solutions including structural works, interior finishing, and landscape design.",
    hero: {
      headline: "Built to last.",
      subheadline:
        "Comprehensive civil and architectural solutions including structural works, interior finishing, and landscape design.",
    },
    enabledModules: ["projects", "gallery", "services", "team", "testimonials"],
    orderRank: 1,
  },
  {
    _id: "brand-jhm-geo-consult",
    _type: "brand",
    name: "JHM Geo Consult",
    slug: { _type: "slug", current: "jhm-geo-consult" },
    isParent: false,
    tagline: "Precision, mapped.",
    shortDescription:
      "Advanced land surveying, drone mapping, GIS, geotechnical investigations, and environmental assessments across Ghana and West Africa.",
    hero: {
      headline: "Precision, mapped.",
      subheadline:
        "Advanced land surveying, drone mapping, GIS, geotechnical investigations, and environmental assessments across Ghana and West Africa.",
    },
    enabledModules: ["projects", "services", "team", "testimonials"],
    orderRank: 2,
  },
  {
    _id: "brand-agrisystem-analytics",
    _type: "brand",
    name: "AgriSystem & Analytics",
    slug: { _type: "slug", current: "agrisystem-analytics" },
    isParent: false,
    tagline: "Grow smarter.",
    shortDescription:
      "Greenhouse construction, smart irrigation, and climate-smart farming solutions, alongside M&E, field analytics, and development impact reporting.",
    hero: {
      headline: "Grow smarter.",
      subheadline:
        "Greenhouse construction, smart irrigation, and climate-smart farming solutions, alongside M&E, field analytics, and development impact reporting.",
    },
    enabledModules: ["projects", "gallery", "services", "team", "testimonials"],
    orderRank: 3,
  },
  {
    _id: "project-arlo",
    _type: "project",
    title: "ARLO",
    slug: { _type: "slug", current: "arlo" },
    brand: { _type: "reference", _ref: "brand-infrastructure" },
    category: ["Residential Building"],
    client: "Fabrico",
    duration: "Oct 2025–Present",
    status: "ongoing",
    featured: true,
    orderRank: 0,
  },
  {
    _id: "project-gnpc-headquarters",
    _type: "project",
    title: "GNPC Headquarters",
    slug: { _type: "slug", current: "gnpc-headquarters" },
    brand: { _type: "reference", _ref: "brand-infrastructure" },
    category: ["Public Infrastructure"],
    duration: "2 years",
    status: "completed",
    featured: true,
    orderRank: 1,
  },
  {
    _id: "project-customs-station-office",
    _type: "project",
    title: "Customs Station Office",
    slug: { _type: "slug", current: "customs-station-office" },
    brand: { _type: "reference", _ref: "brand-infrastructure" },
    category: ["Office"],
    client: "Ghana Revenue Authority",
    duration: "8 Months",
    status: "completed",
    featured: true,
    orderRank: 2,
  },
  {
    _id: "project-the-summit",
    _type: "project",
    title: "The Summit",
    slug: { _type: "slug", current: "the-summit" },
    brand: { _type: "reference", _ref: "brand-infrastructure" },
    category: ["Residential Building"],
    client: "De Simone",
    duration: "Aug 2025–Present",
    status: "ongoing",
    featured: true,
    orderRank: 3,
  },
];

const transaction = documents.reduce((tx, doc) => tx.createOrReplace(doc), client.transaction());

const result = await transaction.commit();
console.log(`Seeded ${result.results.length} documents:`);
for (const r of result.results) {
  console.log(`  ${r.operation.padEnd(10)} ${r.id}`);
}
