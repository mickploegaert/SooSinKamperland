import { Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SocialIcons } from "@/components/social-icons";
import { contactInfo } from "@/lib/contact-info";
import { mainNavigation } from "@/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-soos-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/soos.png"
              alt=""
              width={48}
              height={48}
              className="size-12 rounded-full bg-white object-cover"
            />
            <span className="text-base font-bold">Soos in Kamperland</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/75">
            Dé plek voor jong en oud in Kamperland. Samen leuke activiteiten beleven.
          </p>
          <div className="mt-5">
            <SocialIcons />
          </div>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Pagina&apos;s
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/90 hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Contact
          </h2>
          <address className="mt-4 space-y-2 text-sm not-italic text-white/90">
            <p className="flex gap-3">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-soos-accent" />
              <span>
                {contactInfo.street}
                <br />
                {contactInfo.postalCode} {contactInfo.city}
              </span>
            </p>
            <p className="flex gap-3">
              <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-soos-accent" />
              <a href={`mailto:${contactInfo.email}`} className="hover:underline">
                {contactInfo.email}
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Soos in Kamperland</p>
          <Link href="/privacy" className="hover:text-white hover:underline">
            Privacyverklaring
          </Link>
        </div>
      </div>
    </footer>
  );
}
