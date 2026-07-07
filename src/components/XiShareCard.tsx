"use client";

import { ShareCardModal } from "@/components/ShareCardModal";
import type { XiScore } from "@/lib/perfectXi";
import { SITE_URL } from "@/lib/site";

interface XiShareCardProps {
  score: XiScore;
  eraTitle: string;
  eraSlug: string;
  attempts: number;
}

const W = 1080;
const H = 1080;

// counts only — never which picks were right (spec §5)
function draw(canvas: HTMLCanvasElement, { score, eraTitle, attempts }: XiShareCardProps) {
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
  ctx.fillText("THE PERFECT XI", W / 2, 160);
  ctx.font = "600 38px system-ui, sans-serif";
  ctx.fillStyle = "#a1a1aa";
  ctx.fillText(eraTitle, W / 2, 225);

  ctx.fillStyle = score.perfect ? "#34d399" : "#fafafa";
  ctx.font = "900 190px system-ui, sans-serif";
  ctx.fillText(`${score.total}`, W / 2, 480);
  ctx.font = "700 50px system-ui, sans-serif";
  ctx.fillStyle = "#71717a";
  ctx.fillText("/ 98", W / 2, 550);

  ctx.font = "700 42px system-ui, sans-serif";
  ctx.fillStyle = "#d4d4d8";
  const tick = (b: boolean) => (b ? "✓" : "✗");
  ctx.fillText(`Players ${score.playersCorrect}/11 · Seasons ${score.seasonsCorrect}/11`, W / 2, 680);
  ctx.fillText(
    `Formation ${tick(score.formationCorrect)} · Manager ${tick(score.managerCorrect)} · Peak ${tick(score.managerSeasonCorrect)}`,
    W / 2,
    750,
  );
  ctx.font = "600 36px system-ui, sans-serif";
  ctx.fillStyle = score.perfect ? "#34d399" : "#a1a1aa";
  ctx.fillText(score.perfect ? `PERFECT — found in ${attempts} attempts` : `attempt ${attempts}`, W / 2, 840);

  ctx.fillStyle = "#71717a";
  ctx.font = "600 34px system-ui, sans-serif";
  ctx.fillText(`Build yours at ${SITE_URL.replace(/^https?:\/\//, "")}`, W / 2, H - 80);
}

export function XiShareCard(props: XiShareCardProps) {
  return (
    <ShareCardModal
      draw={(canvas) => draw(canvas, props)}
      filename={`perfect-xi-${props.eraSlug}.png`}
    />
  );
}
