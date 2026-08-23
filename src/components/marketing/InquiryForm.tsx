"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { EASE_OUT } from "@/components/ui/Motion";
import { inquirySchema, type InquiryInput } from "@/lib/validations/inquirySchema";

/** Submit label matches what the visitor is actually asking for. */
const SUBMIT_LABEL: Record<InquiryInput["kind"], string> = {
  property_viewing: "Request a viewing",
  service_inquiry: "Send enquiry",
  general_contact: "Send message",
};

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
  // Network/server failures are tracked separately from field validation — previously
  // a failed POST reset nothing and showed nothing, so the form just looked inert.
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: window.location.pathname }),
      });

      if (!res.ok) {
        setSubmitError("We couldn't send that just now. Please try again, or email us directly.");
        return;
      }

      reset({ kind, propertyId, propertyTitle, brandId });
    } catch {
      setSubmitError("Network error — please check your connection and try again.");
    }
  };

  if (isSubmitSuccessful && !submitError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        role="status"
        className="rounded-card border border-brand-secondary/25 bg-brand-secondary-tint p-8"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-secondary text-white">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-5 w-5">
            <path d="M3 8.5l3.5 3.5L13 5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="font-display mt-5 text-lg font-semibold text-brand-ink">
          Thank you — we&apos;ve received your request.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-brand-ink/65">
          A member of our team will contact you shortly to arrange next steps.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-card border border-brand-line-soft bg-white p-7 shadow-soft sm:p-9"
    >
      {propertyTitle && (
        <p className="mb-6 rounded-control bg-brand-tint px-4 py-3 text-sm text-brand-ink/70">
          Regarding: <span className="font-semibold text-brand-ink">{propertyTitle}</span>
        </p>
      )}

      <div className="space-y-5">
        <Field label="Name" error={errors.name?.message}>
          <input
            {...register("name")}
            autoComplete="name"
            aria-invalid={!!errors.name}
            className={inputClass(!!errors.name)}
          />
        </Field>

        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            {...register("email")}
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={inputClass(!!errors.email)}
          />
        </Field>

        <Field label="Phone" error={errors.phone?.message}>
          <input
            type="tel"
            {...register("phone")}
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            className={inputClass(!!errors.phone)}
          />
        </Field>

        <Field label="Message" hint="Optional" error={errors.message?.message}>
          <textarea {...register("message")} rows={4} className={`${inputClass(!!errors.message)} resize-y`} />
        </Field>
      </div>

      {submitError && (
        <p role="alert" className="mt-5 rounded-control bg-brand-primary-tint px-4 py-3 text-sm text-brand-ink">
          {submitError}
        </p>
      )}

      <Button type="submit" variant="secondary" size="md" disabled={isSubmitting} className="mt-7 w-full">
        {isSubmitting ? "Sending…" : SUBMIT_LABEL[kind]}
      </Button>
    </form>
  );
}

/* Shared input chrome — one focus treatment for every field on the site. */
function inputClass(hasError: boolean) {
  return `w-full rounded-control border bg-white px-4 py-3 text-sm text-brand-ink transition-colors duration-200 placeholder:text-brand-ink/35 focus:outline-none ${
    hasError
      ? "border-brand-primary focus:border-brand-primary"
      : "border-brand-line focus:border-brand-secondary"
  }`;
}

/**
 * Label above the control, error immediately below it. Visible labels rather than
 * placeholders, so the field name survives once the visitor starts typing.
 */
function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between">
        <span className="font-display text-sm font-semibold text-brand-ink">{label}</span>
        {hint && <span className="text-xs text-brand-ink/45">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-sm text-brand-primary">{error}</span>}
    </label>
  );
}
