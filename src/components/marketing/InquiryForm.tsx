"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { inquirySchema, type InquiryInput } from "@/lib/validations/inquirySchema";

export function InquiryForm({
  kind,
  propertyId,
  propertyTitle,
  brandId,
}: {
  kind: InquiryInput["kind"];
  propertyId?: string;
  propertyTitle?: string;
  brandId?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { kind, propertyId, propertyTitle, brandId },
  });

  const onSubmit = async (data: InquiryInput) => {
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, source: window.location.pathname }),
    });
    if (res.ok) reset({ kind, propertyId, propertyTitle, brandId });
  };

  if (isSubmitSuccessful) {
    return (
      <div className="rounded-2xl bg-brand-surface p-6 text-brand-ink">
        <p className="font-semibold">Thank you — we&apos;ve received your request.</p>
        <p className="mt-1 text-sm text-brand-ink/70">
          A member of our team will contact you shortly to arrange next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {propertyTitle && <p className="text-sm text-brand-ink/60">Regarding: {propertyTitle}</p>}

      <div>
        <label className="mb-1 block text-sm font-medium text-brand-ink">Name</label>
        <input
          {...register("name")}
          className="w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-brand-primary focus:outline-none"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-brand-ink">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-brand-primary focus:outline-none"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-brand-ink">Phone</label>
        <input
          {...register("phone")}
          className="w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-brand-primary focus:outline-none"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-brand-ink">Message (optional)</label>
        <textarea
          {...register("message")}
          rows={4}
          className="w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-brand-primary focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-brand-text-on-primary transition hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Request a Viewing"}
      </button>
    </form>
  );
}
