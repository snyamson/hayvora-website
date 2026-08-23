"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ScrollProgress } from "@/components/ui/Motion";
import { EASE_OUT } from "@/components/ui/Motion";

export type NavItem = { label: string; href: string };

/**
 * The site header. Rendered identically by both route groups — Holdings and every
 * subsidiary — with the same nav, the same Hayvora logo and the same CTA shape, so the
 * chrome never changes as visitors move between divisions.
 */
export function Header({
  homeHref = "/",
  navItems,
  ctaLabel = "Contact Us",
  ctaHref,
}: {
  homeHref?: string;
  navItems: NavItem[];
  ctaLabel?: string;
  ctaHref: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  // The menu stores *which route it was opened on* rather than a plain boolean. A
  // navigation changes `pathname`, so the menu closes on its own — including on browser
  // back/forward, which an onClick handler never sees — with no effect syncing state.
  const [openedOnPath, setOpenedOnPath] = useState<string | null>(null);
  const menuOpen = openedOnPath === pathname;
  const setMenuOpen = (open: boolean) => setOpenedOnPath(open ? pathname : null);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Hide on the way down, bring it straight back on the way up. The 8px threshold
      // stops the bar flickering on trackpads, which emit tiny alternating deltas.
      if (y > 140 && y > lastY + 8) setHidden(true);
      else if (y < lastY - 8) setHidden(false);
      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      // rAF-throttled: the scroll event fires far more often than the screen refreshes.
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      // Sets the underlying state directly: `setMenuOpen` is re-created every render,
      // so depending on it here would re-run this effect on each one.
      if (e.key === "Escape") setOpenedOnPath(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => {
    // In-page anchors ("/#divisions") never take the active style — they're a jump
    // within a page, not a destination.
    if (href.includes("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-140%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        className="fixed inset-x-0 top-3 z-50 px-4 sm:top-4"
      >
        <div
          className={`relative mx-auto flex items-center justify-between gap-4 rounded-full pr-2.5 pl-4 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] sm:pr-3 sm:pl-6 ${
            scrolled
              ? "max-w-5xl bg-white/85 py-2 shadow-lift backdrop-blur-xl backdrop-saturate-150"
              : "max-w-6xl bg-white py-2.5 shadow-soft"
          }`}
        >
          <Link
            href={homeHref}
            className="flex shrink-0 items-center transition-transform duration-300 hover:scale-[1.03]"
            onClick={() => setMenuOpen(false)}
          >
            <Logo
              markClassName="h-8 w-auto sm:h-9"
              wordmarkClassName="hidden h-4 w-auto sm:block sm:h-[1.1rem]"
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                    active ? "text-brand-primary" : "text-brand-primary/65 hover:text-brand-primary"
                  }`}
                >
                  {/* Shared layoutId slides one pill between items instead of fading a
                      separate highlight in and out under each. */}
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-brand-primary/8"
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Button href={ctaHref} variant="secondary" size="sm" className="hidden sm:inline-flex">
              {ctaLabel}
            </Button>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-11 w-11 shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full transition-colors hover:bg-brand-primary/8 md:hidden"
            >
              <span
                className={`block h-0.5 w-5 rounded-full bg-brand-primary transition-transform duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-brand-primary transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-brand-primary transition-transform duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </div>

          {/* Reading progress, tucked inside the pill's lower edge. */}
          <ScrollProgress className="absolute inset-x-6 bottom-0 h-px rounded-full bg-brand-secondary" />
        </div>
      </motion.header>

      {/* Mobile menu — full sheet, staggered items. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-brand-primary/25 backdrop-blur-sm"
            />

            <motion.nav
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="hv-grid-bg absolute inset-x-4 top-20 overflow-hidden rounded-card bg-white p-6 shadow-float"
            >
              <div className="flex flex-col">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.06 + i * 0.06, ease: EASE_OUT }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`font-display flex items-center justify-between border-b border-brand-line-soft py-4 text-lg font-bold tracking-tight transition-colors ${
                        isActive(item.href) ? "text-brand-secondary" : "text-brand-primary hover:text-brand-secondary"
                      }`}
                    >
                      {item.label}
                      <span className="text-brand-primary/30">↗</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 + navItems.length * 0.06, ease: EASE_OUT }}
                className="mt-6"
              >
                <Button href={ctaHref} variant="secondary" size="md" withArrow className="w-full">
                  {ctaLabel}
                </Button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
