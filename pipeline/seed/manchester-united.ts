import { p, type SeedClub } from "../seedTypes";

export const manchesterUnited: SeedClub = {
  slug: "manchester-united",
  name: "Manchester United",
  aliases: ["Man Utd", "Man United", "MUFC", "The Red Devils"],
  tier: "marquee",
  themeColour: "#b91c1c",
  players: [
    // GK
    p("Peter Schmeichel", "1995-96", ["GK"], 92, undefined, "The great Dane at his most unbeatable"),
    p("David de Gea", "2017-18", ["GK"], 89),
    p("Edwin van der Sar", "2008-09", ["GK"], 88, undefined, "14 consecutive league clean sheets"),
    p("Alex Stepney", "1967-68", ["GK"], 82),
    // CB
    p("Rio Ferdinand", "2007-08", ["CB"], 90),
    p("Nemanja Vidic", "2008-09", ["CB"], 90),
    p("Jaap Stam", "1998-99", ["CB"], 89, undefined, "Treble-season rock"),
    p("Gary Pallister", "1992-93", ["CB"], 85),
    p("Steve Bruce", "1993-94", ["CB"], 85),
    p("Bill Foulkes", "1967-68", ["CB"], 81),
    // FB
    p("Patrice Evra", "2008-09", ["FB"], 87),
    p("Denis Irwin", "1993-94", ["FB"], 86),
    p("Gary Neville", "1998-99", ["FB"], 86),
    p("Roger Byrne", "1956-57", ["FB"], 85, undefined, "Busby Babes captain"),
    // DM / CM
    p("Roy Keane", "1999-00", ["DM", "CM"], 92, undefined, "Dragged the club through the post-treble season"),
    p("Duncan Edwards", "1956-57", ["CM", "DM"], 92, undefined, "Lost at 21; contemporaries called him the best they ever saw"),
    p("Paul Scholes", "2002-03", ["CM", "AM"], 90, { apps: 33, goals: 14 }),
    p("Bryan Robson", "1985-86", ["CM", "DM"], 90, undefined, "Captain Marvel"),
    p("Paul Ince", "1993-94", ["CM", "DM"], 84),
    p("Michael Carrick", "2008-09", ["CM", "DM"], 84),
    p("Darren Fletcher", "2009-10", ["CM"], 81),
    p("Nicky Butt", "1996-97", ["DM", "CM"], 79),
    // AM
    p("Bobby Charlton", "1966-67", ["AM", "CM"], 94, undefined, "Ballon d'Or 1966"),
    p("Eric Cantona", "1995-96", ["AM", "ST"], 92, undefined, "Collar up, double sealed"),
    p("Wayne Rooney", "2009-10", ["ST", "AM"], 91, { apps: 32, goals: 26 }),
    // W
    p("Cristiano Ronaldo", "2007-08", ["W", "ST"], 96, { apps: 34, goals: 31 }, "Ballon d'Or, 42 in all comps from the wing"),
    p("George Best", "1967-68", ["W", "AM"], 95, { apps: 41, goals: 28 }, "European Cup and Ballon d'Or at 22"),
    p("Ryan Giggs", "1998-99", ["W"], 89, undefined, "THAT semi-final goal"),
    p("David Beckham", "1998-99", ["W", "CM"], 89),
    p("Andrei Kanchelskis", "1994-95", ["W"], 83),
    p("Steve Coppell", "1977-78", ["W"], 82),
    // ST
    p("Denis Law", "1963-64", ["ST"], 92, { apps: 30, goals: 30 }, "Ballon d'Or 1964"),
    p("Ruud van Nistelrooy", "2002-03", ["ST"], 90, { apps: 34, goals: 25 }),
    p("Robin van Persie", "2012-13", ["ST"], 89, { apps: 38, goals: 26 }, "Title No. 20 practically solo"),
    p("Dwight Yorke", "1998-99", ["ST"], 87),
    p("Tommy Taylor", "1956-57", ["ST"], 86),
    p("Andy Cole", "1999-00", ["ST"], 86),
    p("Mark Hughes", "1990-91", ["ST"], 85),
    // Depth & cult heroes
    p("Ole Gunnar Solskjaer", "1998-99", ["ST"], 82, undefined, "The baby-faced assassin, injury-time immortal"),
    p("Fabien Barthez", "2000-01", ["GK"], 80),
    p("Park Ji-sung", "2010-11", ["W", "CM"], 78),
    p("Tim Howard", "2003-04", ["GK"], 76),
    p("Wes Brown", "2007-08", ["CB", "FB"], 76),
    p("Phil Neville", "1998-99", ["FB", "CM"], 75),
    p("John O'Shea", "2006-07", ["FB", "CB"], 72, undefined, "Once nutmegged Figo, once played in goal"),
    p("Diego Forlan", "2002-03", ["ST"], 71, undefined, "Scored twice at Anfield; became world-class later"),
  ],
};
