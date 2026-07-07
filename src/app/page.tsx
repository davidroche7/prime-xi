import type { Metadata } from "next";
import { GuessTheRed } from "@/components/GuessTheRed";
import { getAnswers, getPlayersIndex } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guess the Red — the daily Liverpool FC player quiz",
  description:
    "A free daily Liverpool player guessing game. Six clues, hardest to easiest, one Red from 130+ years of club history. New puzzle every day at midnight UTC.",
  alternates: { canonical: `${SITE_URL}/` },
};

const FAQS = [
  {
    q: "What is Guess the Red?",
    a: "Guess the Red is a free daily Liverpool FC player quiz. Every day there is one mystery player from Liverpool's history and six clues, revealed hardest to easiest. Guess in fewer clues to score more points — solving on the first clue is worth 6, on the last clue 1.",
  },
  {
    q: "When does a new puzzle start?",
    a: "A new mystery player appears every day at 00:00 UTC. Everyone in the world gets the same player on the same day, so results are comparable — share your score grid without spoiling the answer.",
  },
  {
    q: "Which players can be the answer?",
    a: "The answer pool covers hundreds of notable Liverpool players from 1892 to today — league champions, European Cup winners, cult heroes and one-season wonders. The guess box accepts every player who has ever appeared for Liverpool's first team.",
  },
  {
    q: "What is Hard mode?",
    a: "Hard mode draws its daily player from the deeper end of the squad lists — fewer household names, more cult figures and pre-Premier League players. It has its own daily answer and its own share result.",
  },
];

export default function HomePage() {
  const players = getPlayersIndex();
  const answers = getAnswers();

  return (
    <>
      <section className="py-8 text-center">
        <h1 className="text-4xl font-black tracking-tight">
          Guess the <span className="text-red-500">Red</span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-zinc-400">
          One mystery Liverpool player a day. Six clues, hardest first — how few do you need?
        </p>
      </section>

      <GuessTheRed players={players} answers={answers} />

      <section className="mx-auto mt-16 max-w-xl space-y-4 border-t border-ink-800 pt-8 text-sm leading-relaxed text-zinc-400">
        <h2 className="text-lg font-bold text-zinc-200">The daily Liverpool player quiz</h2>
        <p>
          Guess the Red is a daily knowledge game for Liverpool supporters. Each day the game picks one
          player from the club&apos;s complete playing history — more than 800 men have pulled on the shirt
          since 1892 — and hands you six clues about him, starting with the hardest. A career-shape clue
          might tell you roughly how many appearances he made and when; later clues reveal where he was
          born, who Liverpool signed him from, how many goals he scored, and what he won at Anfield. The
          final clue gives you his position and initials, so nobody walks away without a fair chance.
        </p>
        <p>
          Every wrong guess costs you a clue. Solve it on clue one and you&apos;ve earned the full six
          points; need all six and you scrape a single point. Miss with all six clues on the table and the
          streak resets. The answer is the same for every player in the world and changes at midnight UTC,
          so your result grid — like the word game that inspired it — can be shared without spoiling
          anything for the next person.
        </p>
        <p>
          The standard puzzle draws from the better-known half of the answer pool: title winners, European
          champions, modern stars and the legends of the Shankly, Paisley and Dalglish sides. Hard mode is
          for the supporter who knows the squad numbers of the 1981 League Cup side — deeper cuts, earlier
          eras, fewer than a hundred appearances. Both modes track a daily streak on your device; no
          account, no sign-up, nothing to install.
        </p>
        <p>
          Player facts are drawn from the historical record — appearances, goals, transfers and honours —
          and every clue is generated from those facts. If you think you know your Liverpool history,
          prove it in six clues or fewer.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-xl text-sm">
        <h2 className="text-lg font-bold text-zinc-200">FAQ</h2>
        <dl className="mt-3 space-y-4">
          {FAQS.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold text-zinc-300">{f.q}</dt>
              <dd className="mt-1 leading-relaxed text-zinc-400">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </>
  );
}
