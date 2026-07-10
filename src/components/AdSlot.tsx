"use client";

import { useEffect } from "react";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/flags";

/** Responsive AdSense unit. Renders nothing unless both NEXT_PUBLIC_ADS_ENABLED
 *  and NEXT_PUBLIC_ADSENSE_CLIENT are set at build time. min-height reserves
 *  space so enabling ads causes no layout shift. `slot` is the numeric AdSense
 *  ad-unit id — placeholder names are fine while the flag is off. */
export function AdSlot({ slot }: { slot: string }) {
  useEffect(() => {
    if (!ADS_ENABLED || !ADSENSE_CLIENT) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // adsbygoogle throws if the slot is already filled — harmless
    }
  }, []);

  if (!ADS_ENABLED || !ADSENSE_CLIENT) return null;
  return (
    <ins
      className="adsbygoogle my-4 block min-h-24"
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
