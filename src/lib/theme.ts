import type { CSSProperties } from "react";

type ColorToken = { hex?: string } | null | undefined;

export type BrandColors = {
  primary?: ColorToken;
  secondary?: ColorToken;
  accent?: ColorToken;
  surface?: ColorToken;
  ink?: ColorToken;
  textOnPrimary?: ColorToken;
};

/**
 * Turns a brand's Sanity `colors` object into inline CSS custom properties.
 * Any missing token falls back to the default palette declared in globals.css,
 * so an incomplete brand document never breaks layout/contrast.
 */
export function buildThemeStyle(colors: BrandColors | undefined): CSSProperties {
  if (!colors) return {};

  const vars: Record<string, string> = {};
  if (colors.primary?.hex) vars["--brand-primary"] = colors.primary.hex;
  if (colors.secondary?.hex) vars["--brand-secondary"] = colors.secondary.hex;
  if (colors.accent?.hex) vars["--brand-accent"] = colors.accent.hex;
  if (colors.surface?.hex) vars["--brand-surface"] = colors.surface.hex;
  if (colors.ink?.hex) vars["--brand-ink"] = colors.ink.hex;
  if (colors.textOnPrimary?.hex) vars["--brand-text-on-primary"] = colors.textOnPrimary.hex;

  return vars as CSSProperties;
}
