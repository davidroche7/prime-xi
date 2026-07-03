import { p, type SeedClub } from "../seedTypes";

export const barcelona: SeedClub = {
  slug: "barcelona",
  name: "Barcelona",
  aliases: ["Barca", "FCB", "Blaugrana"],
  tier: "marquee",
  themeColour: "#1d4ed8",
  players: [
    // GK
    p("Marc-Andre ter Stegen", "2018-19", ["GK"], 89),
    p("Victor Valdes", "2010-11", ["GK"], 87),
    p("Andoni Zubizarreta", "1991-92", ["GK"], 86),
    // CB
    p("Carles Puyol", "2008-09", ["CB", "FB"], 90, undefined, "Sextuple-season captain"),
    p("Gerard Pique", "2010-11", ["CB"], 89),
    p("Ronald Koeman", "1991-92", ["CB", "DM"], 89, undefined, "Wembley free kick, first European Cup"),
    p("Rafael Marquez", "2005-06", ["CB", "DM"], 84),
    p("Samuel Umtiti", "2017-18", ["CB"], 84),
    // FB
    p("Dani Alves", "2010-11", ["FB", "W"], 89),
    p("Jordi Alba", "2014-15", ["FB"], 86),
    p("Eric Abidal", "2010-11", ["FB", "CB"], 84, undefined, "Lifted the cup at Wembley months after surgery"),
    // DM / CM
    p("Sergio Busquets", "2010-11", ["DM"], 90, undefined, "You watch him and see everything"),
    p("Pep Guardiola", "1991-92", ["DM", "CM"], 88, undefined, "Cruyff's pivot in the Dream Team"),
    p("Yaya Toure", "2008-09", ["DM", "CM"], 86),
    p("Xavi", "2010-11", ["CM"], 94, undefined, "The metronome of the best club side ever"),
    p("Andres Iniesta", "2011-12", ["CM", "AM"], 93),
    p("Pedri", "2023-24", ["CM", "AM"], 85),
    p("Frenkie de Jong", "2021-22", ["CM", "DM"], 85),
    p("Luis Enrique", "1997-98", ["CM", "W"], 85),
    p("Ivan Rakitic", "2014-15", ["CM"], 85),
    // AM
    p("Ronaldinho", "2005-06", ["AM", "W"], 95, undefined, "Ballon d'Or, and applauded at the Bernabeu"),
    p("Rivaldo", "1998-99", ["AM", "W"], 92, undefined, "Ballon d'Or 1999"),
    p("Michael Laudrup", "1993-94", ["AM", "CM"], 90),
    p("Deco", "2005-06", ["AM", "CM"], 87),
    // W
    p("Lionel Messi", "2011-12", ["W", "AM"], 98, { apps: 37, goals: 50 }, "50 league goals; 73 in all competitions"),
    p("Neymar", "2015-16", ["W"], 92, { apps: 34, goals: 24 }),
    p("David Villa", "2010-11", ["ST", "W"], 88),
    // ST
    p("Johan Cruyff", "1973-74", ["ST", "AM"], 96, undefined, "Arrived, and Barca won the league by miles"),
    p("Luis Suarez", "2015-16", ["ST"], 93, { apps: 35, goals: 40 }, "40-goal Pichichi in the MSN year"),
    p("Romario", "1993-94", ["ST"], 92, { apps: 33, goals: 30 }),
    p("Ladislao Kubala", "1952-53", ["ST", "AM"], 92, undefined, "The statue outside Camp Nou is his"),
    p("Samuel Eto'o", "2008-09", ["ST"], 91, { apps: 36, goals: 30 }),
    p("Hristo Stoichkov", "1993-94", ["ST", "W"], 91),
    p("Patrick Kluivert", "1998-99", ["ST"], 87),
    // Depth & cult heroes
    p("Carles Rexach", "1973-74", ["W"], 80),
    p("Ludovic Giuly", "2005-06", ["W"], 78),
    p("Jose Mari Bakero", "1991-92", ["CM"], 78),
    p("Sergi Barjuan", "1994-95", ["FB"], 77),
    p("Albert Ferrer", "1993-94", ["FB"], 76),
    p("Julio Salinas", "1991-92", ["ST"], 74),
    p("Ruud Hesp", "1997-98", ["GK"], 73),
    p("Gheorghe Hagi", "1994-95", ["AM"], 82, undefined, "A genius passing through"),
  ],
};
