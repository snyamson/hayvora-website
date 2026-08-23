"use client";

/**
 * Scrolls the page back to the top. A button rather than an `#top` anchor so it doesn't
 * push a history entry, and so reduced-motion visitors get an instant jump instead of a
 * long smooth scroll they didn't ask for.
 */
export function BackToTop() {
  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      className="group flex cursor-pointer items-center gap-2 text-xs font-semibold text-brand-ink/55 transition-colors hover:text-brand-primary"
    >
      Back to top
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-line transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-primary group-hover:bg-brand-primary group-hover:text-white">
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
          <path
            d="M8 13V3M4 7l4-4 4 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
