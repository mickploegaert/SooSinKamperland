import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Beheerder inloggen",
  robots: { index: false },
};

export default async function LoginPage({ searchParams }: PageProps<"/inloggen">) {
  const loggedOut = (await searchParams).uitgelogd === "1";

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-gradient-to-r from-[#131232] to-soos-plum px-4 py-12">
      <div className="w-full max-w-[440px] rounded-2xl bg-white px-8 pb-14 pt-8 shadow-2xl shadow-black/20 sm:px-12">
        <div className="flex justify-center">
          <Link href="/" aria-label="Naar de website van Soos in Kamperland">
            <BrandMark tone="dark" />
          </Link>
        </div>
        <h1 className="mt-8 text-center text-3xl font-bold text-soos-navy">Welkom terug</h1>
        <p className="mt-2 text-center text-sm text-soos-muted">
          Log in op het beheerdersdashboard
        </p>
        {loggedOut ? (
          <p
            role="status"
            className="mt-6 rounded-lg border border-soos-income/30 bg-soos-income-soft px-4 py-3 text-center text-sm font-semibold text-soos-income"
          >
            Je bent uitgelogd.
          </p>
        ) : null}
        <LoginForm />
      </div>
    </main>
  );
}
