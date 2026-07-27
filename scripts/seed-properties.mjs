// Sample property listings for design/testing purposes (no real photos yet —
// the frontend shows a gradient placeholder until real images are uploaded in Studio).
// Safe to re-run: fixed _id + createOrReplace.
//
// Usage: node --env-file=.env.local scripts/seed-properties.mjs
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2025-01-01", token, useCdn: false });

const documents = [
  {
    _id: "property-adenta-executive-villa",
    _type: "property",
    title: "Adenta Executive Villa",
    slug: { _type: "slug", current: "adenta-executive-villa" },
    brand: { _type: "reference", _ref: "brand-infrastructure" },
    images: [],
    price: 1200000,
    priceOnRequest: false,
    location: { line1: "Adenta Housing Down", city: "Adenta", region: "Greater Accra", country: "Ghana" },
    specs: { propertyType: "house", bedrooms: 4, bathrooms: 3, sizeSqm: 320 },
    status: "available",
    featured: true,
    listedDate: "2026-07-20T09:00:00Z",
  },
  {
    _id: "property-east-legon-commercial-plot",
    _type: "property",
    title: "East Legon Commercial Plot",
    slug: { _type: "slug", current: "east-legon-commercial-plot" },
    brand: { _type: "reference", _ref: "brand-infrastructure" },
    images: [],
    price: 450000,
    priceOnRequest: false,
    location: { line1: "Near American House", city: "East Legon, Accra", region: "Greater Accra", country: "Ghana" },
    specs: { propertyType: "land", landSizeAcres: 0.5 },
    status: "available",
    featured: true,
    listedDate: "2026-07-15T09:00:00Z",
  },
  {
    _id: "property-spintex-family-home",
    _type: "property",
    title: "Spintex Family Home",
    slug: { _type: "slug", current: "spintex-family-home" },
    brand: { _type: "reference", _ref: "brand-infrastructure" },
    images: [],
    price: 850000,
    priceOnRequest: false,
    location: { line1: "Spintex Road", city: "Spintex, Accra", region: "Greater Accra", country: "Ghana" },
    specs: { propertyType: "house", bedrooms: 3, bathrooms: 2, sizeSqm: 210 },
    status: "reserved",
    featured: false,
    listedDate: "2026-07-10T09:00:00Z",
  },
];

const transaction = documents.reduce((tx, doc) => tx.createOrReplace(doc), client.transaction());

const result = await transaction.commit();
console.log(`Seeded ${result.results.length} properties:`);
for (const r of result.results) {
  console.log(`  ${r.operation.padEnd(10)} ${r.id}`);
}
