import { p, type SeedClub } from "../seedTypes";

export const realMadrid: SeedClub = {
  slug: "real-madrid",
  name: "Real Madrid",
  aliases: ["Madrid", "Los Blancos", "Real"],
  tier: "marquee",
  themeColour: "#6d28d9",
  players: [
    // GK
    p("Iker Casillas", "2007-08", ["GK"], 91),
    p("Thibaut Courtois", "2021-22", ["GK"], 91, undefined, "That Champions League final"),
    p("Keylor Navas", "2015-16", ["GK"], 85),
    // CB
    p("Sergio Ramos", "2016-17", ["CB", "FB"], 92, undefined, "Captain of a league and European double"),
    p("Fernando Hierro", "1996-97", ["CB", "DM"], 89),
    p("Pepe", "2011-12", ["CB"], 86),
    p("Raphael Varane", "2016-17", ["CB"], 86),
    p("Fabio Cannavaro", "2006-07", ["CB"], 86, undefined, "Arrived as the reigning Ballon d'Or"),
    // FB
    p("Roberto Carlos", "2002-03", ["FB", "W"], 90),
    p("Marcelo", "2016-17", ["FB"], 89),
    p("Dani Carvajal", "2016-17", ["FB"], 86),
    p("Michel Salgado", "2001-02", ["FB"], 83),
    // DM / CM
    p("Claude Makelele", "2002-03", ["DM"], 89, undefined, "They only understood when he left"),
    p("Casemiro", "2016-17", ["DM"], 88),
    p("Fernando Redondo", "1999-00", ["DM", "CM"], 88, undefined, "That backheel at Old Trafford"),
    p("Luka Modric", "2017-18", ["CM", "AM"], 91, undefined, "Ballon d'Or 2018"),
    p("Toni Kroos", "2016-17", ["CM"], 90),
    p("Xabi Alonso", "2011-12", ["CM", "DM"], 88),
    p("Federico Valverde", "2021-22", ["CM"], 86),
    // AM
    p("Zinedine Zidane", "2002-03", ["AM", "CM"], 95, undefined, "Volleys included"),
    p("Jude Bellingham", "2023-24", ["AM", "CM"], 90, { apps: 28, goals: 19 }),
    p("Isco", "2016-17", ["AM"], 85),
    p("Guti", "2005-06", ["AM", "CM"], 83),
    // W
    p("Cristiano Ronaldo", "2013-14", ["W", "ST"], 96, { apps: 30, goals: 31 }, "La Decima delivered, Ballon d'Or reclaimed"),
    p("Francisco Gento", "1959-60", ["W"], 91, undefined, "Six European Cups — no one else has that"),
    p("Luis Figo", "2001-02", ["W", "AM"], 91),
    p("Vinicius Junior", "2023-24", ["W"], 90),
    p("Gareth Bale", "2015-16", ["W"], 88),
    p("Amancio", "1963-64", ["W", "ST"], 86),
    // ST
    p("Alfredo Di Stefano", "1956-57", ["ST", "AM"], 96, undefined, "The complete footballer of his century"),
    p("Ferenc Puskas", "1960-61", ["ST"], 94, undefined, "Four in a European Cup final"),
    p("Karim Benzema", "2021-22", ["ST"], 93, { apps: 32, goals: 27 }, "Ballon d'Or season"),
    p("Raul", "2000-01", ["ST", "AM"], 91),
    p("Ronaldo", "2003-04", ["ST"], 91, undefined, "R9, still terrifying"),
    p("Hugo Sanchez", "1989-90", ["ST"], 89, { apps: 35, goals: 38 }, "38 goals, all first-touch"),
    p("Emilio Butragueno", "1986-87", ["ST"], 87, undefined, "The Vulture"),
    // Depth & cult heroes
    p("Michel", "1986-87", ["W", "CM"], 84),
    p("Santillana", "1979-80", ["ST"], 82),
    p("Fernando Morientes", "1997-98", ["ST"], 81),
    p("Steve McManaman", "1999-00", ["AM", "W"], 80, undefined, "Volleyed in a Champions League final"),
    p("Jose Antonio Camacho", "1979-80", ["FB"], 80),
    p("Ivan Helguera", "2001-02", ["CB", "DM"], 79),
    p("Bodo Illgner", "1997-98", ["GK"], 76),
    p("Alvaro Arbeloa", "2011-12", ["FB"], 74),
    p("Cesar Sanchez", "2002-03", ["GK"], 74),
    p("Pedro Munitis", "2000-01", ["W"], 72),
  ],
};
