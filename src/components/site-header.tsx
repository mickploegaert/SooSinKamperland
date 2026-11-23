import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-soos-dark/95 text-white backdrop-blur supports-[backdrop-filter]:bg-soos-dark/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-3 rounded-full">
          <Image
            src="/soos.png"
            alt=""
            width={48}
            height={48}
            priority
            className="size-11 rounded-full bg-white object-cover sm:size-12"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base font-bold sm:text-lg">Soos in Kamperland</span>
            <span className="hidden text-[0.7rem] font-medium uppercase tracking-[0.2em] text-white/70 sm:block">
              Jong &amp; oud welkom
            </span>
          </span>
        </Link>
        <MainNav />
      </div>
    </header>
  );
}
