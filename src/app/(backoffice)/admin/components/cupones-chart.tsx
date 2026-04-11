export default function CuponesChart({ datos }: { datos: any[] }) {
  const currentDate = new Date().getTime();

  let disponibles = 0;
  let canjeados = 0;
  let vencidos = 0;

  datos.forEach((cupon) => {
    const isVencido = cupon.estado_cupon === 'Vencido' || (cupon.ofertas?.fecha_limite_uso && new Date(cupon.ofertas.fecha_limite_uso).getTime() < currentDate && cupon.estado_cupon !== 'Canjeado');
    
    if (cupon.estado_cupon === 'Canjeado') {
      canjeados++;
    } else if (isVencido) {
      vencidos++;
    } else if (cupon.estado_cupon === 'Disponible') {
      disponibles++;
    }
  });

  const total = datos.length || 1; // avoid division by 0

  return (
    <div className="card p-6 flex flex-col min-h-full border border-[var(--border)] bg-white h-full">
      <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>Salud del Consumidor</h3>
      <p className="text-sm text-[var(--muted)] mb-6">Estado global de los cupones extraídos.</p>
      
      {datos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-[#EDEEEF] rounded-lg">
           <span className="text-sm text-[var(--muted)] font-mono">No hay suficientes datos.</span>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between">
            <div className="space-y-4 mb-6">
               <div>
                  <div className="flex justify-between text-sm mb-1 font-bold">
                    <span>Disponibles</span>
                    <span className="font-mono text-[var(--green2)]">{disponibles}</span>
                  </div>
                  <div className="w-full bg-[#EDEEEF] rounded-full h-2.5 overflow-hidden">
                    <div className="bg-[var(--green)] h-2.5 rounded-full" style={{ width: `${(disponibles/total)*100}%` }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-sm mb-1 font-bold">
                    <span>Canjeados</span>
                    <span className="font-mono text-blue-600">{canjeados}</span>
                  </div>
                  <div className="w-full bg-[#EDEEEF] rounded-full h-2.5 overflow-hidden">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(canjeados/total)*100}%` }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-sm mb-1 font-bold">
                    <span>Vencidos</span>
                    <span className="font-mono text-[#ba1a1a]">{vencidos}</span>
                  </div>
                  <div className="w-full bg-[#EDEEEF] rounded-full h-2.5 overflow-hidden">
                    <div className="bg-[#ba1a1a] h-2.5 rounded-full" style={{ width: `${(vencidos/total)*100}%` }}></div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-auto p-4 bg-[#EDEEEF] rounded-lg text-center divide-x divide-slate-300">
               <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--muted)] font-bold mb-1">Stock</p>
                  <p className="font-mono font-bold text-sm text-[var(--text)]">{((disponibles/total)*100).toFixed(1)}%</p>
               </div>
               <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--muted)] font-bold mb-1">Uso</p>
                  <p className="font-mono font-bold text-sm text-[var(--text)]">{((canjeados/total)*100).toFixed(1)}%</p>
               </div>
               <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--muted)] font-bold mb-1">Mermas</p>
                  <p className="font-mono font-bold text-sm text-[var(--text)]">{((vencidos/total)*100).toFixed(1)}%</p>
               </div>
            </div>
        </div>
      )}
    </div>
  );
}
