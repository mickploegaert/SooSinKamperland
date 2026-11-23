import Image from "next/image";
import Link from "next/link";
import { mainNavigation } from "@/lib/navigation";
import { SocialIcons } from "@/components/social-icons";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-soos-dark text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-start md:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/soos.png"
            alt=""
            width={48}
            height={48}
            className="size-12 rounded-full bg-white object-cover"
          />
          <span className="text-base font-bold">Soos in Kamperland</span>
        </Link>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SocialIcons />
      </div>
    </footer>
  );
}
