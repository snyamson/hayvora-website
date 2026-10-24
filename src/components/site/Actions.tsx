import Link from "next/link";
import type { ReactNode } from "react";

import type { LinkDoc } from "@/types/sanity";
import { ArrowRight, ArrowUpRight, LongArrow } from "./Icons";

function SmartLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    const external = href.startsWith("http");
    return (
      <a href={href} className={className} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

const usable = (link?: LinkDoc): link is { label: string; href: string } => Boolean(link?.label && link?.href);

/** Bechtel's circle-arrow button. */
export function ArrowButton({
  link,
  light = false,
  invert = false,
  large = false,
  icon = "right",
  className = "",
}: {
  link?: LinkDoc;
  light?: boolean;
  /** White circle with a green arrow, for green panels. */
  invert?: boolean;
  large?: boolean;
  icon?: "right" | "up-right";
  className?: string;
}) {
  if (!usable(link)) return null;
  return (
    <SmartLink
      href={link.href}
      className={`hv-ab ${light ? "is-light" : ""} ${invert ? "is-invert" : ""} ${large ? "is-lg" : ""} ${className}`}
    >
      {link.label}
      {icon === "up-right" ? <ArrowUpRight /> : <ArrowRight size={20} />}
    </SmartLink>
  );
}

/** EllisDon pill. `white` sits on blue or photos, `solid` on light grounds. */
export function PillLink({
  link,
  variant = "white",
  arrow = true,
}: {
  link?: LinkDoc;
  variant?: "white" | "solid" | "ghost";
  arrow?: boolean;
}) {
  if (!usable(link)) return null;
  const cls = variant === "solid" ? "is-solid" : variant === "ghost" ? "is-ghost" : "";
  return (
    <SmartLink href={link.href} className={`hv-pill ${cls}`}>
      {link.label}
      {arrow && <ArrowRight />}
    </SmartLink>
  );
}

/** Turner's uppercase link with the long arrow. */
export function LineLink({ link }: { link?: LinkDoc }) {
  if (!usable(link)) return null;
  return (
    <SmartLink href={link.href} className="hv-tlink">
      {link.label}
      <LongArrow />
    </SmartLink>
  );
}

export function Chip({ children, light = false }: { children?: ReactNode; light?: boolean }) {
  if (!children) return null;
  return <span className={`hv-chip ${light ? "border-white" : ""}`}>{children}</span>;
}

/** A heading with its optional bold tail, as authored in Sanity's section intro. */
export function MixedHeading({
  heading,
  emphasis,
  as: Tag = "h2",
  className = "hv-h2x",
}: {
  heading?: string;
  emphasis?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  if (!heading && !emphasis) return null;
  return (
    <Tag className={className}>
      {heading}
      {heading && emphasis ? " " : null}
      {emphasis && <b>{emphasis}</b>}
    </Tag>
  );
}
