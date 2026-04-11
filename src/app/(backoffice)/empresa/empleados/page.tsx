import { getEmpleados } from "./actions";
import EmpleadosHeader from "./components/EmpleadosHeader";
import EmpleadoTable   from "./components/EmpleadoTable";

export default async function EmpleadosPage() {
  const empleados = await getEmpleados();

  return (
    <div className="px-4 md:px-8 py-10 max-w-7xl mx-auto">
      <EmpleadosHeader total={empleados.length} />
      <EmpleadoTable empleados={empleados} />
    </div>
  );
}