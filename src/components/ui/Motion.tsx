"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * The site's motion system. Every animated element on the site composes one of these
 * primitives rather than hand-rolling a `motion.div`, so timing, easing and distance
 * stay identical everywhere.
 *
 * Two rules hold throughout:
 *   1. Only `transform` and `opacity` (plus `filter` on text) are animated — never
 *      width/height/top/left, which force layout on every frame.
 *   2. Every primitive checks `useReducedMotion()` and renders its *final* state when
 *      the visitor asks for reduced motion. Content is never hidden behind an
 *      animation that won't play.
 */

/** Apple's standard out-curve. Matches `--ease-brand` / `--ease-out-expo` in globals.css. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Viewport trigger shared by every scroll reveal: fire once, slightly before the
 *  element's top edge reaches the fold, so motion finishes as it settles into view. */
const VIEWPORT = { once: true, margin: "-12% 0px -8% 0px" } as const;

type Common = { children: ReactNode; className?: string; delay?: number };

/**
 * The elements `Stagger` / `StaggerItem` can render as.
 *
 * A fixed map rather than an open `ElementType` plus `motion.create()`: that helper
 * mints a brand-new component type per call, so building one while rendering hands
 * React a different type every pass and remounts the whole subtree — losing DOM state
 * and restarting the animation it was meant to drive. These are resolved once, here,
 * and the union also stops callers passing a tag that makes no sense in a stagger.
 */
const MOTION_TAGS = {
  div: motion.div,
  span: motion.span,
  section: motion.section,
  nav: motion.nav,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  dl: motion.dl,
} as const;

type StaggerTag = keyof typeof MOTION_TAGS;

/* -------------------------------------------------------------------------- */
/* Reveal — the default scroll entrance                                        */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  blur = false,
  duration = 0.7,
}: Common & {
  y?: number;
  /** Adds a short de-blur. Reserved for headlines — it's expensive on large subtrees. */
  blur?: boolean;
  duration?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y, filter: blur ? "blur(8px)" : undefined }}
      whileInView={{ opacity: 1, y: 0, filter: blur ? "blur(0px)" : undefined }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stagger — parent/child choreography                                         */
/* -------------------------------------------------------------------------- */

const staggerParent = (gap: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

const staggerChild = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
});

/**
 * Wrap a group of `<StaggerItem>`s to have them enter in sequence. `gap` is the delay
 * between consecutive children — keep it at 0.06–0.1s; past ~8 children the tail
 * starts to feel like it's lagging behind the scroll.
 */
export function Stagger({
  children,
  className = "",
  delay = 0,
  gap = 0.08,
  as: Tag = "div",
}: Common & { gap?: number; as?: StaggerTag }) {
  const reduced = useReducedMotion();
  const MotionTag = MOTION_TAGS[Tag];

  if (reduced) return <Tag className={className}>{children}</Tag>;

  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={staggerParent(gap, delay)}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className = "",
  y = 24,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: StaggerTag;
}) {
  const reduced = useReducedMotion();
  const MotionTag = MOTION_TAGS[Tag];

  if (reduced) return <Tag className={className}>{children}</Tag>;

  return (
    <MotionTag variants={staggerChild(y)} className={className}>
      {children}
    </MotionTag>
  );
}

/* -------------------------------------------------------------------------- */
/* TextReveal — word-by-word headline entrance                                 */
/* -------------------------------------------------------------------------- */

/**
 * Reveals a headline one word at a time. Deliberately splits on words, not characters:
 * character splitting creates one DOM node per letter and reads as a gimmick at the
 * paragraph lengths these headlines run to.
 *
 * The full string is kept in an `aria-label` and the animated words are hidden from
 * assistive tech, so a screen reader announces one clean sentence.
 */
export function TextReveal({
  text,
  className = "",
  delay = 0,
  as: Tag = "h2",
  once = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: ElementType;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        // Each word gets a clipping wrapper so the glyphs rise out of a hard edge
        // rather than fading in mid-air. inline-block keeps normal line wrapping.
        <span key={`${word}-${i}`} aria-hidden className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once, margin: "-10% 0px" }}
            transition={{ duration: 0.7, delay: delay + i * 0.045, ease: EASE_OUT }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* Parallax — scroll-linked depth                                              */
/* -------------------------------------------------------------------------- */

/**
 * Moves a decorative layer against the scroll to suggest depth. Applied to background
 * and media layers only — never to body copy or anything interactive, where it hurts
 * readability and can provoke motion sickness.
 *
 * `speed` is the total travel in pixels across the element's full pass through the
 * viewport; 40–120 reads as depth, beyond that it starts to detach from the page.
 */
export function Parallax({
  children,
  className = "",
  speed = 60,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Spring-smoothed so a trackpad's jumpy scroll deltas don't translate into jitter.
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const y = useTransform(smooth, [0, 1], [speed, -speed]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/** Scroll-linked zoom for hero/section media — the photo settles as you reach it. */
export function ScrollZoom({
  children,
  className = "",
  from = 1.18,
  to = 1,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.5 });
  const scale = useTransform(smooth, [0, 1], [from, to]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ scale }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ClipReveal — media unmasks as it enters                                     */
/* -------------------------------------------------------------------------- */

/**
 * Unmasks an image from a slightly inset rounded rectangle to its full bounds. Pairs
 * with a counter-scale on the child so the photo appears to settle rather than grow.
 */
export function ClipReveal({
  children,
  className = "",
  delay = 0,
}: Common) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ clipPath: "inset(12% 12% 12% 12% round 1.25rem)", opacity: 0.4, scale: 1.06 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 1.25rem)", opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.05, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* CountUp — statistics animate to their value                                 */
/* -------------------------------------------------------------------------- */

/**
 * Counts a stat up to its final value when it scrolls into view. Accepts the raw
 * authored string ("22", "98.99%", "15+") and animates only the numeric part, keeping
 * any prefix/suffix and the original decimal precision intact — so editors keep
 * writing values naturally in Sanity and the component adapts.
 */
export function CountUp({ value, className = "", duration = 1.8 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();

  const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const suffix = match?.[3] ?? "";
  const rawNumber = match?.[2]?.replace(/,/g, "") ?? "";
  const target = Number.parseFloat(rawNumber);
  const decimals = rawNumber.includes(".") ? rawNumber.split(".")[1].length : 0;

  // Anything that isn't a recognisable number — or a visitor who asked for reduced
  // motion — skips the animation entirely and renders `value` verbatim below. Deciding
  // that here rather than inside the effect keeps the non-animated path free of state.
  const animatable = Number.isFinite(target) && !reduced;

  const [counted, setCounted] = useState(() => `${prefix}${(0).toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (!animatable || !inView) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      // easeOutCubic — fast rise, gentle settle, matching the site's other exits.
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounted(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, animatable, target, decimals, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {animatable ? counted : value}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* ScrollProgress — reading position indicator in the header                   */
/* -------------------------------------------------------------------------- */

export function ScrollProgress({ className = "" }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <motion.div
      style={{ scaleX }}
      className={`origin-left ${className}`}
      aria-hidden
    />
  );
}
