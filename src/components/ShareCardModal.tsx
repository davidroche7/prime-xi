"use client";

import { useCallback, useRef, useState } from "react";

interface ShareCardModalProps {
  draw: (canvas: HTMLCanvasElement) => void;
  filename: string;
}

/** Button + modal + PNG download around a client-canvas share card. */
export function ShareCardModal({ draw, filename }: ShareCardModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);

  const show = useCallback(() => {
    setOpen(true);
    requestAnimationFrame(() => {
      if (canvasRef.current) draw(canvasRef.current);
    });
  }, [draw]);

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = filename;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }, [filename]);

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
