/** Feature flags. Ads ship OFF; flip via env at build time only. */
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
/** AdSense publisher id (ca-pub-…). Both this and ADS_ENABLED must be set for
 *  any ad code to render. LAUNCH: enable Google's certified CMP in the AdSense
 *  dashboard (EEA consent) before flipping the flag. */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
