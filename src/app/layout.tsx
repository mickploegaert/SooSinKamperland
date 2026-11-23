import type { Metadata } from "next";
import { Fredoka, Poppins } from "next/font/google";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

// Cookievrije bezoekersstatistiek. Alleen actief als dit domein is ingesteld.
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className={`${poppins.variable} ${fredoka.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-soos-ink antialiased">
        <a
          href="#inhoud"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-soos-ink"
        >
          Ga naar de inhoud
        </a>
        <SiteHeader />
        <main id="inhoud" className="page-enter flex flex-1 flex-col">
          {children}
        </main>
        <SiteFooter />
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
