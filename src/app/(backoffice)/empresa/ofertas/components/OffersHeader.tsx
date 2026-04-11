"use client";

import { useState } from "react";
import OfertaForm from "./OfertaForm";

export default function OffersHeader({ empresaNombre }: { empresaNombre: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-[#191C1D]">
            Ofertas de <span className="text-[#526600]">{empresaNombre}</span>
          </h1>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#D9FF50] text-[#171E00] font-bold text-sm rounded-lg hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="text-xl leading-none">+</span>
            NUEVA OFERTA
          </button>
        </div>
      </header>

      <OfertaForm open={open} onClose={() => setOpen(false)} />
    </>
  );
}