"use client";

import { useTransition } from "react";
import { buttonDanger } from "./ui";

/**
 * Verwijderknop met bevestiging. `action` is een server action die al aan
 * het juiste id is gebonden.
 */
export function DeleteButton({
  action,
  confirmText,
  label = "Verwijderen",
}: {
  action: () => Promise<void>;
  confirmText: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className={buttonDanger}
      onClick={() => {
        if (!window.confirm(confirmText)) return;
        startTransition(() => action());
      }}
    >
      {pending ? "Bezig…" : label}
    </button>
  );
}
