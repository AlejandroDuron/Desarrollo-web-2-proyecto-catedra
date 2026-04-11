"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, useTransition } from "react";

const TABS = [
  { label: "En Espera", value: "En espera de aprobación" },
  { label: "Aprobadas", value: "Oferta aprobada" },
  { label: "Rechazadas", value: "Oferta rechazada" },
  { label: "Descartadas", value: "Oferta descartada" }
];

export default function OfertasFiltros() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentStatus = searchParams.get("status") || "En espera de aprobación";
  const currentQuery = searchParams.get("query") || "";

  const [searchTerm, setSearchTerm] = useState(currentQuery);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  // Debounce for the search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== currentQuery) {
          router.replace(`${pathname}?${createQueryString("query", searchTerm)}`);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentQuery, pathname, router, createQueryString]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between pb-4 backdrop-blur-sm border-b border-[var(--border)] mb-6">
      {/* Barra de Búsqueda */}
      <div className="relative w-full max-w-sm">
         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input 
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar título o empresa..."
          className="w-full border border-[var(--border)] rounded-[var(--radius-lg)] pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--green)] font-mono transition-colors"
        />
      </div>

      {/* Tabs */}
      <div className="flex bg-[#EDEEEF] p-1 rounded-[var(--radius-lg)] shadow-inner overflow-x-auto min-w-max hide-scrollbars">
        {TABS.map((tab) => {
          const isActive = currentStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => {
                startTransition(() => {
                    router.push(`${pathname}?${createQueryString("status", tab.value)}`);
                    setSearchTerm(""); // Clean search on tab switch optionally
                });
              }}
              className={`px-4 py-2 text-sm font-bold rounded-[var(--radius-sm)] flex-shrink-0 whitespace-nowrap transition-all ${
                isActive ? "bg-[var(--green)] text-white shadow" : "text-[#191C1D] hover:bg-slate-200"
              }`}
              style={{ transition: "var(--transition)" }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
