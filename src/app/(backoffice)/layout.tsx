import { logoutAction } from "@/lib/auth/actions";
import { requireAuthenticatedEmployee } from "@/lib/supabase/server";
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
  admin_general: {
    badge: "Admin general",
    title: "Panel administrativo",
    accent: "text-lime-700",
    description: "Gestion global de empresas, ofertas, clientes y seguridad.",
  },
  admin_empresa: {
    badge: "Admin empresa",
    title: "Panel de empresa",
    accent: "text-emerald-700",
    description: "Operacion interna de la empresa, su equipo y sus ofertas.",
  },
  empleado: {
    badge: "Empleado",
    title: "Panel operativo",
    accent: "text-amber-700",
    description: "Canjes, validaciones operativas y ajustes basicos de seguridad.",
  },
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, empleado } = await requireAuthenticatedEmployee();
  const currentRoleContent = roleContent[empleado.rol];

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
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

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user.email}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                {empleado.activo ? "Usuario activo" : "Usuario inactivo"}
              </p>
            </div>

            <form action={logoutAction}>
              <button className="btn btn-outline" type="submit">
                Cerrar sesion
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
