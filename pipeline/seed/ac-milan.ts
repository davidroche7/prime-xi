import { p, type SeedClub } from "../seedTypes";

export const acMilan: SeedClub = {
  slug: "ac-milan",
  name: "AC Milan",
  aliases: ["Milan", "The Rossoneri"],
  tier: "marquee",
  themeColour: "#7f1d1d",
  players: [
    // GK
    p("Gianluigi Donnarumma", "2020-21", ["GK"], 88),
    p("Dida", "2004-05", ["GK"], 87),
    p("Sebastiano Rossi", "1993-94", ["GK"], 82),
    // CB
    p("Franco Baresi", "1989-90", ["CB"], 95, undefined, "The libero all others are measured against"),
    p("Paolo Maldini", "1994-95", ["FB", "CB"], 94, undefined, "Peak left-back years; played on to 41"),
    p("Alessandro Nesta", "2003-04", ["CB"], 91),
    p("Marcel Desailly", "1994-95", ["DM", "CB"], 89),
    p("Alessandro Costacurta", "1993-94", ["CB"], 88),
    // FB
    p("Cafu", "2003-04", ["FB"], 86),
    p("Theo Hernandez", "2021-22", ["FB"], 86),
    p("Mauro Tassotti", "1989-90", ["FB"], 85),
    p("Serginho", "2004-05", ["FB", "W"], 80),
    // DM / CM
    p("Frank Rijkaard", "1989-90", ["DM", "CB"], 91, undefined, "The third Dutchman, and the steel"),
    p("Andrea Pirlo", "2005-06", ["DM", "CM"], 91, undefined, "The regista role reinvented"),
    p("Gennaro Gattuso", "2004-05", ["DM"], 85),
    p("Massimo Ambrosini", "2006-07", ["DM", "CM"], 81),
    p("Clarence Seedorf", "2004-05", ["CM", "AM"], 87),
    p("Demetrio Albertini", "1993-94", ["CM", "DM"], 85),
    // AM
    p("Kaka", "2006-07", ["AM", "CM"], 94, undefined, "Ballon d'Or 2007, ran through Old Trafford"),
    p("Ruud Gullit", "1988-89", ["AM", "ST"], 94, undefined, "Two in the European Cup final"),
    p("Gianni Rivera", "1968-69", ["AM"], 92, undefined, "Ballon d'Or 1969, the Golden Boy"),
    p("Rui Costa", "2001-02", ["AM"], 87),
    p("Zvonimir Boban", "1993-94", ["AM", "CM"], 85),
    // W
    p("Roberto Donadoni", "1988-89", ["W"], 86),
    p("Rafael Leao", "2021-22", ["W"], 87, undefined, "Serie A MVP in the scudetto season"),
    p("Kakha Kaladze", "2004-05", ["CB", "FB"], 81),
    // ST
    p("Marco van Basten", "1988-89", ["ST"], 96, { apps: 33, goals: 19 }, "Ballon d'Or, two in the final, that volley still to come"),
    p("Andriy Shevchenko", "2003-04", ["ST"], 93, { apps: 32, goals: 24 }, "Capocannoniere in a scudetto season"),
    p("Gunnar Nordahl", "1950-51", ["ST"], 92, { apps: 37, goals: 34 }, "Still Serie A's most lethal ratio"),
    p("George Weah", "1995-96", ["ST"], 91, undefined, "Ballon d'Or 1995"),
    p("Zlatan Ibrahimovic", "2011-12", ["ST"], 90, { apps: 32, goals: 28 }),
    p("Filippo Inzaghi", "2002-03", ["ST"], 86),
    p("Jose Altafini", "1962-63", ["ST"], 86),
    p("Daniele Massaro", "1993-94", ["ST"], 82),
    // Depth & cult heroes
    p("Ray Wilkins", "1984-85", ["CM"], 79),
    p("Christian Panucci", "1994-95", ["FB"], 78),
    p("Marco Simone", "1993-94", ["ST"], 78),
    p("Alberigo Evani", "1988-89", ["W", "CM"], 76),
    p("Christian Abbiati", "2002-03", ["GK"], 76),
    p("Filippo Galli", "1993-94", ["CB"], 74),
    p("Mark Hateley", "1984-85", ["ST"], 74, undefined, "That header over Collovati in the derby"),
  ],
};
