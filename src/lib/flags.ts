/** Feature flags. Ads ship OFF; flip via env at build time only. */
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
