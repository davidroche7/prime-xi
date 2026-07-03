import { p, type SeedClub } from "../seedTypes";

export const arsenal: SeedClub = {
  slug: "arsenal",
  name: "Arsenal",
  aliases: ["AFC", "The Gunners"],
  tier: "marquee",
  themeColour: "#dc2626",
  players: [
    // GK
    p("David Seaman", "1996-97", ["GK"], 89),
    p("Pat Jennings", "1979-80", ["GK"], 87),
    p("Jens Lehmann", "2003-04", ["GK"], 86, undefined, "Every minute of the Invincibles season"),
    // CB
    p("Tony Adams", "1997-98", ["CB"], 91, undefined, "Mr Arsenal, double-winning captain"),
    p("Sol Campbell", "2003-04", ["CB"], 89),
    p("Frank McLintock", "1970-71", ["CB", "DM"], 87, undefined, "1971 double captain"),
    p("William Saliba", "2023-24", ["CB"], 87, { apps: 38 }),
    p("Martin Keown", "1998-99", ["CB"], 85),
    p("Steve Bould", "1990-91", ["CB"], 84),
    // FB
    p("Ashley Cole", "2004-05", ["FB"], 89),
    p("Lee Dixon", "1990-91", ["FB"], 85),
    p("Nigel Winterburn", "1990-91", ["FB"], 84),
    p("Lauren", "2003-04", ["FB"], 82),
    // DM / CM
    p("Patrick Vieira", "2003-04", ["DM", "CM"], 93, undefined, "Invincibles captain"),
    p("Cesc Fabregas", "2007-08", ["CM", "AM"], 89, { apps: 32, assists: 17 }),
    p("Declan Rice", "2023-24", ["DM", "CM"], 88),
    p("Emmanuel Petit", "1997-98", ["DM", "CM"], 86),
    p("Gilberto Silva", "2003-04", ["DM"], 84, undefined, "The Invisible Wall"),
    p("Aaron Ramsey", "2013-14", ["CM"], 84),
    // AM
    p("Dennis Bergkamp", "1997-98", ["AM", "ST"], 93, undefined, "PFA and FWA Player of the Year"),
    p("Liam Brady", "1978-79", ["AM", "CM"], 90, undefined, "Chippy's cup-final year"),
    p("Martin Odegaard", "2022-23", ["AM", "CM"], 88, { apps: 37, goals: 15 }),
    p("Mesut Ozil", "2015-16", ["AM"], 87, { apps: 35, assists: 19 }),
    p("Santi Cazorla", "2014-15", ["AM", "CM"], 85),
    // W
    p("Robert Pires", "2001-02", ["W", "AM"], 89, undefined, "FWA Player of the Year"),
    p("Bukayo Saka", "2023-24", ["W"], 88, { apps: 35, goals: 16 }),
    p("Marc Overmars", "1997-98", ["W"], 87),
    p("Cliff Bastin", "1932-33", ["W", "ST"], 87, undefined, "33 goals from the wing as a title-winning teenager era star"),
    p("Freddie Ljungberg", "2001-02", ["W", "AM"], 86),
    // ST
    p("Thierry Henry", "2003-04", ["ST", "W"], 96, { apps: 37, goals: 30 }, "Invincible, untouchable"),
    p("Robin van Persie", "2011-12", ["ST"], 91, { apps: 38, goals: 30 }),
    p("Ian Wright", "1996-97", ["ST"], 90),
    p("Ted Drake", "1934-35", ["ST"], 86, undefined, "42 league goals, still the club record"),
    p("Alan Smith", "1990-91", ["ST"], 84),
    p("Emmanuel Adebayor", "2007-08", ["ST"], 84),
    p("Malcolm Macdonald", "1976-77", ["ST"], 83),
    // Depth & cult heroes
    p("David Rocastle", "1988-89", ["CM", "W"], 83, undefined, "Rocky — remember who you are, what you are"),
    p("Kolo Toure", "2003-04", ["CB"], 82),
    p("Theo Walcott", "2012-13", ["W", "ST"], 78),
    p("Ray Parlour", "1997-98", ["CM", "W"], 78, undefined, "The Romford Pele"),
    p("John Radford", "1970-71", ["ST", "W"], 78),
    p("Tomas Rosicky", "2013-14", ["AM", "CM"], 77),
    p("Manuel Almunia", "2007-08", ["GK"], 72),
    p("Perry Groves", "1988-89", ["W"], 68, undefined, "We all live in a Perry Groves world"),
  ],
};
