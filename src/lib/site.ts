export const SITE_NAME = "The Perfect XI";
export const PROD_URL = "https://theperfectxi.com";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? PROD_URL;
export const SITE_TAGLINE = "Build the greatest Liverpool XI — and prove you know it.";
/** true for the GitHub Pages demo build (BASE_PATH set) — never on Cloudflare/prod.
 *  Demo pages must noindex + point their canonical at PROD_URL so Google never
 *  treats the mirror as a second copy of the site. */
export const IS_DEMO_HOST = Boolean(process.env.BASE_PATH);
export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN; // unset = analytics off
export const DISCLAIMER =
  "The Perfect XI is an independent, unofficial fan project. It is not affiliated with, endorsed by, or connected to Liverpool FC or any football club, league, or governing body. Club names and historical statistics are used as facts of sporting history.";
export const CREDITS =
  "Player data from Wikipedia (CC BY-SA) · additional historical data via lfchistory.net";
