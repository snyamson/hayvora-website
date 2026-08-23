import type { ReactNode } from "react";

import { Stagger, StaggerItem } from "@/components/ui/Motion";

type ContactInfo = { email?: string; phone?: string; whatsapp?: string };

/**
 * Contact channels as a stack of cards. Shared by the Holdings and subsidiary contact
 * pages so both sides of those layouts match.
 *
 * Every row is a real link — `mailto:`, `tel:` and a wa.me deep link — because on a
 * phone a plain text number is a number you have to copy by hand.
 */
export function ContactDetails({ info, address }: { info?: ContactInfo; address?: string }) {
  const rows = [
    info?.email && {
      label: "Email",
      value: info.email,
      href: `mailto:${info.email}`,
      icon: <MailIcon />,
    },
    info?.phone && {
      label: "Phone",
      value: info.phone,
      href: `tel:${info.phone.replace(/\s/g, "")}`,
      icon: <PhoneIcon />,
    },
    info?.whatsapp && {
      label: "WhatsApp",
      value: info.whatsapp,
      href: `https://wa.me/${info.whatsapp.replace(/[^\d]/g, "")}`,
      icon: <ChatIcon />,
    },
    address && { label: "Office", value: address, href: undefined, icon: <PinIcon /> },
  ].filter(Boolean) as { label: string; value: string; href?: string; icon: ReactNode }[];

  if (rows.length === 0) return null;

  return (
    <Stagger gap={0.08} className="flex flex-col gap-3">
      {rows.map((row) => {
        const body = (
          <>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-line bg-brand-tint text-brand-primary transition-colors duration-300 group-hover:border-brand-secondary group-hover:bg-brand-secondary group-hover:text-white">
              {row.icon}
            </span>
            <span className="min-w-0">
              <span className="font-display block text-[0.6875rem] font-bold tracking-[0.15em] text-brand-ink/45 uppercase">
                {row.label}
              </span>
              <span className="mt-0.5 block truncate text-sm text-brand-ink/80">{row.value}</span>
            </span>
          </>
        );

        const shell =
          "group flex items-center gap-4 rounded-card border border-brand-line-soft bg-white p-4 shadow-soft transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]";

        return (
          <StaggerItem key={row.label} y={14}>
            {row.href ? (
              <a
                href={row.href}
                {...(row.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`${shell} hover:-translate-y-0.5 hover:border-brand-line hover:shadow-lift`}
              >
                {body}
              </a>
            ) : (
              <div className={shell}>{body}</div>
            )}
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" {...stroke} />
      <path d="M3 6l7 5 7-5" {...stroke} />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <path
        d="M6.5 3h-2A1.5 1.5 0 0 0 3 4.6C3 11 9 17 15.4 17a1.5 1.5 0 0 0 1.6-1.5v-2l-3.3-1.2-1.5 1.8a11 11 0 0 1-4.3-4.3l1.8-1.5L6.5 3Z"
        {...stroke}
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <path d="M17 9.5c0 3.6-3.1 6.5-7 6.5a7.7 7.7 0 0 1-2.8-.5L3 17l1.2-3A6.2 6.2 0 0 1 3 9.5C3 5.9 6.1 3 10 3s7 2.9 7 6.5Z" {...stroke} />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
      <path d="M10 17.5s5.5-4.8 5.5-8.8a5.5 5.5 0 0 0-11 0c0 4 5.5 8.8 5.5 8.8Z" {...stroke} />
      <circle cx="10" cy="8.5" r="2" {...stroke} />
    </svg>
  );
}
