type BrandMarkProps = {
  /** "light" = witte variant voor donkere achtergronden, "dark" = donkere variant voor lichte achtergronden. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Het beeldmerk uit de schermontwerpen: drie figuren met de naam ernaast.
 */
export function BrandMark({ tone = "dark", className = "" }: BrandMarkProps) {
  const color = tone === "light" ? "text-white" : "text-soos-navy";

  return (
    <span className={`inline-flex items-center gap-2 ${color} ${className}`}>
      <svg
        viewBox="0 0 40 28"
        aria-hidden="true"
        className="h-7 w-10 shrink-0 fill-current"
      >
        <circle cx="8" cy="6" r="4.2" />
        <circle cx="20" cy="4.6" r="4.6" />
        <circle cx="32" cy="6" r="4.2" />
        <path d="M1 27v-8.5a7 7 0 0 1 7-7h0a7 7 0 0 1 4.6 1.7A8.5 8.5 0 0 0 11.5 17v10Z" />
        <path d="M39 27v-8.5a7 7 0 0 0-7-7h0a7 7 0 0 0-4.6 1.7 8.5 8.5 0 0 1 1.1 3.8v10Z" />
        <path d="M12.5 27V18a7.5 7.5 0 0 1 15 0v9Z" />
      </svg>
      <span className="text-[11px] font-bold leading-tight">
        Soos in
        <br />
        Kamperland
      </span>
    </span>
  );
}
