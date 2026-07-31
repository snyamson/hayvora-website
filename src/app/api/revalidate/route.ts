import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Target for a Sanity webhook (Settings -> API -> Webhooks) configured to fire on
 * create/update/delete for project, property, brand, siteSettings, service, testimonial,
 * teamMember, client. Configure the webhook to send header `x-webhook-secret: <SANITY_REVALIDATE_SECRET>`
 * and a JSON body containing at least `_type` and `slug`.
 */
export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const type: string | undefined = body?._type;
  const slug: string | undefined = body?.slug?.current;

  if (!type) {
    return NextResponse.json({ ok: false, error: "Missing _type in payload" }, { status: 400 });
  }

  // Tag-based invalidation is primary — every safeFetch() call in the app tags its
  // query with the document `_type` and `${_type}:${slug}`, so this covers every page
  // (including brand/project/service pages nested under the dynamic [brand] route)
  // without needing to know the URL structure here.
  revalidateTag(type, "max");
  if (slug) revalidateTag(`${type}:${slug}`, "max");

  // Belt-and-braces path revalidation for the flat, well-known routes.
  if (type === "property") {
    revalidatePath("/properties");
    if (slug) revalidatePath(`/properties/${slug}`);
  }
  if (type === "brand" || type === "siteSettings") {
    revalidatePath("/", "layout");
  }

  return NextResponse.json({ ok: true, revalidated: type, slug: slug ?? null });
}
