"use client";

type EstadoOferta = "activa" | "agotandose" | "en_espera" | "rechazada" | "pasada";

interface OfferCardProps {
    titulo: string;
    diasRestantes: number;
    ventas: number;
    disponibles: number;
    ingresos: number;
    comision: number;
    comisionPct: number;
    imagenUrl: string;
    estado: EstadoOferta;
}

const BADGE: Record<EstadoOferta, { classes: string; label: string }> = {
    activa: { classes: "bg-[#D9FF50] text-[#171E00]", label: "Activa" },
    agotandose: { classes: "bg-[#D5E893] text-[#596923]", label: "Agotándose" },
    en_espera: { classes: "bg-[#E1E3E4] text-[#454935]", label: "En Espera" },
    rechazada: { classes: "bg-[#FFDAD6] text-[#93000A]", label: "Rechazada" },
    pasada: { classes: "bg-[#E1E3E4] text-[#454935]", label: "Pasada" },
};

// Locale fijo para evitar mismatch de hidratación servidor/cliente
const fmt = (n: number) => n.toLocaleString("en-US");

export default function OfferCard({
    titulo, diasRestantes, ventas, disponibles,
    ingresos, comision, comisionPct, imagenUrl, estado,
}: OfferCardProps) {
    const badge = BADGE[estado];
    const isLow = disponibles <= 10;

    return (
        <div className="bg-white rounded-xl overflow-hidden border border-[#EDEEEF] hover:shadow-xl transition-all duration-300 group">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={imagenUrl}
                    alt={titulo}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${badge.classes}`}>
                        {badge.label}
                    </span>
                </div>
            </div>

            <div className="p-6 ">
                <div className="mb-4">
                    <h3 className="text-lg font-bold leading-tight mb-1 text-[#191C1D]">{titulo}</h3>
                    <p className="text-xs text-[#454935]">
                        {diasRestantes > 0 ? `Vence en: ${diasRestantes} días` : "Vencida"}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#EDEEEF]">

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#454935] mb-1">
                            Ventas
                        </p>
                        <p className="text-lg font-bold text-[#191C1D]">
                            {fmt(ventas)}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#454935] mb-1">
                            Disponibles
                        </p>
                        <p className={`text-lg font-bold ${disponibles <= 10 ? "text-[#ba1a1a]" : "text-[#191C1D]"}`}>
                            {fmt(disponibles)}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#454935] mb-1">
                            Ingresos
                        </p>
                        <p className="text-lg font-bold text-[#191C1D]">
                            ${fmt(ingresos)}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#454935] mb-1">
                            Comision ({comisionPct}%)
                        </p>
                        <p className="text-lg font-bold text-[#526600]">
                            ${fmt(comision)}
                        </p>
                    </div>

                </div>

                <button className="w-full mt-6 py-3 bg-[#D9FF50] text-[#171E00] text-xs font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity">
                    Ver Oferta
                </button>
            </div>
        </div>
    );
}