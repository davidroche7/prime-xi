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
        className="border-2 border-current px-4 py-2 text-xs font-bold uppercase tracking-wide hover:opacity-75"
      >
        Share card
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/80 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-label="Share card preview"
        >
          <div
            className="shadow-poster max-h-full w-full max-w-md overflow-auto border-[3px] border-ink-950 bg-paper-50 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <canvas ref={canvasRef} className="w-full border-2 border-ink-950" />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={download}
                className="flex-1 border-2 border-ink-950 bg-blood-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white hover:bg-blood-700"
              >
                Download PNG
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border-2 border-ink-950 bg-paper-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-ink-950 hover:bg-sand-300/60"
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
