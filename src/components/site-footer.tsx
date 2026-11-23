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
            <p>
              {contactInfo.street}
              <br />
              {contactInfo.postalCode} {contactInfo.city}
            </p>
            <p>
              <a href={`mailto:${contactInfo.email}`} className="hover:underline">
                {contactInfo.email}
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/60">
          &copy; {new Date().getFullYear()} Soos in Kamperland
        </p>
      </div>
    </footer>
  );
}
