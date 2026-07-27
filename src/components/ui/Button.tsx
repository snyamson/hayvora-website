import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "white";

const VARIANT_STYLES: Record<Variant, string> = {
  primary: "bg-brand-primary text-brand-text-on-primary hover:opacity-90",
  secondary: "bg-brand-secondary text-white hover:opacity-90",
  ghost: "border-2 border-current text-current hover:bg-black/5",
  white: "bg-white text-brand-primary hover:opacity-90",
};

const baseStyles =
  "font-display inline-flex items-center justify-center gap-2 rounded-sm px-7 py-3.5 text-sm font-bold tracking-wide transition";

export function Button({
  children,
  variant = "primary",
  href,
  uppercase = true,
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  uppercase?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = `${baseStyles} ${uppercase ? "uppercase" : ""} ${VARIANT_STYLES[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
