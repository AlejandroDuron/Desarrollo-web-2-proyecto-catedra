"use client";

import { useState, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import { fetchHistorialCliente } from "../actions";

const TABS = ["Disponibles", "Canjeados", "Vencidos"];

export default function ClienteHistorial({ cliente }: { cliente: { id: string, nombres: string, apellidos: string|null } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Disponibles");
  const [mounted, setMounted] = useState(false);
  
  const [data, setData] = useState<any[] | null>(null);
  const [loading, startTransition] = useTransition();

  useEffect(() => setMounted(true), []);

  const openModal = () => {
     setIsOpen(true);
     if (!data) {
        startTransition(async () => {
            try {
               const res = await fetchHistorialCliente(cliente.id);
               setData(res);
            } catch (e: any) {
               console.error(e);
               setData([]);
            }
        });
     }
  };

  const getFilteredData = () => {
     if (!data) return [];
     const today = new Date().getTime();
     
     return data.filter(cupon => {
         const isVencido = cupon.estado_cupon === 'Vencido' || (cupon.ofertas?.fecha_limite_uso && new Date(cupon.ofertas.fecha_limite_uso).getTime() < today && cupon.estado_cupon !== 'Canjeado');
         
         if (activeTab === "Canjeados") return cupon.estado_cupon === "Canjeado";
         if (activeTab === "Vencidos") return isVencido;
         
         // Disponibles
         return cupon.estado_cupon === "Disponible" && !isVencido;
     });
  };

  const displayedList = getFilteredData();

  return (
    <>
      <button 
        onClick={openModal}
        className="px-4 py-1.5 border border-[var(--border)] text-[var(--text)] text-xs font-bold font-mono rounded-[var(--radius-sm)] hover:bg-[var(--surface)] transition-colors"
      >
        Ver Historial
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[var(--bg)] rounded-[var(--radius-lg)] w-full max-w-4xl min-h-[60vh] max-h-[90vh] flex flex-col card shadow-2xl overflow-hidden">
            
            <div className="p-6 pb-4 border-b border-[var(--border)] shrink-0 flex justify-between items-center bg-[var(--surface)]">
               <div>
                 <h2 className="text-2xl font-black mb-1 capitalize text-[var(--text)]" style={{ fontFamily: "var(--font-display)" }}>
                   Historial: {cliente.nombres} {cliente.apellidos || ''}
                 </h2>
                 <p className="text-sm font-mono text-[var(--subtle)]">Supervisión de consumo de cupones personales</p>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-[#ba1a1a] bg-red-100 hover:bg-red-200 transition-colors w-8 h-8 rounded-full flex items-center justify-center font-bold text-xl">&times;</button>
            </div>

            <div className="bg-[#EDEEEF] p-4 flex gap-2 shrink-0 border-b border-[var(--border)] overflow-x-auto hide-scrollbars">
               {TABS.map(tab => (
                 <button 
                   key={tab} 
                   onClick={() => setActiveTab(tab)}
                   className={`px-4 py-2 font-bold text-sm rounded-[var(--radius-sm)] transition-all ${activeTab === tab ? "bg-[var(--green)] text-white shadow" : "text-[#191C1D] hover:bg-slate-200"}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-[var(--bg)]">
                {!data ? (
                   <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-4">
                     {[1,2,3,4].map(i => <div key={i} className="h-28 bg-[var(--surface)] rounded-lg"></div>)}
                   </div>
                ) : displayedList.length === 0 ? (
                   <div className="text-center p-12 text-[var(--muted)] border border-dashed border-[var(--border)] rounded-lg">
                     No hay registros computados en la clasificación de {activeTab}.
                   </div>
                ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {displayedList.map(item => (
                        <div key={item.codigo_unico} className="border border-[var(--border)] rounded-lg p-4 bg-white hover:border-[var(--green)] transition-all group shadow-sm">
                           <div className="flex justify-between items-start mb-2">
                             <span className="font-mono text-xs font-bold bg-[#EDEEEF] px-2 py-0.5 rounded text-[var(--text)]">
                               {item.codigo_unico}
                             </span>
                             {activeTab === 'Disponibles' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--green)] shadow-sm"></div>}
                             {activeTab === 'Vencidos' && <div className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] shadow-sm"></div>}
                             {activeTab === 'Canjeados' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div>}
                           </div>
                           <p className="font-bold text-sm mb-1 text-[var(--text)]">{item.ofertas?.titulo}</p>
                           <p className="text-xs text-[var(--subtle)] font-bold mb-2 uppercase">{item.ofertas?.empresas?.nombre_empresa}</p>
                           <div className="flex justify-between items-end border-t border-[var(--surface2)] pt-3 mt-3">
                             <div className="flex flex-col">
                                <span className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-wider">Vencimiento</span>
                                <span className="font-mono text-xs text-[var(--subtle)]">{item.ofertas?.fecha_limite_uso ? new Date(item.ofertas.fecha_limite_uso).toLocaleDateString() : 'N/A'}</span>
                             </div>
                             <span className="font-mono text-sm font-bold text-[var(--green2)] bg-[var(--green-bg)] px-2 py-1 rounded">
                                ${Number(item.ofertas?.precio_oferta).toFixed(2)}
                             </span>
                           </div>
                        </div>
                     ))}
                   </div>
                )}
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
