import { tuningReport } from "./build";

console.log("§5.2 tuning report (superstar target ~130-140%, balanced target ~90-100%):");
console.table(tuningReport());

const rows = tuningReport();
const bad = rows.filter(
  (r) => r.superstarPctOfBudget < 128 || r.superstarPctOfBudget > 142 || r.bestAffordablePct < 90 || r.bestAffordablePct > 100,
);
if (bad.length > 0) {
  console.error(`\nOUT OF TARGET: ${bad.map((r) => r.slug).join(", ")}`);
  process.exit(1);
}
console.log("\nAll clubs within tuning targets.");
