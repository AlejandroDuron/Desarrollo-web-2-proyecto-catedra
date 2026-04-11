"use client";

import { useState } from "react";

const TABS = [
  { key: "activas",            label: "Activas",           count: 12 },
  { key: "en_espera",          label: "En espera",         count: 3  },
  { key: "aprobadas_futuras",  label: "Aprobadas Futuras", count: 5  },
  { key: "pasadas",            label: "Pasadas",           count: 42 },
  { key: "rechazadas",         label: "Rechazadas",        count: 2  },
  { key: "descartadas",        label: "Descartadas",       count: 1  },
];

interface OffersTabsProps {
  onTabChange?: (tab: string) => void;
}

export default function OffersTabs({ onTabChange }: OffersTabsProps) {
  const [active, setActive] = useState("activas");

  const handleClick = (key: string) => {
    setActive(key);
    onTabChange?.(key);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => handleClick(tab.key)}
            className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              isActive
                ? "bg-[#191C1D] text-[#F8F9FA]"
                : "bg-[#E7E8E9] text-[#454935] hover:bg-[#E1E3E4]"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        );
      })}
    </div>
  );
}