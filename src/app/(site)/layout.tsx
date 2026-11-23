import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#inhoud"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-soos-ink"
      >
        Ga naar de inhoud
      </a>
      <SiteHeader />
      <main id="inhoud" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
