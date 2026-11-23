"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} noValidate className="mt-9 space-y-5">
      {state.message ? (
        <p
          role="alert"
          className="rounded-lg border border-soos-expense/30 bg-soos-expense-soft px-4 py-3 text-sm font-semibold text-soos-expense"
        >
          {state.message}
        </p>
      ) : null}

      <div>
        <label htmlFor="identifier" className="block text-sm font-semibold text-soos-navy">
          E-mailadres of gebruikersnaam
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          placeholder="beheerder@voorbeeld.nl"
          defaultValue={state.identifier}
          aria-invalid={state.fieldErrors?.identifier ? true : undefined}
          aria-describedby={state.fieldErrors?.identifier ? "identifier-fout" : undefined}
          className="mt-2 block h-11 w-full rounded-md border border-soos-line bg-soos-mist px-3 text-sm text-soos-navy placeholder:text-soos-muted/70 focus:border-soos-violet focus:outline-none aria-invalid:border-soos-expense"
        />
        {state.fieldErrors?.identifier ? (
          <p id="identifier-fout" className="mt-1.5 text-xs font-semibold text-soos-expense">
            {state.fieldErrors.identifier}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-soos-navy">
          Wachtwoord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          aria-invalid={state.fieldErrors?.password ? true : undefined}
          aria-describedby={state.fieldErrors?.password ? "password-fout" : undefined}
          className="mt-2 block h-11 w-full rounded-md border border-soos-line bg-soos-mist px-3 text-sm text-soos-navy placeholder:text-soos-muted/70 focus:border-soos-violet focus:outline-none aria-invalid:border-soos-expense"
        />
        {state.fieldErrors?.password ? (
          <p id="password-fout" className="mt-1.5 text-xs font-semibold text-soos-expense">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-3 flex h-12 w-full items-center justify-center rounded-lg bg-soos-violet text-sm font-semibold text-white transition-colors hover:bg-soos-violet-hover disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Bezig met inloggen…" : "Inloggen"}
      </button>
    </form>
  );
}
