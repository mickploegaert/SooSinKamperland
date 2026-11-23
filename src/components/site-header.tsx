"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MainNav } from "@/components/main-nav";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-soos-dark text-white transition-shadow duration-300 ${
        scrolled ? "shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)]" : "shadow-none"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 transition-[padding] duration-300 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center gap-3 rounded-full">
          <Image
            src="/soos.png"
            alt=""
            width={48}
            height={48}
            priority
            className={`rounded-full bg-white object-cover transition-[width,height] duration-300 ${
              scrolled ? "size-10" : "size-12"
            }`}
          />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold sm:text-base">Soos in Kamperland</span>
            <span className="hidden text-[0.7rem] font-medium uppercase tracking-[0.2em] text-white/60 sm:block">
              Jong &amp; oud welkom
            </span>
          </span>
        </Link>
        <MainNav />
      </div>
    </header>
  );
}
