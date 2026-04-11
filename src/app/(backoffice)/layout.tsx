import type { Role } from "@/types/roles";

const roleContent: Record<
  Role,
  {
    badge: string;
    title: string;
    accent: string;
    description: string;
  }
> = {
  admin: {
    badge: "Administrador",
    title: "Panel administrativo",
    accent: "text-sky-700",
    description: "Gestion general de empresas, clientes, ofertas y seguridad.",
  },
  empresa: {
    badge: "Empresa",
    title: "Panel de empresa ofertante",
    accent: "text-emerald-700",
    description: "Seguimiento de ofertas, empleados y configuracion del negocio.",
  },
  empleado: {
    badge: "Empleado",
    title: "Panel operativo",
    accent: "text-amber-700",
    description: "Registro de canjes y acceso a configuraciones de seguridad.",
  },
};

async function getCurrentRole(): Promise<Role> {
  // TODO: leer el rol real desde la tabla `profiles`.
  return "admin";
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentRole = await getCurrentRole();
  const currentRoleContent = roleContent[currentRole];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.2em] ${currentRoleContent.accent}`}
            >
              {currentRoleContent.badge}
            </p>
            <h1 className="text-lg font-semibold text-slate-900">
              {currentRoleContent.title}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {currentRoleContent.description}
            </p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
