import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { HeaderShell } from "@/components/header-shell";
import { MainNav } from "@/components/main-nav";
import { formatActivityDate, formatWeekday } from "@/lib/activities";
import { upcomingActivities } from "@/lib/public-activities";

/** De eerstvolgende activiteit voor het belletje bovenaan; de header werkt ook zonder. */
async function loadNextActivity() {
  await connection();
  try {
    return (await upcomingActivities())[0] ?? null;
  } catch (error) {
    console.error("Eerstvolgende activiteit kon niet worden geladen", error);
    return null;
  }
}

export async function SiteHeader() {
  const next = await loadNextActivity();

  return (
    <HeaderShell>
      {next ? (
        <div className="hidden border-b border-white/10 bg-black/20 sm:block">
          <p className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-1.5 text-xs text-white/80">
            <span className="font-semibold uppercase tracking-[0.18em] text-white/60">Volgende</span>
            <Link
              href="/agenda"
              className="inline-flex items-center gap-1.5 rounded font-semibold text-white hover:underline focus-visible:ring-2 focus-visible:ring-soos-accent focus-visible:outline-none"
            >
              {next.name}
              <span className="font-normal capitalize text-white/80">
                · {formatWeekday(next.date)} {formatActivityDate(next.date).replace(/ \d{4}$/, "")}
              </span>
              <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          </p>
        </div>
      ) : null}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 rounded-full focus-visible:ring-2 focus-visible:ring-soos-accent focus-visible:ring-offset-2 focus-visible:ring-offset-soos-dark focus-visible:outline-none"
        >
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
    </HeaderShell>
  );
}
