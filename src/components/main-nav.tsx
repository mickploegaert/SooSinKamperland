"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/button";
import { isCurrentPage, mainNavigation } from "@/lib/navigation";

export function MainNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="hidden items-center gap-2 lg:flex">
        <nav
          aria-label="Hoofdmenu"
          className="flex items-center gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10"
        >
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrentPage(pathname, item.href) ? "page" : undefined}
              className="rounded-full px-3 py-2 text-sm font-semibold text-white/80 focus-visible:ring-2 focus-visible:ring-soos-accent focus-visible:outline-none xl:px-4 transition hover:bg-white/10 hover:text-white aria-[current=page]:bg-white aria-[current=page]:text-soos-dark aria-[current=page]:shadow-sm motion-reduce:transition-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <ButtonLink href="/sponsoren#vrienden" variant="glow" size="sm" className="ml-2" arrow>
          Word sponsor
        </ButtonLink>
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full ring-1 ring-inset ring-white/30 transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-soos-accent focus-visible:outline-none"
          aria-expanded={open}
          aria-controls="mobiel-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          <span className="sr-only">{open ? "Menu sluiten" : "Menu openen"}</span>
        </button>
        {open ? (
          <nav
            id="mobiel-menu"
            aria-label="Mobiel menu"
            className="absolute inset-x-0 top-full border-t border-white/10 bg-soos-dark px-4 pb-6 pt-4 shadow-[0_24px_32px_-16px_rgba(0,0,0,0.6)] motion-safe:animate-[menu-in_200ms_ease-out]"
          >
            <ul className="mx-auto flex max-w-6xl flex-col gap-1">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrentPage(pathname, item.href) ? "page" : undefined}
                    className="block rounded-xl px-4 py-3 text-base focus-visible:ring-2 focus-visible:ring-soos-accent focus-visible:outline-none font-semibold text-white/85 transition hover:bg-white/10 aria-[current=page]:bg-white aria-[current=page]:text-soos-dark"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-3">
                <ButtonLink
                  href="/sponsoren#vrienden"
                  variant="glow"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Word sponsor
                </ButtonLink>
              </li>
            </ul>
          </nav>
        ) : null}
      </div>
    </>
  );
}
