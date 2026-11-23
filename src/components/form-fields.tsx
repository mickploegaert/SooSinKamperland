import type { ReactNode } from "react";

export const inputClass =
  "mt-2 block w-full rounded-xl border border-soos-dark/15 bg-white px-4 py-3 text-base text-soos-ink shadow-sm transition placeholder:text-soos-ink/65 focus:border-soos-purple focus:outline-none focus:ring-4 focus:ring-soos-purple/15 aria-[invalid=true]:border-red-600 aria-[invalid=true]:ring-red-600/10";

export function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-soos-dark">
        {label}
        {hint ? <span className="ml-2 font-normal text-soos-ink/70">{hint}</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-fout`} className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Verborgen lokveld voor bots: mensen zien en vullen dit niet in. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="website">Laat dit veld leeg</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function SuccessMessage({ title, message }: { title: string; message?: string }) {
  return (
    <div
      role="status"
      className="flex h-full flex-col items-center justify-center rounded-card bg-soos-mist px-6 py-14 text-center"
    >
      <h2 className="text-2xl font-bold text-soos-dark">{title}</h2>
      {message ? <p className="mt-2 max-w-sm text-base text-soos-ink/85">{message}</p> : null}
    </div>
  );
}

export function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
    >
      {message}
    </p>
  );
}
