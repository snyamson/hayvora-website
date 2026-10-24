// Fills the site text in Sanity from sanity/seed/site-copy.json.
//
// Safe to re-run: every value is written with setIfMissing, so text an editor has
// already changed in Studio is left alone. The one exception is the company rename
// ("Hayvora Holdings ..." -> "Hayvora Limited"), which rewrites those words wherever
// they appear in brand, division and settings documents, drafts included.
//
// Usage: node --env-file=.env.local scripts/seed-site-copy.mjs [--dry] [--release]
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

const dry = process.argv.includes("--dry");
const here = dirname(fileURLToPath(import.meta.url));
const copy = JSON.parse(readFileSync(resolve(here, "../sanity/seed/site-copy.json"), "utf8"));
const client = createClient({ projectId, dataset, apiVersion: "2025-01-01", token, useCdn: false, perspective: "raw" });

/**
 * Turns a nested object into setIfMissing steps, parents before children, so a missing
 * parent object is created before its fields are filled. Arrays and images are written
 * whole: merging them item by item would duplicate entries on a second run.
 */
function steps(value, path = "", out = []) {
  for (const [key, child] of Object.entries(value)) {
    const p = path ? `${path}.${key}` : key;
    const isLeaf = child === null || typeof child !== "object" || Array.isArray(child) || child._type === "image";
    if (isLeaf) {
      out.push([p, child]);
    } else {
      out.push([p, child._type ? { _type: child._type } : {}]);
      steps(Object.fromEntries(Object.entries(child).filter(([k]) => k !== "_type")), p, out);
    }
  }
  return out;
}

const tx = client.transaction();
const log = [];

for (const type of ["siteSettings", "homePage", "divisionPage", "pageText"]) {
  const fields = copy[type];
  tx.createIfNotExists({ _id: type, _type: type });
  let patch = client.patch(type);
  for (const [p, v] of steps(fields)) patch = patch.setIfMissing({ [p]: v });
  tx.patch(patch);
  log.push(`${type}: fill ${steps(fields).length} empty field(s)`);
}

// The parent brand: the new stat and a photo on each process step.
const holdings = await client.fetch(
  '*[_type == "brand" && slug.current == "holdings"]{ _id, stats[]{_key}, process[]{_key, image} }',
);
const b = copy.brandHoldings;
for (const doc of holdings) {
  let patch = client.patch(doc._id);
  for (const stat of b.stats) {
    if (!(doc.stats ?? []).some((s) => s._key === stat._key)) {
      patch = patch.setIfMissing({ stats: [] }).append("stats", [stat]);
      log.push(`${doc._id}: add stat "${stat.value} ${stat.label}"`);
    }
  }
  (doc.process ?? []).forEach((step, i) => {
    const ref = b.processImages[i];
    if (ref && !step.image) {
      patch = patch.set({ [`process[_key=="${step._key}"].image`]: { _type: "image", asset: { _type: "reference", _ref: ref } } });
      log.push(`${doc._id}: photo on process step ${i + 1}`);
    }
  });
  tx.patch(patch);
}

// Bold tails on headings. Only with --release: the live site reads just the first
// part until the redesign ships, so splitting early would cut its headings short.
if (process.argv.includes("--release")) {
  for (const split of copy.headingSplits ?? []) {
    for (const id of [split.id, `drafts.${split.id}`]) {
      const doc = await client.fetch("*[_id == $id][0]{servicesHeading, servicesHeadingEmphasis}", { id });
      if (doc && doc.servicesHeading === split.from && !doc.servicesHeadingEmphasis) {
        tx.patch(client.patch(id).set({ servicesHeading: split.heading, servicesHeadingEmphasis: split.emphasis }));
        log.push(`${id}: services heading split into "${split.heading}" + "${split.emphasis}"`);
      }
    }
  }
}

// Company rename inside any string, in the documents that carry company copy.
const renames = copy.renames;
const docs = await client.fetch('*[_type in ["brand", "divisionProfile", "siteSettings", "homePage", "pageText", "divisionPage"]]');
function walk(value, path, found) {
  if (typeof value === "string") {
    let next = value;
    for (const [from, to] of renames) next = next.split(from).join(to);
    if (next !== value) found.push([path, next]);
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => walk(item, item && item._key ? `${path}[_key=="${item._key}"]` : `${path}[${i}]`, found));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) if (!k.startsWith("_")) walk(v, path ? `${path}.${k}` : k, found);
  }
  return found;
}
for (const doc of docs) {
  const found = walk(doc, "", []);
  if (found.length === 0) continue;
  tx.patch(client.patch(doc._id).set(Object.fromEntries(found)));
  for (const [p, v] of found) log.push(`${doc._id}: ${p} -> "${v.slice(0, 90)}${v.length > 90 ? "…" : ""}"`);
}

console.log(log.join("\n"));
if (dry) {
  console.log("\nDry run, nothing written.");
} else {
  const result = await tx.commit();
  console.log(`\n✓ ${result.results.length} change(s) written to ${projectId}/${dataset}`);
}
