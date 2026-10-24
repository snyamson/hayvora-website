import { fill, getPageText } from "@/lib/content";
import { NextResponse } from "next/server";

import { writeClient } from "../../../../sanity/lib/client";
import { getResendClient } from "@/lib/email/resend";
import { NewInquiryEmail } from "@/lib/email/templates/NewInquiryEmail";
import { inquirySchema } from "@/lib/validations/inquirySchema";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { kind, propertyId, propertyTitle, brandId, name, email, phone, message, preferredContactMethod, source } =
    parsed.data;

  try {
    await writeClient.create({
      _type: "inquiry",
      kind,
      ...(propertyId ? { property: { _type: "reference", _ref: propertyId } } : {}),
      ...(brandId ? { brand: { _type: "reference", _ref: brandId } } : {}),
      name,
      email,
      phone,
      message,
      preferredContactMethod,
      source,
      status: "new",
    });
  } catch (error) {
    console.error("Failed to save inquiry to Sanity", error);
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });
  }

  try {
    const resend = getResendClient();
    const to = process.env.LEAD_NOTIFICATION_FALLBACK_EMAIL;
    if (resend && to) {
      const labels = (await getPageText())?.email ?? {};
      const subject = propertyTitle ? fill(labels.viewingSubject, { property: propertyTitle }) : (labels.generalSubject ?? "");
      await resend.emails.send({
        from: "Hayvora Website <onboarding@resend.dev>",
        to,
        subject,
        react: NewInquiryEmail({ name, email, phone, message, propertyTitle, kind, subject, labels }),
      });
    }
  } catch (error) {
    console.error("Failed to send inquiry notification email", error);
  }

  return NextResponse.json({ ok: true });
}
