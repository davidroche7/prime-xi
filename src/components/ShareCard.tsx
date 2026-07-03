"use client";

import { useCallback, useRef, useState } from "react";
import type { TeamScore } from "@/lib/scoring";
import type { Club, Formation, XiEntry } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

interface ShareCardProps {
  club: Club;
  formation: Formation;
  xi: XiEntry[];
  score: TeamScore;
  dateStamp?: string; // set in daily mode
}

const W = 1080;
const H = 1350;

function draw(canvas: HTMLCanvasElement, { club, formation, xi, score, dateStamp }: ShareCardProps) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = W;
  canvas.height = H;

  // background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#09090b");
  bg.addColorStop(1, "#18181b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // accent strip
  ctx.fillStyle = club.themeColour;
  ctx.fillRect(0, 0, W, 14);

  // header
  ctx.fillStyle = "#fafafa";
  ctx.font = "900 64px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("PRIME XI", 60, 120);
  ctx.font = "600 40px system-ui, sans-serif";
  ctx.fillStyle = "#a1a1aa";
  ctx.fillText(club.name + (dateStamp ? ` · Daily ${dateStamp}` : ""), 60, 178);

  // score block
  ctx.textAlign = "right";
  ctx.fillStyle = "#fafafa";
  ctx.font = "900 110px system-ui, sans-serif";
  ctx.fillText(String(score.overall), W - 150, 150);
  ctx.font = "700 36px system-ui, sans-serif";
  ctx.fillStyle = "#71717a";
  ctx.fillText("/99", W - 60, 150);
  ctx.fillStyle = "#fbbf24";
  ctx.font = "800 34px system-ui, sans-serif";
  ctx.fillText(score.tier.toUpperCase(), W - 60, 200);

  // mini pitch
  const px = 60;
  const py = 250;
  const pw = W - 120;
  const ph = 830;
  ctx.fillStyle = "#14532d";
  ctx.beginPath();
  ctx.roundRect(px, py, pw, ph, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 3;
  ctx.strokeRect(px + 24, py + 24, pw - 48, ph - 48);
  ctx.beginPath();
  ctx.moveTo(px + 24, py + ph / 2);
  ctx.lineTo(px + pw - 24, py + ph / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(px + pw / 2, py + ph / 2, 90, 0, Math.PI * 2);
  ctx.stroke();

  // players (formation y: attack at top on card too)
  for (const slot of formation.slots) {
    const entry = xi.find((e) => e.slotId === slot.slotId);
    if (!entry) continue;
    const cx = px + (slot.x / 100) * (pw - 100) + 50;
    const cy = py + (slot.y / 100) * (ph - 120) + 55;

    ctx.fillStyle = club.themeColour;
    ctx.beginPath();
    ctx.arc(cx, cy, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "800 28px system-ui, sans-serif";
    ctx.fillText(String(entry.player.rating), cx, cy + 10);

    const surname = entry.player.playerName.split(" ").slice(-1)[0];
    ctx.font = "700 24px system-ui, sans-serif";
    ctx.fillText(surname, cx, cy + 66);
    ctx.fillStyle = "#d4d4d8";
    ctx.font = "500 19px system-ui, sans-serif";
    ctx.fillText(entry.player.seasonLabel, cx, cy + 92);
    ctx.fillStyle = "#ffffff";
  }

  // footer
  ctx.textAlign = "center";
  ctx.fillStyle = "#71717a";
  ctx.font = "600 30px system-ui, sans-serif";
  ctx.fillText(`Build yours at ${SITE_URL.replace(/^https?:\/\//, "")}`, W / 2, H - 60);
}

export function ShareCard(props: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);

  const show = useCallback(() => {
    setOpen(true);
    requestAnimationFrame(() => {
      if (canvasRef.current) draw(canvasRef.current, props);
    });
  }, [props]);

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `prime-xi-${props.club.slug}${props.dateStamp ? `-${props.dateStamp}` : ""}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }, [props.club.slug, props.dateStamp]);

  return (
    <div>
      <button
        type="button"
        onClick={show}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-bold text-white hover:bg-emerald-500"
      >
        Create share card
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-label="Share card preview"
        >
          <div className="max-h-full w-full max-w-md overflow-auto rounded-xl bg-ink-900 p-4" onClick={(e) => e.stopPropagation()}>
            <canvas ref={canvasRef} className="w-full rounded-lg" />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={download}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-bold hover:bg-emerald-500"
              >
                Download PNG
              </button>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg bg-ink-700 px-4 py-2 hover:bg-ink-800">
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
