"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * A card that tilts in 3D toward the pointer, with its contents floating slightly above
 * the surface and a specular sheen tracking the cursor.
 *
 * Real 3D transforms — `perspective` on the wrapper, `rotateX/rotateY` on the card and
 * `translateZ` on the children — rather than a fake shadow shift, so the parallax
 * between layers is genuine and the card reads as a physical object under a light.
 *
 * The rotation is spring-damped so it settles rather than snapping, and the whole
 * effect is skipped for `prefers-reduced-motion` and on touch (there's no hover to
 * drive it, and a pointer-tracking tilt on a scrolling touch surface is noise).
 */
export function TiltCard({
  children,
  className = "",
  /** Maximum rotation in degrees at the card's corners. Past ~10 it reads as a gimmick. */
  intensity = 7,
  /** How far the content lifts off the card face, in px. */
  depth = 28,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  depth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // -0.5 … 0.5, measured from the card's centre.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 220, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [intensity, -intensity]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-intensity, intensity]), spring);

  // Sheen follows the pointer across the face.
  const sheenX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const sheenY = useTransform(py, [-0.5, 0.5], ["0%", "100%"]);
  const sheen = useMotionTemplate`radial-gradient(circle at ${sheenX} ${sheenY}, rgb(255 255 255 / 0.5), transparent 55%)`;

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Mouse only — a coarse pointer has no hover state to drive the tilt.
    if (e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div ref={ref} onPointerMove={onPointerMove} onPointerLeave={reset} style={{ perspective: 900 }} className={className}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full will-change-transform"
      >
        {/* Content sits forward of the card face, so it parallaxes against it. */}
        <div style={{ transform: `translateZ(${depth}px)`, transformStyle: "preserve-3d" }} className="h-full w-full">
          {children}
        </div>

        <motion.span
          aria-hidden
          style={{ backgroundImage: sheen }}
          className="pointer-events-none absolute inset-0 rounded-card opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100"
        />
      </motion.div>
    </div>
  );
}
