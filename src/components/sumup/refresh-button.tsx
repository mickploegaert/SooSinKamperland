"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { buttonSecondary } from "@/components/dashboard/ui";

/** Haalt de pagina opnieuw op, waardoor de nieuwste SumUp-transacties worden geladen. */
export function RefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
      className={`${buttonSecondary} disabled:cursor-wait disabled:opacity-70`}
    >
      {pending ? "Vernieuwen…" : "Vernieuwen"}
    </button>
  );
}
