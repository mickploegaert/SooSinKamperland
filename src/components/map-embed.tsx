"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import { buttonClass } from "@/components/button";

/**
 * Laadt de kaart pas na een klik, zodat Google geen gegevens van bezoekers
 * ontvangt voordat zij daarvoor kiezen.
 */
export function MapEmbed({ src, title }: { src: string; title: string }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        title={title}
        src={src}
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-80 w-full sm:h-[26rem]"
      />
    );
  }

  return (
    <div className="flex h-80 flex-col items-center justify-center gap-4 bg-soos-mist px-6 text-center sm:h-[26rem]">
      <span
        aria-hidden
        className="flex size-14 items-center justify-center rounded-full bg-white text-soos-purple shadow-sm"
      >
        <MapPin className="size-6" />
      </span>
      <p className="max-w-md text-sm leading-6 text-soos-ink/85">
        De kaart wordt getoond door Google Maps. Als je de kaart laadt, ontvangt Google je
        IP-adres.
      </p>
      <button type="button" onClick={() => setLoaded(true)} className={buttonClass("primary", "sm")}>
        Toon de kaart
      </button>
    </div>
  );
}
