import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { FORMATIONS, SEED_CLUBS, buildClubData, tuningReport } from "./build";

const DATA_DIR = join(__dirname, "..", "data");

function writeJson(path: string, value: unknown) {
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
  console.log(`wrote ${path}`);
}

mkdirSync(join(DATA_DIR, "clubs"), { recursive: true });

const index: unknown[] = [];
for (const seed of SEED_CLUBS) {
  const data = buildClubData(seed);
  writeJson(join(DATA_DIR, "clubs", `${data.club.slug}.json`), data);
  index.push({
    id: data.club.id,
    slug: data.club.slug,
    name: data.club.name,
    tier: data.club.tier,
    themeColour: data.club.themeColour,
    budget: data.club.budget,
    playerCount: data.players.length,
  });
}

writeJson(join(DATA_DIR, "index.json"), index);
writeJson(join(DATA_DIR, "formations.json"), FORMATIONS);

console.log("\n§5.2 tuning report (superstar target ~130-140%, balanced target ~90-100%):");
console.table(tuningReport());
