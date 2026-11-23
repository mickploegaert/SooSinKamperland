import { ArrowRight, ExternalLink, LoaderCircle } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "light" | "ghost" | "glow";
type Size = "md" | "sm";

const base =
  "group/btn inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition duration-200 focus-visible:outline-offset-4 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none motion-reduce:active:scale-100";

const variants: Record<Variant, string> = {
  primary:
    "bg-soos-purple text-white shadow-lg shadow-soos-purple/25 hover:bg-soos-purple-hover hover:shadow-xl hover:shadow-soos-purple/30",
  secondary:
    "bg-white text-soos-dark ring-1 ring-inset ring-soos-dark/15 hover:bg-soos-mist hover:ring-soos-purple/40",
  light: "bg-white text-soos-dark shadow-lg shadow-black/20 hover:bg-soos-mist",
  ghost: "text-white ring-1 ring-inset ring-white/30 hover:bg-white/10",
  glow: "bg-soos-glow text-white shadow-lg shadow-black/25 hover:bg-[#9a63e8]",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-sm sm:text-base",
  sm: "px-4 py-2 text-sm",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}

const arrowClass =
  "size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 motion-reduce:transition-none";

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  arrow = false,
  children,
  className = "",
  ...props
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href">) {
  const external = /^https?:\/\//.test(href);
  const content = (
    <>
      {children}
      {external ? (
        <>
          <ExternalLink aria-hidden className="size-4" />
          <span className="sr-only">(opent in een nieuw tabblad)</span>
        </>
      ) : arrow ? (
        <ArrowRight aria-hidden className={arrowClass} />
      ) : null}
    </>
  );
  const classes = `${buttonClass(variant, size)} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  );
}

export function SubmitButton({
  pending,
  children,
  pendingLabel,
}: {
  pending: boolean;
  children: ReactNode;
  pendingLabel: string;
}) {
  return (
    <button type="submit" disabled={pending} className={`${buttonClass("primary")} w-full sm:w-auto`}>
      {pending ? (
        <>
          <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
          {pendingLabel}
        </>
      ) : (
        <>
          {children}
          <ArrowRight aria-hidden className={arrowClass} />
        </>
      )}
    </button>
  );
}

/** Tekstlink met pijl, voor "Alle … →"-verwijzingen. */
export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group/btn inline-flex items-center gap-1.5 text-sm font-semibold text-soos-dark underline decoration-soos-purple/40 underline-offset-4 transition hover:text-soos-purple hover:decoration-soos-purple"
    >
      {children}
      <ArrowRight aria-hidden className={arrowClass} />
    </Link>
  );
}
