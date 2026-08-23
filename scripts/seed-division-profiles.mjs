// Pushes the long-form division profiles into Sanity as `divisionProfile` documents.
//
// Source of truth for the copy is sanity/seed/division-profiles.json — the same file
// src/lib/divisionContent.ts imports for its fallback, so the seeded CMS content and
// the fallback can't drift apart.
//
// Every document uses a fixed _id and createOrReplace, so re-running OVERWRITES text
// edits made in Studio. Only run it to seed a division for the first time, or to
// deliberately reset one back to the repo copy.
//
// Uploaded service photos ARE preserved across re-runs (matched by service title), so
// re-seeding copy never costs you the imagery.
//
// Pass slugs to limit which divisions are written — safer than the implicit "all" when
// another division has already been edited by an editor.
//
// Usage: node --env-file=.env.local scripts/seed-division-profiles.mjs [slug...]
//   e.g. node --env-file=.env.local scripts/seed-division-profiles.mjs jhm-geo-consult
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const profiles = JSON.parse(readFileSync(resolve(here, "../sanity/seed/division-profiles.json"), "utf8"));

const client = createClient({ projectId, dataset, apiVersion: "2025-01-01", token, useCdn: false });

/** Sanity needs a stable `_key` on every array item, or Studio complains about them. */
const keyed = (items, prefix) =>
  items.map((item, i) => (typeof item === "string" ? item : { ...item, _key: `${prefix}-${i}` }));

const requested = process.argv.slice(2);
const known = Object.keys(profiles);

const unknown = requested.filter((slug) => !known.includes(slug));
if (unknown.length > 0) {
  console.error(`Unknown division slug(s): ${unknown.join(", ")}. Known: ${known.join(", ")}`);
  process.exit(1);
}

const slugs = requested.length > 0 ? requested : known;
if (requested.length === 0) {
  console.log(`No slugs given — writing all ${slugs.length}: ${slugs.join(", ")}`);
}

const documents = [];

for (const slug of slugs) {
  const profile = profiles[slug];

  // Resolve the brand this profile belongs to; without it the reference would dangle.
  const brand = await client.fetch('*[_type == "brand" && slug.current == $slug][0]{_id}', { slug });
  if (!brand?._id) {
    console.warn(`! Skipping "${slug}" — no brand document with that slug exists in ${dataset}.`);
    continue;
  }

  // Photography only ever exists in the CMS — it is never in the JSON. createOrReplace
  // would therefore silently delete every service photo an editor has uploaded, so the
  // existing images are read first and re-attached by service title below.
  const existing = await client.fetch(
    '*[_id == $id][0]{ services[]{ title, image } }',
    { id: `divisionProfile-${slug}` },
  );
  const imageByTitle = new Map(
    (existing?.services ?? []).filter((s) => s?.image).map((s) => [s.title, s.image]),
  );
  if (imageByTitle.size > 0) {
    console.log(`  preserving ${imageByTitle.size} uploaded photo(s) on "${slug}"`);
  }

  documents.push({
    _id: `divisionProfile-${slug}`,
    _type: "divisionProfile",
    brand: { _type: "reference", _ref: brand._id },
    legalName: profile.legalName,
    tagline: profile.tagline,
    overview: profile.overview,
    vision: profile.vision,
    mission: profile.mission,
    values: keyed(
      profile.values.map((value) => ({ ...value, _type: "divisionValue" })),
      "value",
    ),
    servicesHeading: profile.servicesHeading,
    servicesIntro: profile.servicesIntro,
    services: keyed(
      profile.services.map((service) => {
        const image = imageByTitle.get(service.title);
        return { ...service, _type: "serviceGroup", ...(image ? { image } : {}) };
      }),
      "service",
    ),
    clients: profile.clients,
    operationalZone: profile.operationalZone,
    operationalNote: profile.operationalNote,
  });
}

if (documents.length === 0) {
  console.error("Nothing to write.");
  process.exit(1);
}

const transaction = documents.reduce((tx, doc) => tx.createOrReplace(doc), client.transaction());
const result = await transaction.commit();

console.log(`✓ Wrote ${result.results.length} division profile(s) to ${projectId}/${dataset}:`);
for (const doc of documents) {
  console.log(`  - ${doc._id} (${doc.services.length} service groups, ${doc.values.length} values)`);
}
