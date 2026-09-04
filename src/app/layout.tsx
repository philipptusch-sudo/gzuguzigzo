import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { experimentConfig } from "@/config/experiment";
import "./globals.css";

/*
 * Fonts are downloaded at build time and served from our own origin by
 * next/font. The browser never contacts a font CDN at runtime.
 */
const heading = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["400", "600"],
});

const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const { brand } = experimentConfig;

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — ${brand.claim}`,
    template: `%s | ${brand.name}`,
  },
  description:
    "Reisegepäck von Kofferwerk Auenfels: Handgepäck, Reisekoffer, Koffersets und Business-Trolleys.",
  applicationName: brand.name,
  // The shop must not become organically findable. The reveal page at
  // /experiment overrides this and stays indexable.
  robots: { index: false, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#16233a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${heading.variable} ${body.variable}`}>
      <body className="bg-cream-100 text-ink-900 min-h-dvh antialiased">{children}</body>
    </html>
  );
}
