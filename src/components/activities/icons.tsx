export function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`fill-none stroke-current ${className}`}>
      <circle cx="8" cy="8" r="6.25" strokeWidth="1.5" />
      <path d="M8 4.75V8l2.25 1.5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`fill-none stroke-current ${className}`}>
      <path d="M8 14.5s4.75-4.2 4.75-8a4.75 4.75 0 0 0-9.5 0c0 3.8 4.75 8 4.75 8Z" strokeWidth="1.5" />
      <circle cx="8" cy="6.5" r="1.75" strokeWidth="1.5" />
    </svg>
  );
}
