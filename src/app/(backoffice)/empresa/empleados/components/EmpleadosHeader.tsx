"use client";

import { useState } from "react";
import EmpleadoForm from "./EmpleadoForm";

export default function EmpleadosHeader({ total }: { total: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-[#191C1D]">
            Empleados
          </h1>
          <p className="text-sm text-[#9EA3A6] mt-2">
            {total} {total === 1 ? "empleado registrado" : "empleados registrados"}
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#D9FF50] text-[#171E00] font-bold text-sm rounded-lg hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="text-xl leading-none">+</span>
          NUEVO EMPLEADO
        </button>
      </div>

      <EmpleadoForm open={open} onClose={() => setOpen(false)} />
    </>
  );
}