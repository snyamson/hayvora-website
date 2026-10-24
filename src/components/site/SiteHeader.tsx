"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { DivisionLink, LogoSet, ProjectLink } from "@/lib/chrome";
import type { SiteSettingsDoc } from "@/types/sanity";
import { ArrowButton } from "./Actions";
import { ArrowRight } from "./Icons";
import { SiteLogo } from "./SiteLogo";

type Props = {
  logo: LogoSet;
  header: SiteSettingsDoc["header"];
  menu: SiteSettingsDoc["divisionsMenu"];
  ctaHref?: string;
  divisions: DivisionLink[];
  projects: ProjectLink[];
};

/**
 * EllisDon's floating white header card, so the colour logo always sits on white.
 * The nav pill and the Divisions mega menu follow Bechtel: green pill on hover, panel
 * opening under the card with a short delay so a passing cursor doesn't trigger it.
 */
export function SiteHeader({ logo, header, menu, ctaHref, divisions, projects }: Props) {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navItems = (header?.navItems ?? []).filter((n) => n.label && n.href);
  const cta = header?.cta?.label ? { label: header.cta.label, href: ctaHref ?? header.cta.href } : undefined;

  // Close both menus after navigating.
  const [shownPath, setShownPath] = useState(pathname);
  if (shownPath !== pathname) {
    setShownPath(pathname);
    setMegaOpen(false);
    setDrawerOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => setMegaOpen(true), 75);
  };
  const closeMega = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  const showPanel = megaOpen && !drawerOpen && divisions.length > 0;

  return (
    <>
      <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-1 bg-[var(--hv-green)]" />

      <div
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/35 backdrop-blur-[6px] transition-opacity duration-300 ${
          showPanel || drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => {
          setMegaOpen(false);
          setDrawerOpen(false);
        }}
      />

      <header
        className="fixed inset-x-3 top-3 z-50 mx-auto max-w-[1392px] overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(16,24,40,0.14)] sm:inset-x-6 sm:top-6"
        onMouseLeave={closeMega}
      >
        <div className="flex h-[72px] items-center justify-between gap-4 pr-3 pl-5 sm:h-20 sm:pr-4 sm:pl-6">
          <Link href="/" aria-label={logo.name} className="shrink-0">
            <SiteLogo logo={logo} />
          </Link>

          <nav className="hv-nav hidden items-center gap-1 lg:flex" aria-label={header?.openMenuLabel}>
            {navItems.map((item) =>
              item.opensDivisionsMenu ? (
                <Link
                  key={item._key}
                  href={item.href!}
                  data-open={showPanel}
                  aria-expanded={showPanel}
                  onMouseEnter={openMega}
                  onFocus={() => setMegaOpen(true)}
                >
                  {item.label}
                </Link>
              ) : (
                <Link key={item._key} href={item.href!} onMouseEnter={closeMega}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2.5">
            {cta?.href && (
              <Link href={cta.href} className="hv-hbtn max-sm:hidden">
                {cta.label}
                <ArrowRight />
              </Link>
            )}
            <button
              type="button"
              className="hv-burger"
              aria-expanded={drawerOpen}
              aria-label={drawerOpen ? header?.closeMenuLabel : header?.openMenuLabel}
              onClick={() => setDrawerOpen((v) => !v)}
            >
              <span className={drawerOpen ? "translate-y-[7px] rotate-45" : ""} />
              <span className={drawerOpen ? "opacity-0" : ""} />
              <span className={drawerOpen ? "-translate-y-[7px] -rotate-45" : ""} />
            </button>
          </div>
        </div>

        {/* Divisions mega menu */}
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            showPanel ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
          onMouseEnter={openMega}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="border-t border-[#e3ece7]">
              <div className="grid grid-cols-[360px_minmax(0,1fr)]">
                <div className="flex flex-col bg-[var(--hv-green)] px-9 py-10 text-white">
                  {menu?.eyebrow && <p className="hv-mono text-[13px] leading-[18px] text-white/80">{menu.eyebrow}</p>}
                  {menu?.heading && <h2 className="mt-4 text-2xl leading-[31.2px] font-semibold">{menu.heading}</h2>}
                  {menu?.body && <p className="mt-4 text-sm leading-[21px] text-white/90">{menu.body}</p>}
                  <div className="mt-auto pt-7">
                    <ArrowButton link={menu?.cta} invert />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-8 px-10 pt-10 pb-9">
                  {divisions.map((d) => (
                    <Link key={d.slug} href={`/${d.slug}`} className="group block text-[var(--hv-ink)]">
                      <div className="hv-zoom h-[140px] bg-[var(--hv-tint)]">
                        {d.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={d.imageUrl} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <h3 className="mt-5 text-[17.6px] leading-[24.2px] font-semibold transition-colors duration-300 group-hover:text-[var(--hv-green)]">
                        {d.name}
                      </h3>
                      {d.tagline && (
                        <p className="hv-mono mt-1.5 text-xs leading-[18px] text-[var(--hv-green)]">{d.tagline}</p>
                      )}
                      {d.description && <p className="mt-2.5 text-sm leading-[21px] text-[#30454c]">{d.description}</p>}
                    </Link>
                  ))}
                </div>
              </div>
              {projects.length > 0 && (
                <div className="bg-[#f4f7f5] px-10 pt-7 pb-8">
                  <div className="flex items-center justify-between">
                    {menu?.featuredHeading && (
                      <p className="hv-mono text-[13.6px] leading-[13.6px] text-[#30454c]">{menu.featuredHeading}</p>
                    )}
                    {menu?.featuredLink?.label && menu.featuredLink.href && (
                      <Link
                        href={menu.featuredLink.href}
                        className="hv-mono text-xs tracking-[0.025em] text-[var(--hv-green)] hover:text-[var(--hv-green-dark)]"
                      >
                        {menu.featuredLink.label}
                      </Link>
                    )}
                  </div>
                  <div className="mt-5 grid grid-cols-4 gap-6">
                    {projects.slice(0, 4).map((p) => (
                      <Link key={p.href} href={p.href} className="group flex items-center gap-4 text-[var(--hv-ink)]">
                        <div className="hv-zoom h-[72px] w-[72px] shrink-0 rounded-md bg-[var(--hv-tint)]">
                          {p.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <span className="text-base leading-6 transition-colors duration-300 group-hover:text-[var(--hv-green)]">
                          {p.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full menu from the burger; the only menu on phones */}
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            drawerOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="max-h-[calc(100svh-120px)] overflow-y-auto border-t border-[#e3ece7] px-5 pt-4 pb-8 sm:px-8">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                <nav className="flex flex-col">
                  {navItems.map((item) => (
                    <Link
                      key={item._key}
                      href={item.href!}
                      className="flex items-center justify-between border-b border-[#e3ece7] py-4 text-2xl text-[var(--hv-blue)] transition-colors hover:text-[var(--hv-green)]"
                    >
                      {item.label}
                      <ArrowRight />
                    </Link>
                  ))}
                  {cta?.href && (
                    <div className="mt-8">
                      <ArrowButton link={cta} />
                    </div>
                  )}
                </nav>
                {divisions.length > 0 && (
                  <div>
                    {menu?.eyebrow && <p className="hv-mono text-[13px] text-[var(--hv-muted)]">{menu.eyebrow}</p>}
                    <div className="mt-4 grid gap-6 sm:grid-cols-3">
                      {divisions.map((d) => (
                        <Link key={d.slug} href={`/${d.slug}`} className="group block text-[var(--hv-ink)]">
                          <div className="hv-zoom h-32 bg-[var(--hv-tint)]">
                            {d.imageUrl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={d.imageUrl} alt="" className="h-full w-full object-cover" />
                            )}
                          </div>
                          <h3 className="mt-4 text-lg font-semibold transition-colors group-hover:text-[var(--hv-green)]">
                            {d.name}
                          </h3>
                          {d.tagline && <p className="hv-mono mt-1 text-xs text-[var(--hv-green)]">{d.tagline}</p>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
