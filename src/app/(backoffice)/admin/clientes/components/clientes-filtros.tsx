"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, useTransition } from "react";

export default function ClientesFiltros() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== currentQuery) {
          startTransition(() => {
              router.replace(`${pathname}?${createQueryString("query", searchTerm)}`);
          });
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentQuery, pathname, router, createQueryString]);

  return (
    <div className="flex w-full max-w-md pb-4 border-b border-[var(--border)] mb-6">
      <div className="relative w-full">
         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input 
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por Nombres, Apellidos o DUI..."
          className={`w-full border border-[var(--border)] rounded-[var(--radius-lg)] pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--green)] font-mono transition-colors ${isPending ? 'opacity-70' : ''}`}
        />
      </div>
    </div>
  );
}
