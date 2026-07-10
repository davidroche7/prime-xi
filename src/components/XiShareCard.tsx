"use client";

import { ShareCardModal } from "@/components/ShareCardModal";
import type { XiScore } from "@/lib/perfectXi";
import {
  CARD_H as H,
  CARD_W as W,
  CREAM,
  DISPLAY,
  DUNE,
  INK,
  PITCH,
  plate,
  posterGround,
} from "@/lib/shareCanvas";
import { SITE_URL } from "@/lib/site";

interface XiShareCardProps {
  score: XiScore;
  eraTitle: string;
  eraSlug: string;
  attempts: number;
}

// counts only — never which picks were right (spec §5)
function draw(canvas: HTMLCanvasElement, { score, eraTitle, attempts }: XiShareCardProps) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = W;
  canvas.height = H;

  posterGround(ctx);

  ctx.textAlign = "center";
  ctx.fillStyle = CREAM;
  ctx.font = `64px ${DISPLAY}`;
  ctx.fillText("THE PERFECT XI", W / 2, 170);
  ctx.font = "bold 36px Archivo, system-ui, sans-serif";
  ctx.fillText(eraTitle.toUpperCase(), W / 2, 235);

  plate(ctx, 140, 300, W - 280, 480);

  ctx.fillStyle = score.perfect ? PITCH : INK;
  ctx.font = `190px ${DISPLAY}`;
  ctx.fillText(`${score.total}`, W / 2, 520);
  ctx.font = `46px ${DISPLAY}`;
  ctx.fillStyle = DUNE;
  ctx.fillText("/ 98", W / 2, 590);

  ctx.font = "bold 38px Archivo, system-ui, sans-serif";
  ctx.fillStyle = INK;
  const tick = (b: boolean) => (b ? "✓" : "✗");
  ctx.fillText(`Players ${score.playersCorrect}/11 · Seasons ${score.seasonsCorrect}/11`, W / 2, 665);
  ctx.fillText(
    `Formation ${tick(score.formationCorrect)} · Manager ${tick(score.managerCorrect)} · Peak ${tick(score.managerSeasonCorrect)}`,
    W / 2,
    725,
  );

  ctx.font = `40px ${DISPLAY}`;
  ctx.fillStyle = score.perfect ? INK : CREAM;
  ctx.fillText(
    score.perfect ? `PERFECT — FOUND IN ${attempts} ATTEMPTS` : `ATTEMPT ${attempts}`,
    W / 2,
    880,
  );

  ctx.fillStyle = CREAM;
  ctx.font = "bold 34px Archivo, system-ui, sans-serif";
  ctx.fillText(`Build yours at ${SITE_URL.replace(/^https?:\/\//, "")}`, W / 2, H - 70);
}

export function XiShareCard(props: XiShareCardProps) {
  return (
    <ShareCardModal
      draw={(canvas) => draw(canvas, props)}
      filename={`perfect-xi-${props.eraSlug}.png`}
    />
  );
}
