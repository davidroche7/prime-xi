import { describe, expect, it } from "vitest";
import { honourMarks } from "../honours";

describe("honourMarks", () => {
  it("parses seasons and years into short marks, majors first", () => {
    expect(honourMarks("League Championship 1987/88, 1989/90; FA Cup 1989")).toEqual([
      "LG ’88",
      "FA ’89",
    ]);
    expect(honourMarks("Champions League 2005, European Super Cup 2005, FA Cup 2006, League Cup 2003")).toEqual([
      "CL ’05",
      "FA ’06",
      "LC ’03",
    ]);
  });

  it("excludes individual awards even when they start with a competition name", () => {
    expect(honourMarks("2017/18, 2024/25 Premier League Player of the Season")).toEqual([]);
    expect(honourMarks("PFA Player of the Year 1980, FWA Footballer of the Year")).toEqual([]);
    expect(honourMarks("Premier League 2019/20, Premier League Golden Boot 2019")).toEqual(["LG ’20"]);
  });

  it("ignores honours won as a manager and caps at three marks", () => {
    expect(honourMarks("European Cup 1978, 1981, 1984. Manager: FA Cup 1986")).toEqual(["EC ’78"]);
    expect(
      honourMarks("Champions League 2019, Premier League 2019/20, UEFA Cup 2001, FA Cup 2001, League Cup 2001"),
    ).toEqual(["CL ’19", "LG ’20", "UEFA ’01"]);
  });

  it("handles missing input and trophies without a year", () => {
    expect(honourMarks(undefined)).toEqual([]);
    expect(honourMarks("UEFA Cup")).toEqual(["UEFA"]);
  });
});
