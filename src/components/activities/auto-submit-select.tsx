"use client";

/** Keuzelijst die het filterformulier direct verstuurt bij een wijziging. */
export function AutoSubmitSelect({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <label className="relative inline-flex">
      <span className="sr-only">{label}</span>
      <select
        name={name}
        defaultValue={value}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="h-10 appearance-none rounded-lg border border-soos-line bg-soos-surface py-0 pl-3.5 pr-9 text-sm font-semibold text-soos-navy hover:border-soos-violet/40 focus:border-soos-violet focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 fill-none stroke-soos-navy stroke-2"
      >
        <path d="m3 4.5 3 3 3-3" />
      </svg>
    </label>
  );
}
