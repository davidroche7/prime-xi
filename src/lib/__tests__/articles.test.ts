import { describe, expect, it } from "vitest";
import { ARTICLES, wordCount } from "../articles";

describe("articles", () => {
  it("are long enough to stand on their own", () => {
    expect(ARTICLES.filter((a) => wordCount(a) < 700).map((a) => [a.slug, wordCount(a)])).toEqual([]);
  });

  it("have unique slugs", () => {
    expect(new Set(ARTICLES.map((a) => a.slug)).size).toBe(ARTICLES.length);
  });
});
