import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "raw",
  token: process.env.SANITY_API_WRITE_TOKEN,
});

/**
 * Fetches and swallows errors, returning `null` instead. Every page-level query
 * goes through this so a not-yet-configured Sanity project (placeholder env vars,
 * no content authored yet) renders fallback content instead of a 500 in dev/before launch.
 */
export async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = [],
): Promise<T | null> {
  try {
    return await client.fetch<T>(query, params, { next: { tags } });
  } catch {
    return null;
  }
}
