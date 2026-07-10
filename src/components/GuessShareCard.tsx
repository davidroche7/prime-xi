"use client";

import { ShareCardModal } from "@/components/ShareCardModal";
import { score, type GuessState } from "@/lib/guessGame";
import {
  CARD_H as H,
  CARD_W as W,
  CREAM,
  DEEP_RED,
  DISPLAY,
  INK,
  PITCH,
  plate,
  posterGround,
  RED,
} from "@/lib/shareCanvas";
import { SITE_URL } from "@/lib/site";

interface GuessShareCardProps {
  state: GuessState;
  dateUTC: string;
  mode: "normal" | "hard";
}

function draw(canvas: HTMLCanvasElement, { state, dateUTC, mode }: GuessShareCardProps) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = W;
  canvas.height = H;

  posterGround(ctx);

  ctx.textAlign = "center";
  ctx.fillStyle = CREAM;
  ctx.font = `70px ${DISPLAY}`;
  ctx.fillText("GUESS THE RED", W / 2, 175);
  ctx.font = "bold 38px Archivo, system-ui, sans-serif";
  ctx.fillText(dateUTC + (mode === "hard" ? "  ·  HARD" : ""), W / 2, 240);

  plate(ctx, 140, 310, W - 280, 440);

  // result — mirrors shareText(): attempts out of six clues
  ctx.fillStyle = INK;
  ctx.font = `170px ${DISPLAY}`;
  ctx.fillText(state.solved ? `${state.cluesRevealed}/6` : "X/6", W / 2, 520);
  ctx.font = `44px ${DISPLAY}`;
  ctx.fillStyle = state.solved ? PITCH : DEEP_RED;
  ctx.fillText(state.solved ? `SOLVED · ${score(state)} PTS` : "NOT TODAY", W / 2, 600);

  // clue boxes — same grid as the emoji share text
  const cells: string[] = state.solved
    ? [...Array(state.cluesRevealed - 1).fill(RED), PITCH]
    : [...Array(state.cluesRevealed).fill(RED), INK];
  const size = 100;
  const gap = 22;
  const x0 = (W - (cells.length * size + (cells.length - 1) * gap)) / 2;
  cells.forEach((fill, i) => {
    const x = x0 + i * (size + gap);
    ctx.fillStyle = INK;
    ctx.fillRect(x + 8, 660 + 8, size, size);
    ctx.fillStyle = fill;
    ctx.fillRect(x, 660, size, size);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 6;
    ctx.strokeRect(x + 3, 663, size - 6, size - 6);
  });

  ctx.fillStyle = CREAM;
  ctx.font = "bold 34px Archivo, system-ui, sans-serif";
  ctx.fillText(`Play today's at ${SITE_URL.replace(/^https?:\/\//, "")}`, W / 2, H - 70);
}

export function GuessShareCard(props: GuessShareCardProps) {
  return (
    <ShareCardModal
      draw={(canvas) => draw(canvas, props)}
      filename={`guess-the-red-${props.dateUTC}.png`}
    />
  );
}
