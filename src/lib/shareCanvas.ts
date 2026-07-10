/** Candy Terrace canvas kit for the three share cards: fleck-red poster ground,
 *  cream plate with the hard offset shadow, shared palette + display font. */

export const CARD_W = 1080;
export const CARD_H = 1080;

export const INK = "#1a0a0e";
export const RED = "#c8102e";
export const DEEP_RED = "#a41623";
export const PAPER = "#fffaef";
export const CREAM = "#f6efdf";
export const DUNE = "#6d5c48";
export const PITCH = "#1d5c33";

export const DISPLAY = "'Archivo Black', 'Arial Black', sans-serif";

/** Kit-red ground with deterministic fleck shards + ink frame. */
export function posterGround(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = RED;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // deterministic shard scatter (same look every render — shareable, stable)
  for (let i = 0; i < 90; i++) {
    const x = (i * 197) % CARD_W;
    const y = (i * 293 + 137) % CARD_H;
    const s = 8 + ((i * 53) % 12);
    const rot = ((i * 71) % 360) * (Math.PI / 180);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = i % 2 ? "rgba(246,239,223,0.5)" : "rgba(26,10,14,0.42)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(s, s * 0.35);
    ctx.lineTo(s * 0.45, s);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.strokeStyle = INK;
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, CARD_W - 20, CARD_H - 20);
}

/** Cream plate with the 3px-border / hard-offset-shadow poster treatment. */
export function plate(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = INK;
  ctx.fillRect(x + 14, y + 14, w, h);
  ctx.fillStyle = PAPER;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 8;
  ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
}
