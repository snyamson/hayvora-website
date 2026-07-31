import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

// Both are variable fonts, so no `weight` is declared — the full 100–900 axis is
// available and Tailwind's font-medium/semibold/bold all resolve to real weights.
// Fallbacks are metrically close so the swap-in doesn't shift layout.
const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  // metadataBase makes every relative OG/canonical URL below resolve to an absolute one.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Construction, Surveying & Agricultural Systems in Ghana`,
    // Child pages set only their own title; this appends the brand automatically.
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "construction company Ghana",
    "civil engineering Ghana",
    "architectural construction Accra",
    "land surveying Ghana",
    "drone mapping Ghana",
    "geotechnical investigation",
    "GIS consulting West Africa",
    "greenhouse construction Ghana",
    "smart irrigation",
    "property listings Ghana",
    "Hayvora Holdings",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GH",
    url: SITE_URL,
    title: `${SITE_NAME} — Construction, Surveying & Agricultural Systems in Ghana`,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "Construction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
