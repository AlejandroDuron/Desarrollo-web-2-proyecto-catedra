import { CanjeForm } from "./components/canje-form";
import { requireRole } from "@/lib/supabase/server";

export default async function CanjesPage() {
  await requireRole("empleado");

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Canjes</h3>
        <p className="text-sm text-slate-600">
          Registro base de canjes realizados por empleados.
        </p>
      </div>
      <CanjeForm />
    </section>
  );
}
