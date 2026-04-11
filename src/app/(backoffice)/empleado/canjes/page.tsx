import { requireRole } from "@/lib/supabase/server";
import { CanjeForm } from "./components/CanjeForm";

export default async function CanjesPage() {
  const { user } = await requireRole("empleado");

  return (
    <div className="px-4 md:px-8 py-10 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-[#191c1d]">
          Canje de <span style={{ color: "#526600" }}>Cupones</span>
        </h1>
      </div>

      <CanjeForm />
    </div>
  );
}