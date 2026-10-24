import { z } from "zod";

// Field error messages are written in Sanity (Page text > Enquiry form); the form shows
// them by field, so the rules here carry none.

export const inquirySchema = z.object({
  kind: z.enum(["property_viewing", "general_contact", "service_inquiry"]),
  propertyId: z.string().optional(),
  propertyTitle: z.string().optional(),
  brandId: z.string().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  message: z.string().optional(),
  preferredContactMethod: z.enum(["email", "phone", "whatsapp"]).optional(),
  source: z.string().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
