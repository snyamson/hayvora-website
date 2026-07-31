import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * robots.txt already disallows /studio, but a Disallow only stops crawling — a URL
 * linked from elsewhere can still be indexed without content. This noindex header is
 * what actually keeps the CMS out of search results.
 */
export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false, nocache: true },
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return children;
}
