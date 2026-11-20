import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-soos-dark text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-3 rounded-full">
          <Image
            src="/soos.png"
            alt=""
            width={48}
            height={48}
            priority
            className="size-12 rounded-full bg-white object-cover"
          />
          <span className="text-sm font-bold leading-tight sm:text-base">
            Soos in Kamperland
          </span>
        </Link>
        <MainNav />
      </div>
    </header>
  );
}
