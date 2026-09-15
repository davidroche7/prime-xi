# Native app builds (Capacitor)

The `android/` and `ios/` folders are thin native wrappers around the same static
export that ships to Cloudflare Pages (`out/`) — no server, no native code of our
own. Do this on a machine with Android Studio / Xcode installed (this dev sandbox
has neither, so the wrap was scaffolded and verified with `npx cap sync` but never
opened in an IDE or built to a binary).

## Every time the web app changes

```
pnpm cap:sync   # rebuilds out/ and copies it into both native shells
```

## Android (Google Play)

1. Install Android Studio, open `android/` (or `pnpm cap:android`).
2. Build → Generate Signed App Bundle, create a new upload keystore (store it
   somewhere durable — losing it means you can never update the app again).
3. Google Play Console account: $25 one-time, needs your identity + a payment
   method. New personal accounts also go through a ~20-tester / 14-day closed
   testing track before a production release (current Play policy).
4. Store listing copy is drafted in `docs/store-listing.md`. Screenshots need a
   real device or emulator — not generatable from this sandbox.

## iOS (App Store)

1. Requires a Mac with Xcode. Open `ios/App/App.xcworkspace` (or `pnpm cap:ios`).
2. Apple Developer Program: $99/year, needs your Apple ID + payment + (for an
   org account) a D-U-N-S number.
3. Signing: Xcode → Signing & Capabilities → pick your team, let it manage the
   provisioning profile.
4. Archive → Distribute App → App Store Connect.

## App identity

- Bundle/package id: `com.theperfectxi.app`
- Icon/splash source: `resources/icon.png` (1024×1024) and `resources/splash.png`
  (2732×2732) — upscaled from the existing PWA mark (`public/icon-512.png`) with
  `@capacitor/assets`. Re-run `npx capacitor-assets generate` after replacing
  either source file (only regenerate `android`/`ios` targets — it also has a
  `pwa` target that writes a stray `public/manifest.webmanifest` + `icons/`
  which collide with the existing `src/app/manifest.ts` route; delete those two
  if they reappear).
