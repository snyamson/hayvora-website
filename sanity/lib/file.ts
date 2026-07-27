import { dataset, projectId } from "../env";

/** Resolves a Sanity file-asset reference (e.g. a hero background video) to its CDN URL. */
export function fileUrlFor(fileField: { asset?: { _ref?: string } } | undefined): string | undefined {
  const ref = fileField?.asset?._ref;
  if (!ref) return undefined;

  const match = ref.match(/^file-([a-zA-Z0-9]+)-(\w+)$/);
  if (!match) return undefined;

  const [, id, extension] = match;
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${extension}`;
}
