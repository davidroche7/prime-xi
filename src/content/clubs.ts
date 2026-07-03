/** Evergreen per-club SEO copy (§9). Plain data — rendered by /club/[slug]. */

export interface ClubContent {
  prose: string[]; // paragraphs
  faq: { q: string; a: string }[];
  rivals: string[]; // slugs to interlink
}

export const CLUB_CONTENT: Record<string, ClubContent> = {
  liverpool: {
    prose: [
      "Picking Liverpool's greatest XI is an argument that has outlasted managers, stands and entire eras of football. Do you build around the pass-and-move machine Bob Paisley took to three European Cups, the swagger of the late-80s side that played the best football England had seen, or the heavy-metal press that conquered Europe and ended a thirty-year league wait? PRIME XI turns that pub debate into a puzzle: every great Liverpool player is here at the single season of his career you would freeze in amber, and you have a fixed budget that will not stretch to all of them.",
      "The choices bite quickly. Kenny Dalglish's 1978-79 and Virgil van Dijk's 2018-19 both demand superstar money, and Mohamed Salah's 32-goal debut season costs almost as much. Spend big on all three and you will be patching the midfield with cult heroes — which is exactly how a certain miracle in Istanbul was won, so perhaps that is fine. Graeme Souness gives you iron in front of the back four; Steven Gerrard gives you everything, everywhere; you probably cannot afford both.",
      "There is no single right answer, only a rating out of 99 and a tier to defend. Build a balanced side and the score will respect it: leave a soft centre-back pairing or a lightweight midfield and the deterministic scoring engine will dock you for it, exactly as an away end would. When you are done, share the card and let three generations of Kopites tell you that you forgot Ray Clemence.",
    ],
    faq: [
      {
        q: "Who is the highest-rated Liverpool player in PRIME XI?",
        a: "Kenny Dalglish's 1978-79 season is the joint-highest-rated Liverpool player-season at 94, alongside Virgil van Dijk's 2018-19. Salah, Gerrard and Suarez sit just behind on 93.",
      },
      {
        q: "Can I afford an all-superstar Liverpool XI?",
        a: "No — that is deliberate. An XI of the most expensive player at every position costs roughly 35% more than the budget, so every strong side involves real trade-offs and a cult hero or two.",
      },
      {
        q: "Which season counts for each Liverpool player?",
        a: "Each player appears at one peak season chosen editorially — for example Ian Rush in 1983-84 and Fernando Torres in 2007-08. Ratings are our own estimates; the underlying appearances and goals are historical fact.",
      },
    ],
    rivals: ["manchester-united", "arsenal"],
  },
  "manchester-united": {
    prose: [
      "Manchester United's history is really three dynasties stapled together — the Busby Babes and the holy trinity of Best, Law and Charlton; the Ferguson empire that treated the Premier League as a private possession; and the flashes of brilliance in between. A greatest XI has to referee between them, and that is precisely the game here: one budget, eleven shirts, and a hundred years of legends who all think they should be in.",
      "The budget forces the questions United fans have argued about forever. Cristiano Ronaldo's 2007-08 — 42 goals from the wing and a Ballon d'Or — is the most expensive player-season at the club, and George Best's 1967-68 is barely cheaper. Play both and you have already spent a third of everything on two flanks, with Schmeichel, Keane and a centre-back pairing still to fund. Or you can anchor the side with Duncan Edwards, whose 1956-57 season remains the most haunting what-if in English football, and spread the rest.",
      "Every completed XI gets a deterministic rating out of 99 and a tier from Cult Hero to GOAT. The scoring rewards balance the way Ferguson's best sides embodied it: a proper spine, width, and no passengers. Build yours, download the card, and see whether the treble-winners or the Babes shout loudest.",
    ],
    faq: [
      {
        q: "Who is the most expensive Manchester United player in PRIME XI?",
        a: "Cristiano Ronaldo's 2007-08 season, rated 96, is the priciest United player-season — a Ballon d'Or year with 31 league goals from the wing.",
      },
      {
        q: "Is Duncan Edwards included?",
        a: "Yes. His 1956-57 season is rated 92, based on the testimony of the generation that saw him. He remains one of the highest-rated central midfielders in the game.",
      },
      {
        q: "How is the United budget set?",
        a: "Each club's budget is tuned so a strong, well-balanced XI spends almost all of it while an all-superstar XI is roughly a third over. Knowledge of the squad's cheaper cult heroes is how you win.",
      },
    ],
    rivals: ["liverpool", "arsenal"],
  },
  arsenal: {
    prose: [
      "Arsenal give the XI-builder a puzzle no other English club quite offers: a genuine candidate side from four different centuries of style. The 1930s machine of Chapman's heirs, George Graham's famous back four, the Invincibles, and the modern title-chasers of Saka and Odegaard all supply players — and the budget guarantees they cannot all start.",
      "Thierry Henry's 2003-04 is the most expensive Arsenal player-season on the board, and nobody sensible builds without him. The interesting decisions come behind: Tony Adams's 1997-98 double season anchors the defence but costs elite-defender money, Patrick Vieira's Invincibles campaign owns the midfield price ceiling, and Dennis Bergkamp's 1997-98 turns any attack into art while draining the last of your credits. Somewhere a Perry Groves or a Ray Parlour is going to have to do a job, and honestly the side is more Arsenal for it.",
      "Scoring is pure and deterministic — the same XI rates the same forever, so the argument is with your choices, not the algorithm. Watch the balance penalties: a glamorous front six in front of a bargain defence is exactly the kind of Arsenal side that used to lose 4-2 at Newcastle, and the engine knows it.",
    ],
    faq: [
      {
        q: "Who is the highest-rated Arsenal player in PRIME XI?",
        a: "Thierry Henry's Invincibles season (2003-04) is rated 96 — the highest at the club and one of the highest in the game.",
      },
      {
        q: "Are the Invincibles all included?",
        a: "The core is: Henry, Vieira, Campbell, Cole, Lehmann, Pires and Gilberto Silva all appear at 2003-04 or a neighbouring peak. Fielding all of them together, though, will break your budget.",
      },
      {
        q: "Do modern Arsenal players feature?",
        a: "Yes — Bukayo Saka, Declan Rice, Martin Odegaard and William Saliba appear at their 2022-24 peaks alongside the historical greats.",
      },
    ],
    rivals: ["manchester-united", "liverpool"],
  },
  "real-madrid": {
    prose: [
      "No club distorts a greatest-XI budget like Real Madrid. This is a squad list where a Ballon d'Or is roughly the price of entry, where Alfredo Di Stefano and Cristiano Ronaldo both demand the same superstar credits sixty years apart, and where Zinedine Zidane's volley is somehow only the third most expensive memory on the board. Eleven shirts, one budget, and the deepest catalogue of galacticos in football history.",
      "The temptation is to spend everything on the front of the shirt numbers — Di Stefano, Puskas, Ronaldo, Zidane, Benzema — and discover you are starting a cut-price goalkeeper behind a patchwork defence. Madrid's own history warns against it: the great European sides were built on Casillas, Ramos, Redondo and Makelele as much as on the fireworks. The scoring engine agrees, and will penalise a soft spine without sentiment.",
      "Every finished XI receives a deterministic rating out of 99 and a tier — and at this club, anything below Legendary will feel like a sackable offence. Choose a formation, argue with a century of white shirts, and share the card so the comments section can inform you that you forgot Gento's six European Cups.",
    ],
    faq: [
      {
        q: "Who are the highest-rated Real Madrid players in PRIME XI?",
        a: "Alfredo Di Stefano (1956-57) and Cristiano Ronaldo (2013-14) lead the club at 96, with Zidane at 95 and Puskas at 94.",
      },
      {
        q: "Can I build an XI entirely from Galacticos?",
        a: "You can try — but the all-superstar XI costs about 35% more than the budget allows. The game is choosing which two or three galacticos matter most and building intelligently around them.",
      },
      {
        q: "Are pre-1960 Madrid players included?",
        a: "Yes. The 1950s European Cup dynasty is represented — Di Stefano, Puskas and Gento all appear at their peaks, priced accordingly.",
      },
    ],
    rivals: ["barcelona", "ac-milan"],
  },
  barcelona: {
    prose: [
      "Barcelona's greatest XI starts with an unfair advantage: the best player-season in this entire game. Lionel Messi's 2011-12 — fifty league goals, seventy-three in all competitions — is rated 98 and priced like the once-in-history outlier it was. The question that defines every Barca build is simple: what are you prepared to give up to start him? (Starting without him is technically permitted, in the way that leaving the Sagrada Familia off a Barcelona itinerary is technically permitted.)",
      "Around that fixed point orbit five decades of idealists: Cruyff's 1973-74, the Dream Team of Koeman, Laudrup and Stoichkov, Ronaldinho at his 2005-06 zenith, and the 2010-11 machine of Xavi, Iniesta and Busquets that many consider the finest club side ever assembled. The budget will let you take the midfield trio or the front-line firepower — not both at full strength — which is exactly the sort of philosophical dilemma this club was built to host.",
      "Scores are deterministic and out of 99, with balance penalties for sides that forget defending exists (a very Barcelona way to lose points). Assemble your XI, chase the GOAT tier — genuinely reachable here if you are clever — and share the card with the one friend who still insists Rivaldo was better than Ronaldinho.",
    ],
    faq: [
      {
        q: "What is the highest-rated player-season in PRIME XI?",
        a: "Lionel Messi's 2011-12 at Barcelona, rated 98 — 50 league goals and 73 in all competitions. It is also the most expensive player-season in the game.",
      },
      {
        q: "Can I field Xavi, Iniesta and Busquets together?",
        a: "Yes, and it is one of the best midfields money can buy — but it consumes so much budget that your attack will need bargains. Convex pricing makes stacking stars expensive by design.",
      },
      {
        q: "Is Johan Cruyff included as a player?",
        a: "Yes — his 1973-74 season, when Barcelona won the league at a canter in his first year, is rated 96.",
      },
    ],
    rivals: ["real-madrid", "ac-milan"],
  },
  "ac-milan": {
    prose: [
      "AC Milan offer the connoisseur's version of this puzzle. Other clubs make you choose between attackers; Milan make you choose between defenders — because this is the club of Baresi and Maldini, where the greatest back line ever assembled played keep-ball in front of Europe's best goalkeepers, and where even the water-carriers had Ballon d'Ors. Sacchi's pressing machine, Ancelotti's Christmas-tree, Rivera's golden 1960s: one budget must referee them all.",
      "The structural question is unique: Franco Baresi's 1989-90 and Paolo Maldini's mid-90s peak are priced like the superstars they were, and Alessandro Nesta is waiting behind them. Spend properly on that defence and the famous Dutch triangle — Gullit, Rijkaard and the untouchable Marco van Basten of 1988-89 — suddenly looks like a luxury you must ration. Kaka's 2006-07, the last season before the Ballon d'Or moved permanently to Spain, argues loudly for the No. 10 shirt.",
      "As everywhere in PRIME XI, the score is deterministic: 99-point scale, tier labels from Cult Hero to GOAT, and balance penalties that punish a lopsided side. Milan is the one club where defence-first building is not just viable but historically mandatory. Prove you understand that, and the rating will show it.",
    ],
    faq: [
      {
        q: "Who is the highest-rated AC Milan player in PRIME XI?",
        a: "Marco van Basten's 1988-89 season is rated 96 — a Ballon d'Or year crowned with two goals in the European Cup final. Baresi (95) and Maldini/Kaka/Gullit (94) follow.",
      },
      {
        q: "Why are Milan defenders so expensive?",
        a: "Because they were that good: Baresi and Maldini rate alongside most clubs' best attackers, and centre-backs carry a small scarcity premium in the cost model on top.",
      },
      {
        q: "Which Milan eras are covered?",
        a: "From Gunnar Nordahl's 1950-51 goal avalanche through Rivera's 1960s, Sacchi's and Capello's sides, the 2000s Champions League teams, and the 2021-22 scudetto of Leao and Theo Hernandez.",
      },
    ],
    rivals: ["real-madrid", "barcelona"],
  },
};
