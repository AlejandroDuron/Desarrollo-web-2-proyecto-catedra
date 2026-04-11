"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/types/roles";

const navLinks: Record<Role, { label: string; href: string }[]> = {
  admin_general: [
    { label: "Dashboard", href: "/admin" },
    { label: "Empresas", href: "/admin/empresas" },
    { label: "Ofertas", href: "/admin/ofertas" },
    { label: "Rubros", href: "/admin/rubros" },
    { label: "Supervisión", href: "/admin/supervision" },
    { label: "Clientes", href: "/admin/clientes" },
  ],
  admin_empresa: [
    { label: "Ofertas", href: "/empresa/ofertas" },
    { label: "Empleados", href: "/empresa/empleados" },
  ],
  empleado: [{ label: "Canjes", href: "/empleado/canjes" }],
};

export function NavigationLinks({ rol }: { rol: Role }) {
  const pathname = usePathname();
  const links = navLinks[rol] ?? [];

  return (
    <div className="hidden gap-1 md:flex">
      {links.map((link) => {
        // Validación exacta para el dashboard "/admin"
        const isDashboard = link.href === "/admin";
        const isActive = isDashboard 
          ? pathname === "/admin" 
          : pathname.startsWith(link.href);

        const activeClass = isActive 
          ? "text-[var(--green)] bg-[#EDEEEF]" 
          : "text-[#191C1D]";

        return (
          <Link
            key={link.href}
            href={link.href}
            style={{ transition: "var(--transition)" }}
            className={`rounded-lg px-4 py-2 text-sm font-bold hover:bg-[#EDEEEF] hover:text-[var(--green)] ${activeClass}`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
