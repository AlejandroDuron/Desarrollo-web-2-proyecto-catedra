import Link from "next/link";
import { Zap } from "lucide-react";
import { requireAuthenticatedEmployee } from "@/lib/supabase/server";
import { NavigationLinks } from "./components/navigation-links";
import { UserMenu } from "./UserMenu";

const securityPaths = {
  admin_general: "/admin/seguridad",
  admin_empresa: "/empresa/seguridad",
  empleado:      "/empleado/seguridad",
} as const;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, empleado } = await requireAuthenticatedEmployee();
  const securityPath       = securityPaths[empleado.rol];

  return (
    <>
      <nav className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#191C1D]/10 bg-[#F8F9FA]/90 px-8 backdrop-blur-xl">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-black tracking-tighter text-[#191C1D]"
        >
          <Zap size={18} color="#84cc16" strokeWidth={2.5} />
          La Cuponera
        </Link>

        <div className="flex items-center gap-4">
          <NavigationLinks rol={empleado.rol} />
          <UserMenu
            email={user.email ?? ""}
            activo={empleado.activo}
            securityPath={securityPath}
          />
        </div>
      </nav>

      <main className="pt-16">{children}</main>
    </>
  );
}