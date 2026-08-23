import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

/**
 * The only button on the site. Header CTAs, hero CTAs, form submits, footer links and
 * card actions all render this, so shape, height, weight, motion and focus ring are
 * identical everywhere — previously each of those was hand-rolled and no two matched.
 *
 * Shape is a pill in every variant. That's set here rather than left to `className`
 * because two competing border-radius classes resolve by Tailwind's generated rule
 * order, not by the order they're written in the attribute.
 */

type Variant = "primary" | "secondary" | "outline" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

const VARIANT_STYLES: Record<Variant, string> = {
  // Solid blue — the site's default action, and the main place blue still appears.
  primary:
    "bg-brand-primary text-brand-text-on-primary shadow-soft hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0",
  // Solid green — used for the affirmative/"talk to us" action so it reads distinctly
  // from the navigational primary.
  secondary:
    "bg-brand-secondary text-white shadow-soft hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0",
  // Hairline blue — secondary emphasis on light grounds.
  outline:
    "border border-brand-primary/25 text-brand-primary bg-transparent hover:bg-brand-primary hover:text-brand-text-on-primary hover:border-brand-primary",
  // No chrome until hover — for tertiary actions sitting next to a solid button.
  ghost: "text-brand-primary bg-transparent hover:bg-brand-primary/8",
  // For placement on the deep green bands and over photography.
  white: "bg-white text-brand-primary shadow-soft hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0",
};

/* Heights clear the 44px minimum touch target at every size. */
const SIZE_STYLES: Record<Size, string> = {
  sm: "px-5 py-3 text-[0.8125rem] gap-1.5",
  md: "px-7 py-3.5 text-sm gap-2",
  lg: "px-9 py-4.5 text-base gap-2.5",
};

const BASE =
  "font-display group/btn relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full font-bold tracking-wide transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] disabled:pointer-events-none disabled:opacity-50";

/** Trailing arrow that slides on hover. Adds direction to an action without an icon set. */
function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover/btn:translate-x-1"
    >
      <path
        d="M2 8h11M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Appends a sliding arrow. Use on navigational CTAs, not on form submits. */
  withArrow?: boolean;
  className?: string;
};

type AnchorRest = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;
type ButtonRest = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

type ButtonAsLink = BaseProps & { href: string } & AnchorRest;
type ButtonAsButton = BaseProps & { href?: undefined } & ButtonRest;

export function Button(props: ButtonAsLink | ButtonAsButton) {
  // Destructured once, so `rest` carries only the caller's own DOM attributes and can be
  // spread straight onto whichever element we render.
  const {
    children,
    variant = "primary",
    size = "md",
    withArrow = false,
    className = "",
    href,
    ...rest
  } = props;

  // Solid variants get the light sweep on hover; outline/ghost would show it through
  // a transparent background, which reads as a rendering glitch rather than polish.
  const sheen = variant === "primary" || variant === "secondary" || variant === "white" ? "hv-sheen" : "";

  const classes = `${BASE} ${SIZE_STYLES[size]} ${VARIANT_STYLES[variant]} ${sheen} ${className}`;

  const content = (
    <>
      {/* Labels render as written — no uppercase transform anywhere on the site. */}
      <span className="relative z-10">{children}</span>
      {withArrow && <Arrow />}
    </>
  );

  if (href !== undefined) {
    const external = /^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

    // Off-site and protocol links bypass the router — <Link> would try to prefetch them.
    if (external) {
      return (
        <a href={href} className={classes} {...(rest as AnchorRest)}>
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...(rest as AnchorRest)}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonRest)}>
      {content}
    </button>
  );
}

/**
 * Text link with an animated underline that wipes in from the left. Used where a full
 * button would be too heavy — "View full project", "Learn more" and similar.
 */
export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`font-display group/link inline-flex items-center gap-2 text-sm font-bold tracking-wide text-brand-primary transition-colors hover:text-brand-secondary ${className}`}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover/link:scale-x-100" />
      </span>
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1">
        <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}
