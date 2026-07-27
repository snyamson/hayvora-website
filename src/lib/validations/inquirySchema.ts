import { z } from "zod";

export const inquirySchema = z.object({
  kind: z.enum(["property_viewing", "general_contact", "service_inquiry"]),
  propertyId: z.string().optional(),
  propertyTitle: z.string().optional(),
  brandId: z.string().optional(),
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Please enter a phone number"),
  message: z.string().optional(),
  preferredContactMethod: z.enum(["email", "phone", "whatsapp"]).optional(),
  source: z.string().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
