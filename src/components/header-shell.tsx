"use client";

import { useEffect, useRef, useState } from "react";

/**
 * De vaste balk bovenaan. Schuift weg bij omlaag scrollen en komt terug bij omhoog
 * scrollen, zodat er op kleine schermen meer ruimte is om te lezen. Hij blijft staan
 * zolang er focus in de balk zit (bijvoorbeeld bij een open mobiel menu of toetsenbord).
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < 8) return;
      if (ref.current?.matches(":focus-within")) {
        setHidden(false);
      } else {
        setHidden(delta > 0 && y > 120);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={ref}
      onFocusCapture={() => setHidden(false)}
      className={`sticky top-0 z-40 border-b border-white/10 bg-soos-dark/95 text-white backdrop-blur transition-transform duration-300 supports-[backdrop-filter]:bg-soos-dark/85 motion-reduce:transition-none ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {children}
    </header>
  );
}
