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
  parentLinkLabel,
  parentLinkHref,
  ctaLabel = "Contact Us",
  ctaHref,
}: {
  brandName: string;
  homeHref: string;
  logoUrl?: string;
  navItems: NavItem[];
  parentLinkLabel?: string;
  parentLinkHref?: string;
  ctaLabel?: string;
  ctaHref: string;
}) {
  const [shrink, setShrink] = useState(false);

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

  return (
    <header className="fixed inset-x-0 top-4 z-30 px-4">
      <div
        className={`mx-auto flex items-center justify-between gap-4 rounded-full bg-white py-2.5 pr-2.5 pl-5 shadow-lg shadow-brand-primary/15 transition-[max-width] duration-500 ease-out sm:pr-3 sm:pl-6 ${
          shrink ? "max-w-3xl" : "max-w-6xl"
        }`}
      >
        <Link href={homeHref} className="flex shrink-0 items-center gap-2.5">
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
          {parentLinkHref && (
            <Link
              href={parentLinkHref}
              className="text-xs font-semibold tracking-wide text-brand-primary/50 uppercase transition hover:text-brand-primary"
            >
              {parentLinkLabel ?? "Part of Hayvora Holdings"}
            </Link>
          )}
        </nav>

        <Link
          href={ctaHref}
          className="font-display shrink-0 rounded-full bg-brand-secondary px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
        >
          {ctaLabel}
        </Link>
      </div>
    </header>
  );
}
