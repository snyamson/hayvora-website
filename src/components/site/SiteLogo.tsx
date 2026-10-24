/* eslint-disable @next/next/no-img-element -- the logo files are SVGs served by Sanity's CDN */
import type { LogoSet } from "@/lib/chrome";

/** Full colour mark and wordmark side by side, both from the brand's logos in Sanity. */
export function SiteLogo({ logo }: { logo: LogoSet }) {
  if (!logo.mark && !logo.wordmark) return <span className="text-lg font-semibold text-[var(--hv-blue)]">{logo.name}</span>;
  return (
    <span className="flex items-center gap-2.5">
      {logo.mark && <img src={logo.mark} alt="" className="h-9 w-auto sm:h-10" />}
      {logo.wordmark && <img src={logo.wordmark} alt="" className="h-5 w-auto sm:h-6" />}
    </span>
  );
}

/** The stacked logo for the footer, on a white tile so the colours hold on blue. */
export function StackedLogo({ logo }: { logo: LogoSet }) {
  if (!logo.stacked) return null;
  return (
    <span className="inline-flex rounded-2xl bg-white px-[22px] py-[18px]">
      <img src={logo.stacked} alt={logo.name ?? ""} className="h-24 w-auto" />
    </span>
  );
}
