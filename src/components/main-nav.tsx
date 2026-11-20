"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { isCurrentPage, mainNavigation } from "@/lib/navigation";

export function MainNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav aria-label="Hoofdmenu" className="hidden items-center gap-1 lg:flex">
        {mainNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isCurrentPage(pathname, item.href) ? "page" : undefined}
            className="rounded-full px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white aria-[current=page]:bg-white/15 aria-[current=page]:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="lg:hidden">
        <button
          type="button"
          className="rounded-full border border-white/30 px-3 py-2 text-sm font-semibold"
          aria-expanded={open}
          aria-controls="mobiel-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Sluiten" : "Menu"}
        </button>
        {open ? (
          <nav
            id="mobiel-menu"
            aria-label="Mobiel menu"
            className="absolute inset-x-0 top-full border-t border-white/10 bg-soos-dark px-4 py-4"
          >
            <ul className="mx-auto flex max-w-6xl flex-col gap-1">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrentPage(pathname, item.href) ? "page" : undefined}
                    className="block rounded-lg px-3 py-3 text-base font-semibold hover:bg-white/10 aria-[current=page]:bg-white/15"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </>
  );
}
