"use client";

import { ShareCardModal } from "@/components/ShareCardModal";
import type { MatchResult } from "@/lib/h2h";
import { SITE_URL } from "@/lib/site";

interface H2HShareCardProps {
  result: MatchResult;
  yourClub: string; // display name, e.g. "Liverpool"
  rivalClub: string; // display name, e.g. "Manchester United"
  eraTitle: string;
}

const W = 1080;
const H = 1080;
const OUTCOME: Record<MatchResult["outcome"], { label: string; colour: string }> = {
  W: { label: "WIN", colour: "#34d399" },
  D: { label: "DRAW", colour: "#fbbf24" },
  L: { label: "LOSS", colour: "#f87171" },
};

// scoreline only — never reveals either XI (spec §5/§6)
function draw(canvas: HTMLCanvasElement, { result, yourClub, rivalClub, eraTitle }: H2HShareCardProps) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = W;
  canvas.height = H;

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#09090b");
  bg.addColorStop(1, "#18181b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#b91c1c";
  ctx.fillRect(0, 0, W, 14);

  ctx.textAlign = "center";
  ctx.fillStyle = "#fafafa";
  ctx.font = "900 68px system-ui, sans-serif";
  ctx.fillText("HEAD TO HEAD", W / 2, 160);
  ctx.font = "600 38px system-ui, sans-serif";
  ctx.fillStyle = "#a1a1aa";
  ctx.fillText(eraTitle, W / 2, 225);

  ctx.fillStyle = "#d4d4d8";
  ctx.font = "700 52px system-ui, sans-serif";
  ctx.fillText(`${yourClub}  v  ${rivalClub}`, W / 2, 400);

  ctx.fillStyle = OUTCOME[result.outcome].colour;
  ctx.font = "900 260px system-ui, sans-serif";
  ctx.fillText(result.scoreline, W / 2, 640);
  ctx.font = "800 60px system-ui, sans-serif";
  ctx.fillText(OUTCOME[result.outcome].label, W / 2, 740);

  ctx.fillStyle = "#71717a";
  ctx.font = "600 34px system-ui, sans-serif";
  ctx.fillText(`Build yours at ${SITE_URL.replace(/^https?:\/\//, "")}`, W / 2, H - 80);
}

export function H2HShareCard(props: H2HShareCardProps) {
  return <ShareCardModal draw={(canvas) => draw(canvas, props)} filename={`head-to-head-${props.rivalClub.toLowerCase().replace(/\s+/g, "-")}.png`} />;
}
