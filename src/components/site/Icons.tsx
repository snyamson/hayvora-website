type IconProps = { size?: number; className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowRight({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.2} className={className} {...stroke}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeft({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.2} className={className} {...stroke}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function ArrowUpRight({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.2} className={className} {...stroke}>
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

export function Chevron({ dir, size = 22, className }: IconProps & { dir: "left" | "right" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.4} className={className} {...stroke}>
      <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

export function Plus({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.2} className={className} {...stroke}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Minus({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.2} className={className} {...stroke}>
      <path d="M5 12h14" />
    </svg>
  );
}

/** Turner's long thin arrow. */
export function LongArrow({ className }: { className?: string }) {
  return (
    <svg width="36" height="12" viewBox="0 0 36 12" strokeWidth={1.6} className={className} {...stroke}>
      <path d="M1 6h33M29 1l5 5-5 5" />
    </svg>
  );
}
