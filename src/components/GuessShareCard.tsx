"use client";

import { useCallback, useRef, useState } from "react";
import { score, type GuessState } from "@/lib/guessGame";
import { SITE_URL } from "@/lib/site";

interface GuessShareCardProps {
  state: GuessState;
  dateUTC: string;
  mode: "normal" | "hard";
}

const W = 1080;
const H = 1080;

function draw(canvas: HTMLCanvasElement, { state, dateUTC, mode }: GuessShareCardProps) {
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

  ctx.fillStyle = "#fafafa";
  ctx.font = "900 76px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("GUESS THE RED", W / 2, 170);
  ctx.font = "600 40px system-ui, sans-serif";
  ctx.fillStyle = "#a1a1aa";
  ctx.fillText(dateUTC + (mode === "hard" ? "  ·  HARD" : ""), W / 2, 240);

  // result — mirrors shareText(): attempts out of six clues
  ctx.fillStyle = "#fafafa";
  ctx.font = "900 170px system-ui, sans-serif";
  ctx.fillText(state.solved ? `${state.cluesRevealed}/6` : "X/6", W / 2, 480);
  ctx.font = "700 44px system-ui, sans-serif";
  ctx.fillStyle = state.solved ? "#34d399" : "#f87171";
  ctx.fillText(state.solved ? `solved · ${score(state)} pts` : "not today", W / 2, 560);

  // clue boxes — same grid as the emoji share text
  const cells: string[] = state.solved
    ? [...Array(state.cluesRevealed - 1).fill("#b91c1c"), "#16a34a"]
    : [...Array(state.cluesRevealed).fill("#b91c1c"), "#27272a"];
  const size = 110;
  const gap = 22;
  const x0 = (W - (cells.length * size + (cells.length - 1) * gap)) / 2;
  cells.forEach((fill, i) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(x0 + i * (size + gap), 640, size, size, 18);
    ctx.fill();
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "#71717a";
  ctx.font = "600 34px system-ui, sans-serif";
  ctx.fillText(`Play today's at ${SITE_URL.replace(/^https?:\/\//, "")}`, W / 2, H - 80);
}

export function GuessShareCard(props: GuessShareCardProps) {
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
    a.download = `guess-the-red-${props.dateUTC}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }, [props.dateUTC]);

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="rounded-lg border border-ink-700 px-4 py-2 font-bold text-zinc-200 hover:border-red-700"
      >
        Share card
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-label="Share card preview"
        >
          <div
            className="max-h-full w-full max-w-md overflow-auto rounded-xl bg-ink-900 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <canvas ref={canvasRef} className="w-full rounded-lg" />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={download}
                className="flex-1 rounded-lg bg-red-700 px-4 py-2 font-bold hover:bg-red-600"
              >
                Download PNG
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-ink-700 px-4 py-2 hover:bg-ink-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
