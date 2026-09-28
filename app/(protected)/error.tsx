"use client";

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="pixel-panel rounded-xl bg-ink px-6 py-16 text-center text-white">
      <p className="font-display text-lg text-danger">GAME OVER</p>
      <p className="mt-3 text-sm text-white/80">
        {error.message || "No pudimos completar la acción."}
      </p>
      <button
        onClick={reset}
        className="pixel-btn mt-6 rounded-lg bg-coin px-5 py-2 font-display text-xs text-ink hover:bg-coin-dark"
      >
        Continuar? ▶
      </button>
    </div>
  );
}
