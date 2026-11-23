import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { logout } from "@/lib/actions/auth";
import type { AdminProfile } from "@/lib/data/types";

export function DashboardTopbar({ admin }: { admin: AdminProfile }) {
  return (
    <header className="focus-light flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-soos-navy px-6 py-4 text-white">
      <Link href="/dashboard" aria-label="Naar het dashboard">
        <BrandMark tone="light" />
      </Link>
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold sm:gap-5">
        <Link href="/dashboard" className="rounded-md px-1 py-1 hover:text-white/80">
          Dashboard
        </Link>
        <Link href="/" className="rounded-md px-1 py-1 hover:text-white/80">
          Website bekijken
        </Link>
        <span className="hidden text-xs font-normal text-white/60 md:inline" title={admin.email}>
          Ingelogd als {admin.username}
        </span>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg bg-soos-violet px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-soos-violet-hover"
          >
            Uitloggen
          </button>
        </form>
      </div>
    </header>
  );
}
