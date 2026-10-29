"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, type ReactNode } from "react";

import { Minus, Plus } from "./Icons";

export type AccordionItem = {
  key: string;
  title: string;
  /** Everything shown under the title when the item is open. */
  body: ReactNode;
  imageUrl?: string;
  imageAlt?: string;
};

/**
 * EllisDon's numbered accordion: closed rows show the number, title and a blue plus;
 * the open row shows a large number, the content and a photo with the minus button.
 */
export function NumberedAccordion({
  items,
  closeLabel,
  openLabel,
}: {
  items: AccordionItem[];
  closeLabel?: string;
  openLabel?: string;
}) {
  const [open, setOpen] = useState(0);
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const num = String(i + 1).padStart(2, "0");
        if (i === open) {
          return (
            <div
              key={item.key}
              className={`grid gap-6 rounded-[20px] bg-white p-4 ${item.imageUrl ? "lg:grid-cols-2" : ""}`}
            >
              <div className="relative flex flex-col px-4 pt-2 pb-6">
                <div className="text-[clamp(64px,7vw,96px)] leading-[0.9] font-bold tracking-[-0.04em] text-[var(--hv-blue)]">
                  {num}
                </div>
                {!item.imageUrl && (
                  <button
                    type="button"
                    className="hv-round absolute top-2 right-2"
                    aria-label={closeLabel}
                    aria-expanded
                    onClick={() => setOpen(-1)}
                  >
                    <Minus />
                  </button>
                )}
                <h3 className="mt-7 text-[32px] leading-[1.05] font-bold tracking-[-0.04em] text-[var(--hv-blue)]">
                  {item.title}
                </h3>
                {item.body}
              </div>
              {item.imageUrl && (
                <div className="relative min-h-[345px] overflow-hidden rounded-2xl">
                  <img src={item.imageUrl} alt={item.imageAlt ?? ""} className="absolute inset-0 h-full w-full object-cover" />
                  <button
                    type="button"
                    className="hv-round absolute top-3 right-3"
                    aria-label={closeLabel}
                    aria-expanded
                    onClick={() => setOpen(-1)}
                  >
                    <Minus />
                  </button>
                </div>
              )}
            </div>
          );
        }
        return (
          <button
            key={item.key}
            type="button"
            className="hv-acc"
            aria-expanded={false}
            aria-label={openLabel ? `${openLabel}: ${item.title}` : undefined}
            onClick={() => setOpen(i)}
          >
            <span className="text-[32px] leading-none font-bold tracking-[-0.02em] text-[#7d8790]">{num}</span>
            <span className="text-[clamp(22px,2.3vw,32px)] leading-[1.05] font-bold tracking-[-0.04em] text-[var(--hv-blue)]">
              {item.title}
            </span>
            <span className="hv-round ml-auto" aria-hidden>
              <Plus />
            </span>
          </button>
        );
      })}
    </div>
  );
}
