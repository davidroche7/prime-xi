import { SITE_TAGLINE } from "@/lib/site";

// Interim stub during the LFC pivot — Guess the Red lands here (Task 6).
export default function HomePage() {
  return (
    <section className="py-16 text-center">
      <h1 className="text-4xl font-black tracking-tight">
        Guess the <span className="text-red-500">Red</span>
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-zinc-400">{SITE_TAGLINE}</p>
      <p className="mt-6 text-sm text-zinc-500">The daily Liverpool player puzzle is on its way.</p>
    </section>
  );
}
