import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sanity Studio (and its swr/styled-components dependency chain) isn't RSC-aware;
  // keep it out of Next's server module graph so it resolves via normal Node
  // conditions instead of the "react-server" export condition.
  serverExternalPackages: ["sanity", "@sanity/vision"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    // Logos are uploaded as SVG in Studio; Next blocks SVG optimization by default.
    // Safe here since the only source is our own Sanity project, not arbitrary uploads.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
