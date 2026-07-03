import { p, type SeedClub } from "../seedTypes";

export const liverpool: SeedClub = {
  slug: "liverpool",
  name: "Liverpool",
  aliases: ["LFC", "The Reds"],
  tier: "marquee",
  themeColour: "#be123c",
  players: [
    // GK
    p("Alisson Becker", "2018-19", ["GK"], 90, { apps: 38 }, "Golden Glove in his first season"),
    p("Ray Clemence", "1976-77", ["GK"], 88),
    p("Pepe Reina", "2005-06", ["GK"], 85),
    p("Bruce Grobbelaar", "1983-84", ["GK"], 82, undefined, "Spaghetti legs in Rome"),
    // CB
    p("Virgil van Dijk", "2018-19", ["CB"], 94, { apps: 38 }, "PFA Player of the Year as a defender"),
    p("Alan Hansen", "1983-84", ["CB"], 89),
    p("Emlyn Hughes", "1976-77", ["CB", "CM"], 86),
    p("Sami Hyypia", "2001-02", ["CB"], 86),
    p("Jamie Carragher", "2005-06", ["CB", "FB"], 85),
    p("Ron Yeats", "1965-66", ["CB"], 83, undefined, "Shankly's colossus"),
    // FB
    p("Trent Alexander-Arnold", "2019-20", ["FB"], 89, { apps: 38, assists: 13 }),
    p("Andrew Robertson", "2018-19", ["FB"], 87),
    p("Steve Nicol", "1988-89", ["FB", "CM"], 85),
    p("Phil Neal", "1978-79", ["FB"], 84),
    // DM / CM
    p("Graeme Souness", "1983-84", ["DM", "CM"], 91, undefined, "Iron and silk in the same boot"),
    p("Steven Gerrard", "2005-06", ["CM", "AM"], 93, { apps: 32, goals: 10 }, "Istanbul was the season before; this was the FA Cup final one"),
    p("Xabi Alonso", "2008-09", ["CM", "DM"], 87),
    p("Javier Mascherano", "2008-09", ["DM"], 86),
    p("Ray Kennedy", "1978-79", ["CM"], 85),
    p("Jordan Henderson", "2019-20", ["CM", "DM"], 84),
    p("Jan Molby", "1985-86", ["CM", "DM"], 84),
    p("Terry McDermott", "1979-80", ["CM", "AM"], 84),
    p("Dietmar Hamann", "2004-05", ["DM"], 82),
    // AM / W
    p("Kenny Dalglish", "1978-79", ["AM", "ST"], 94, { apps: 42, goals: 21 }, "The King at full power"),
    p("Mohamed Salah", "2017-18", ["W", "ST"], 93, { apps: 36, goals: 32 }, "32 in 36 in his debut league season"),
    p("John Barnes", "1987-88", ["W", "AM"], 91),
    p("Sadio Mane", "2018-19", ["W"], 89, { apps: 36, goals: 22 }),
    p("Philippe Coutinho", "2016-17", ["AM", "W"], 86),
    p("Steve Heighway", "1972-73", ["W"], 84),
    p("Raheem Sterling", "2014-15", ["W"], 82),
    // ST
    p("Luis Suarez", "2013-14", ["ST"], 93, { apps: 33, goals: 31 }, "31 goals in 33 league games"),
    p("Ian Rush", "1983-84", ["ST"], 91, { apps: 41, goals: 32 }),
    p("Kevin Keegan", "1976-77", ["ST", "AM"], 90),
    p("Fernando Torres", "2007-08", ["ST"], 89, { apps: 33, goals: 24 }),
    p("Robbie Fowler", "1995-96", ["ST"], 89, { apps: 38, goals: 28 }, "God, at 20"),
    p("Roger Hunt", "1965-66", ["ST"], 87),
    p("Michael Owen", "2000-01", ["ST"], 86, undefined, "Ballon d'Or year"),
    p("Billy Liddell", "1954-55", ["ST", "W"], 85),
    // Depth & cult heroes
    p("Danny Murphy", "2000-01", ["CM", "AM"], 77),
    p("Peter Crouch", "2006-07", ["ST"], 76),
    p("Stephane Henchoz", "2000-01", ["CB"], 76),
    p("Jerzy Dudek", "2004-05", ["GK"], 75, undefined, "Istanbul. The legs. The save from Shevchenko."),
    p("Vladimir Smicer", "2004-05", ["AM", "W"], 74, undefined, "Scored in Istanbul off the bench"),
    p("David Fairclough", "1975-76", ["ST"], 72, undefined, "Supersub"),
    p("Igor Biscan", "2004-05", ["DM", "CM"], 70),
    p("Djimi Traore", "2004-05", ["CB", "FB"], 68, undefined, "European champion. Yes, really."),
  ],
};
