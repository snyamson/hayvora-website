// Uploads the full colour logo files in public/ to the Hayvora Limited brand as the
// mark, wordmark and stacked variants. Variants the brand already has are skipped.
//
// Usage: node --env-file=.env.local scripts/upload-logos.mjs
import { createReadStream } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const here = dirname(fileURLToPath(import.meta.url));
const FILES = { mark: "hayvora-mark.svg", wordmark: "hayvora-wordmark.svg", stacked: "hayvora-logo.svg" };

const brand = await client.fetch('*[_type == "brand" && slug.current == "holdings" && !(_id in path("drafts.**"))][0]{_id, logos[]{variant}}');
if (!brand) throw new Error("No holdings brand document");
const have = new Set((brand.logos ?? []).map((l) => l.variant));

const add = [];
for (const [variant, file] of Object.entries(FILES)) {
  if (have.has(variant)) {
    console.log(`skip ${variant}, already there`);
    continue;
  }
  const asset = await client.assets.upload("image", createReadStream(resolve(here, "../public", file)), { filename: file });
  add.push({ _key: `logo-${variant}`, _type: "logoAsset", variant, image: { _type: "image", asset: { _type: "reference", _ref: asset._id } } });
  console.log(`uploaded ${file} as ${variant}`);
}

if (add.length) {
  await client.patch(brand._id).setIfMissing({ logos: [] }).append("logos", add).commit();
  console.log(`✓ added ${add.length} logo(s) to ${brand._id}`);
}
