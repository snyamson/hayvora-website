"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type NavItem = { label: string; href: string };

export function Header({
  brandName,
  homeHref,
  logoUrl,
  navItems,
  ctaLabel = "Contact Us",
  ctaHref,
}: {
  brandName: string;
  homeHref: string;
  logoUrl?: string;
  navItems: NavItem[];
  ctaLabel?: string;
  ctaHref: string;
}) {
  const [shrink, setShrink] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      if (y < 40) {
        setShrink(false);
      } else if (y > lastY) {
        setShrink(true); // scrolling down -> shrink
      } else if (y < lastY) {
        setShrink(false); // scrolling up -> expand
      }
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-4 z-30 px-4">
      <div
        className={`mx-auto flex items-center justify-between gap-4 rounded-full bg-white py-2.5 pr-2.5 pl-5 shadow-lg shadow-brand-primary/15 transition-[max-width] duration-500 ease-out sm:pr-3 sm:pl-6 ${
          shrink ? "max-w-3xl" : "max-w-6xl"
        }`}
      >
        <Link href={homeHref} className="flex shrink-0 items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          {logoUrl ? (
            <Image src={logoUrl} alt={brandName} width={36} height={36} className="h-9 w-9" />
          ) : (
            <span className="font-display text-base font-bold tracking-tight text-brand-primary uppercase">
              {brandName}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-brand-primary/80 transition hover:text-brand-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={ctaHref}
          className="font-display hidden shrink-0 rounded-full bg-brand-secondary px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90 sm:block"
        >
          {ctaLabel}
        </Link>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`block h-0.5 w-5 bg-brand-primary transition-transform duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span className={`block h-0.5 w-5 bg-brand-primary transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span
            className={`block h-0.5 w-5 bg-brand-primary transition-transform duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="mx-auto mt-3 max-w-6xl rounded-card bg-white p-6 shadow-lg shadow-brand-primary/15 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-control px-3 py-3 text-base font-semibold text-brand-primary/80 transition hover:bg-brand-surface hover:text-brand-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href={ctaHref}
            onClick={() => setMenuOpen(false)}
            className="font-display mt-4 block rounded-full bg-brand-secondary px-6 py-3 text-center text-sm font-bold text-white transition hover:opacity-90"
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </header>
  );
}
