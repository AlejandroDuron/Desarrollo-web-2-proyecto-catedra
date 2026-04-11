import Link from "next/link";

import { logoutAction } from "@/lib/auth/actions";
import { requireAuthenticatedEmployee } from "@/lib/supabase/server";

import { NavigationLinks } from "./components/navigation-links";

const securityPaths = {
  admin_general: "/admin/seguridad",
  admin_empresa: "/empresa/seguridad",
  empleado: "/empleado/seguridad",
} as const;

function BrandIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 2L4 14H11L10 22L20 9H13L13 2Z"
        stroke="var(--green)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, empleado } = await requireAuthenticatedEmployee();
  const securityPath = securityPaths[empleado.rol];

  return (
    <>
      <nav className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#191C1D]/10 bg-[#F8F9FA]/90 px-8 backdrop-blur-xl">
        <Link className="logo" href="/">
          <BrandIcon />
          <span>La Cuponera</span>
        </Link>

        <div className="flex items-center gap-6">
          <NavigationLinks rol={empleado.rol} />

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user.email}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                {empleado.activo ? "Usuario activo" : "Usuario inactivo"}
              </p>
            </div>

            <Link
              href={securityPath}
              className="rounded-lg px-4 py-2 text-sm font-bold text-[#191C1D] transition-colors hover:bg-[#EDEEEF]"
            >
              Cambiar contrasena
            </Link>

            <form action={logoutAction}>
              <button
                className="rounded-lg px-4 py-2 text-sm font-bold text-[#ba1a1a] transition-colors hover:bg-[#FFDAD6]"
                type="submit"
              >
                Cerrar sesion
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="pt-16">{children}</main>
    </>
  );
}
