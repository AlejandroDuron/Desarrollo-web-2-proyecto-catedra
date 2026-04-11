"use client";

import { useState } from "react";
import OffersGrid from "./OffersGrid";
import { type CategoriaOferta, type OfertaConMetricas } from "../actions";

const TAB_CONFIG: { key: CategoriaOferta; label: string }[] = [
  { key: "activas",            label: "Activas"           },
  { key: "en_espera",          label: "En espera"         },
  { key: "aprobadas_futuras",  label: "Aprobadas Futuras" },
  { key: "pasadas",            label: "Pasadas"           },
  { key: "rechazadas",         label: "Rechazadas"        },
  { key: "descartadas",        label: "Descartadas"       },
];

interface OffersTabsProps {
  conteos:              Record<CategoriaOferta, number>;
  ofertasPorCategoria:  Record<CategoriaOferta, OfertaConMetricas[]>;
}

export default function OffersTabs({ conteos, ofertasPorCategoria }: OffersTabsProps) {
  const [active, setActive] = useState<CategoriaOferta>("activas");

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TAB_CONFIG.map(({ key, label }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#191C1D] text-[#F8F9FA]"
                  : "bg-[#E7E8E9] text-[#454935] hover:bg-[#E1E3E4]"
              }`}
            >
              {label} ({conteos[key]})
            </button>
          );
        })}
      </div>

      {/* Grid de la categoría activa */}
      <OffersGrid ofertas={ofertasPorCategoria[active]} categoria={active} />
    </div>
  );
}