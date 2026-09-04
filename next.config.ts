import type { NextConfig } from "next";

/**
 * Security headers that never depend on the request.
 *
 * The Content-Security-Policy is deliberately NOT set here: it carries a
 * per-request nonce and is therefore emitted by `src/proxy.ts`. Setting it in
 * both places would make the browser enforce the intersection of two policies.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "autoplay=()",
      "camera=()",
      "display-capture=()",
      "encrypted-media=()",
      "fullscreen=(self)",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "midi=()",
      "payment=()",
      "usb=()",
      "interest-cohort=()",
    ].join(", "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // No `remotePatterns` are configured on purpose: every image must come from
  // the local `public/` directory. SVG optimisation is enabled because the
  // placeholder artwork in this repository is hand-written SVG that we control.
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'none'; style-src 'unsafe-inline'; sandbox;",
    formats: ["image/webp"],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
