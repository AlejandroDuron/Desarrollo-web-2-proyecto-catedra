"use client";

import { useTransition } from "react";
import { aprobarOferta } from "../../actions";

export default function AprobarBoton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await aprobarOferta(id);
        });
      }}
      disabled={isPending}
      className={`px-4 py-2 bg-[var(--green)] text-white text-sm font-bold rounded-[var(--radius-sm)] hover:bg-[var(--green2)] transition-colors ${isPending ? "opacity-50" : ""}`}
    >
      {isPending ? "Ejecutando..." : "Aprobar"}
    </button>
  );
}
