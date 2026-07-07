/** Evergreen SEO prose + FAQs per era page. Keyed by era slug. */

export interface EraContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  prose: string[]; // paragraphs
  faqs: { q: string; a: string }[];
}

export const ERA_CONTENT: Record<string, EraContent> = {
  "all-time": {
    h1: "The Greatest All-Time Liverpool XI — Prove You Know It",
    metaTitle: "Greatest Liverpool XI of All Time — build and prove yours",
    metaDescription:
      "Build the greatest Liverpool XI of all time, blind, and score it against a hidden canonical selection. Player, season, formation, manager — 98 points on offer.",
    prose: [
      "Every Liverpool supporter has argued about the greatest all-time XI. Shankly's rebuilders against Paisley's European champions; the boot-room dynasty against the modern champions of Klopp. This page turns that argument into a game: build your best eleven from anyone who has ever worn the shirt — more than 800 players across 130 years — and score it against a hidden canonical XI chosen from the same complete record.",
      "The build is blind. Pick a formation, fill all eleven slots, and for each player name the season that defined him — Dalglish had many great years, but which was the peak? Then choose the manager who should lead them and the season that was his summit. Submit, and you get Mastermind-style feedback: how many players you have right, how many defining seasons, whether formation and manager match — never which picks were correct. That is the puzzle: work out where your team agrees with history's verdict and where it doesn't.",
      "A perfect build scores 98 — six points per correct player, two per correct season, four for the formation, four for the manager and two more for his peak season. Some slots accept more than one legend: an all-time XI that starts Clemence is as defensible as one that starts Alisson, and the key knows it. Find all of it and the canonical XI is revealed — as your own team sheet, because at 100% they are the same thing.",
      "Your attempts and best score are saved on your device, nothing more. No account, no leaderboard, just you against the collective judgement of Liverpool history. Start with the certainties — every all-time XI has four or five picks nobody argues about — then use the counts to triangulate the rest.",
    ],
    faqs: [
      {
        q: "What is the greatest Liverpool XI of all time?",
        a: "That's the game: a canonical all-time XI — with defining seasons, formation and manager — is hidden behind salted hashes, and you build your own team blind to discover it. Feedback after each attempt tells you how many picks match, never which ones.",
      },
      {
        q: "Which players are eligible?",
        a: "Every player in Liverpool's complete playing history since 1892 — the search box covers the full roster, not just the famous names.",
      },
      {
        q: "How is the XI scored?",
        a: "Each correct player is worth 6 points and his defining season 2 more; the right formation earns 4, the right manager 4, and the manager's peak season 2. Maximum 98.",
      },
      {
        q: "Can a slot have more than one right answer?",
        a: "Yes. Some slots accept equivalent legends — either of two great goalkeepers, for example — and any accepted player with an accepted season scores in full.",
      },
    ],
  },
  "post-war": {
    h1: "The Greatest Post-War Liverpool XI — Prove You Know It",
    metaTitle: "Greatest Post-War Liverpool Team — build and prove yours",
    metaDescription:
      "Build the greatest post-war Liverpool team (1945 to today), blind, and score it /98 against a hidden canonical XI. Mastermind feedback, no spoilers.",
    prose: [
      "From the resumption of league football in 1946 to today, Liverpool's post-war story runs through a Second Division exile, the Shankly revolution, the most decorated dynasty in English football and a modern renaissance. Building the greatest post-war Liverpool team means weighing all of it: does the spine come from the side that won the club's first European Cup, or from the champions of 2020?",
      "The rules are the same as every Perfect XI page: build blind, then submit. Eleven players, each with the season that defined him, a formation, a manager and his peak season. The feedback is counts only — players right, seasons right, formation and manager yes or no. Nobody tells you that your left-back is the problem; the deduction is the game.",
      "The post-war era is the connoisseur's board. The certainties are fewer than the all-time page — the 1940s and 50s offer Liddell and not much else that survives an honest selection, while the 1960s alone could staff half a team. A perfect score of 98 reveals the canonical XI, which at that moment is identical to yours. Attempts and best score live in your browser; the answer never leaves the page you're on.",
      "If you grew up on Hansen bringing the ball out, or on Keegan and Toshack, or on van Dijk striding through the press, this is the argument you've been having all your life — now with a score attached.",
    ],
    faqs: [
      {
        q: "What counts as post-war for this XI?",
        a: "Anyone whose Liverpool career falls in 1945 or later. Pre-war players are still searchable, but the hidden canonical XI is drawn from the post-war record.",
      },
      {
        q: "Is the post-war XI different from the all-time XI?",
        a: "They are separate hidden keys with separate salts, scored independently — solving one tells you nothing mechanical about the other, though good judgement travels.",
      },
      {
        q: "What feedback do I get after submitting?",
        a: "A total out of 98 and counts: players right out of 11, defining seasons right out of 11, and ticks for formation, manager and his peak season. Never which specific picks were correct.",
      },
      {
        q: "Do I need an account?",
        a: "No. Attempts and your best score are stored only in your browser's local storage, and the game works with storage disabled.",
      },
    ],
  },
  "premier-league": {
    h1: "The Greatest Premier League Liverpool XI — Prove You Know It",
    metaTitle: "Best Liverpool Premier League XI — build and prove yours",
    metaDescription:
      "Build the best Liverpool XI of the Premier League era (1992 to today), blind, and score it /98 against a hidden canonical team. Counts-only feedback.",
    prose: [
      "Liverpool entered the Premier League era as fallen champions and spent three decades clawing back to the summit — through the Spice Boys, the Houllier cup treble, Istanbul, the near-miss of 2014 and finally the machine that won everything under Klopp. Picking the best Liverpool Premier League XI means choosing between eras that barely resemble each other.",
      "Build yours blind: eleven players from 1992 onwards, each tagged with his defining season — Torres in 2007-08 or Fowler in 1995-96 both have a claim on the nine, but the hidden key has its own view. Add a formation, a manager and his peak season, then submit for counts-only feedback. Six points per correct player, two per season, four each for formation and manager, two for the manager's summit: 98 for perfection.",
      "The Premier League board rewards the supporter who watched it happen. The modern champions supply obvious candidates, but the key remembers Hyypiä's decade of order, Gerrard dragging ordinary teams to extraordinary places, and Suárez's single incandescent season. Equivalence classes mean genuinely defensible alternatives both score — but only genuinely defensible ones.",
      "Reach 100% and the canonical XI is revealed as your own build, with your attempt count as the bragging right. Everything is saved locally on your device; there is nothing to sign up for and nothing to install.",
    ],
    faqs: [
      {
        q: "Which seasons count for the Premier League XI?",
        a: "1992-93 to the present. Players whose Liverpool careers straddle 1992 are judged on their Premier League-era seasons.",
      },
      {
        q: "How do defining seasons work?",
        a: "Each canonical player carries one or two accepted peak seasons. Naming the right player earns 6 points; naming one of his accepted seasons adds 2 more.",
      },
      {
        q: "Who is the manager for the best Premier League Liverpool XI?",
        a: "That's part of the puzzle — the manager is worth 4 points and his peak season another 2, and the feedback only ever says correct or not.",
      },
      {
        q: "Can I retry after a wrong build?",
        a: "As often as you like. Each submission counts an attempt, your best score is kept on your device, and the canonical XI stays hidden until you hit 98.",
      },
    ],
  },
};
