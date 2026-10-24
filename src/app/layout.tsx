import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getSiteSettings } from "@/lib/content";
import { SITE_URL, ogImageUrl } from "@/lib/seo";

// Apfel Grotezk and Necto Mono, both SIL Open Font License from Collletttivo; the
// licence files sit next to the fonts. Apfel covers headings and body alike;
// globals.css points --font-display at it.
const apfel = localFont({
  src: [
    { path: "./fonts/ApfelGrotezk-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ApfelGrotezk-Mittel.woff2", weight: "600", style: "normal" },
    { path: "./fonts/ApfelGrotezk-Fett.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const necto = localFont({
  src: "./fonts/NectoMono-Regular.woff2",
  weight: "400",
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.companyName ?? settings?.title;
  const description = settings?.defaultSeo?.metaDescription;
  const homeTitle = [settings?.defaultSeo?.metaTitle ?? siteName, settings?.titleSuffix].filter(Boolean).join(" — ");
  const image = ogImageUrl(settings?.defaultSeo?.ogImage);

  return {
    // metadataBase makes every relative OG/canonical URL below resolve to an absolute one.
    metadataBase: new URL(SITE_URL),
    title: {
      default: homeTitle,
      // Child pages set only their own title; this appends the site name automatically.
      template: siteName ? `%s | ${siteName}` : "%s",
    },
    description,
    applicationName: siteName,
    authors: siteName ? [{ name: siteName, url: SITE_URL }] : undefined,
    creator: siteName,
    publisher: siteName,
    keywords: settings?.keywords,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName,
      locale: "en_GH",
      url: SITE_URL,
      title: homeTitle,
      description,
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
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
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${apfel.variable} ${necto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
