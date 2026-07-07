import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseProfile } from "../lfchistory";

const salah = readFileSync(join(__dirname, "fixtures", "salah-1317.html"), "utf8");
const mcque = readFileSync(join(__dirname, "fixtures", "mcque-758.html"), "utf8");

describe("parseProfile", () => {
  it("parses a modern profile (Salah)", () => {
    const p = parseProfile(salah);
    expect(p.birthYear).toBe(1992);
    expect(p.birthplace).toBe("Basyoun, Egypt");
    expect(p.signedFrom).toBe("Roma");
    expect(p.fee).toBe("£43.9m");
    expect(p.joinedYear).toBe(2017);
    expect(p.honours).toContain("Champions League 2019");
    expect(p.honours).toContain("Premier League 2019/20");
  });

  it("parses an 1890s profile (McQue)", () => {
    const p = parseProfile(mcque);
    expect(p.birthYear).toBe(1873);
    expect(p.birthplace).toBe("Springburn, Glasgow, Scotland");
    expect(p.signedFrom).toBe("Celtic");
    expect(p.fee).toBeUndefined(); // "Joined Liverpool: August 1892" — no fee
    expect(p.joinedYear).toBe(1892);
  });

  it("tolerates missing fields", () => {
    const p = parseProfile("<html><body><dl><div><dt>Born:</dt><dd>1 January 1900</dd></div></dl></body></html>");
    expect(p.birthYear).toBe(1900);
    expect(p.signedFrom).toBeUndefined();
    expect(p.honours).toBeUndefined();
  });

  it("decodes HTML entities in values", () => {
    const p = parseProfile("<dl><div><dt>Signed from:</dt><dd>M&#xFC;nchen &amp; Co</dd></div></dl>");
    expect(p.signedFrom).toBe("München & Co");
  });
});
