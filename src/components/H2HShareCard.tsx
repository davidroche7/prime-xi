"use client";

import { ShareCardModal } from "@/components/ShareCardModal";
import type { MatchResult } from "@/lib/h2h";
import {
  CARD_H as H,
  CARD_W as W,
  CREAM,
  DEEP_RED,
  DISPLAY,
  DUNE,
  INK,
  PITCH,
  plate,
  posterGround,
} from "@/lib/shareCanvas";
import { SITE_URL } from "@/lib/site";

interface H2HShareCardProps {
  result: MatchResult;
  yourClub: string; // display name, e.g. "Liverpool"
  rivalClub: string; // display name, e.g. "Manchester United"
  eraTitle: string;
}

const OUTCOME: Record<MatchResult["outcome"], { label: string; colour: string }> = {
  W: { label: "WIN", colour: PITCH },
  D: { label: "DRAW", colour: DUNE },
  L: { label: "LOSS", colour: DEEP_RED },
};

// scoreline only — never reveals either XI (spec §5/§6)
function draw(canvas: HTMLCanvasElement, { result, yourClub, rivalClub, eraTitle }: H2HShareCardProps) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = W;
  canvas.height = H;

  posterGround(ctx);

  ctx.textAlign = "center";
  ctx.fillStyle = CREAM;
  ctx.font = `64px ${DISPLAY}`;
  ctx.fillText("HEAD TO HEAD", W / 2, 170);
  ctx.font = "bold 36px Archivo, system-ui, sans-serif";
  ctx.fillText(eraTitle.toUpperCase(), W / 2, 235);

  plate(ctx, 110, 310, W - 220, 470);

  ctx.fillStyle = INK;
  ctx.font = `44px ${DISPLAY}`;
  ctx.fillText(`${yourClub.toUpperCase()}  V  ${rivalClub.toUpperCase()}`, W / 2, 410);

  ctx.fillStyle = OUTCOME[result.outcome].colour;
  ctx.font = `240px ${DISPLAY}`;
  ctx.fillText(result.scoreline, W / 2, 650);
  ctx.font = `56px ${DISPLAY}`;
  ctx.fillText(OUTCOME[result.outcome].label, W / 2, 740);

  ctx.fillStyle = CREAM;
  ctx.font = "bold 34px Archivo, system-ui, sans-serif";
  ctx.fillText(`Build yours at ${SITE_URL.replace(/^https?:\/\//, "")}`, W / 2, H - 70);
}

export function H2HShareCard(props: H2HShareCardProps) {
  return (
    <ShareCardModal
      draw={(canvas) => draw(canvas, props)}
      filename={`head-to-head-${props.rivalClub.toLowerCase().replace(/\s+/g, "-")}.png`}
    />
  );
}
