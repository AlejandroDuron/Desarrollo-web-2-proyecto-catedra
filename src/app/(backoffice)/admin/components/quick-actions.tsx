import Link from "next/link";
import { Clock } from "lucide-react";

export default function QuickActions({ ofertas }: { ofertas: any[] }) {
  return (
    <div className="card border border-[var(--border)] bg-white h-full flex flex-col">
       <div className="p-6 border-b border-[var(--border)]">
          <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>Filtrado Pendiente</h3>
          <p className="text-sm text-[var(--muted)]">Solicitudes recientes para iniciar operaciones.</p>
       </div>
       
       <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto bg-[#fafafa]">
          {ofertas.length === 0 ? (
             <div className="text-center py-6">
                <p className="text-sm font-bold text-[var(--subtle)]">Estás al día. Bandeja vacía.</p>
             </div>
          ) : (
             ofertas.map((oferta) => (
               <div key={oferta.id} className="bg-white border text-left flex flex-col justify-between items-start border-[var(--border)] rounded-lg p-4 shadow-sm hover:border-orange-300 transition-colors">
                  <div className="w-full flex justify-between items-start mb-2">
                     <span className="text-[10px] uppercase bg-orange-100 text-orange-700 px-2 flex items-center gap-1 font-bold rounded">
                        <Clock size={10} /> En Revisión
                     </span>
                     <span className="text-xs font-mono text-[var(--muted)]">
                        {new Date(oferta.created_at).toLocaleDateString()}
                     </span>
                  </div>
                  <p className="font-bold text-sm text-[var(--text)] mb-1 line-clamp-1">{oferta.titulo}</p>
                  <p className="text-xs text-[var(--subtle)] uppercase tracking-tight">{oferta.empresas?.nombre_empresa}</p>
               </div>
             ))
          )}
       </div>

       <div className="p-4 border-t border-[var(--border)] mt-auto bg-white">
          <Link href="/admin/ofertas">
             <button className="w-full font-bold bg-[#191C1D] text-white py-2.5 rounded-[var(--radius-lg)] hover:bg-[#3f4749] transition-colors text-sm">
                 Ir a Panel de Ofertas &rarr;
             </button>
          </Link>
       </div>
    </div>
  );
}
