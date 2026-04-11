"use client";

import Link from "next/link";
import { useState } from "react";

const ROL_ACTIVO = "admin_empresa";

const navLinks: Record<string, { label: string; href: string }[]> = {
  admin_general: [
    { label: "Empresas",  href: "/admin/empresas" },
    { label: "Rubros",    href: "/admin/rubros" },
    { label: "Ofertas",   href: "/admin/ofertas" },
    { label: "Clientes",  href: "/admin/clientes" },
  ],
  admin_empresa: [
    { label: "Ofertas",   href: "/empresa/ofertas" },
    { label: "Empleados", href: "/empresa/empleados" },
  ],
  empleado: [
    { label: "Canjes", href: "/empleado/canjes" },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = navLinks[ROL_ACTIVO] ?? [];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 h-16 flex items-center justify-between px-8 bg-[#F8F9FA]/90 backdrop-blur-xl border-b border-[#191C1D]/10">
        <Link href="/" className="text-2xl font-black tracking-tighter text-[#191C1D]">
          La Cuponera
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-bold text-[#191C1D] hover:bg-[#EDEEEF] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-10 h-10 rounded-full font-bold text-sm bg-[#526600] text-[#D9FF50] hover:opacity-90 transition-opacity"
            >
              JS
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#191C1D]/10 overflow-hidden z-50">
                <div className="py-2">
                  <Link
                    href="/empresa/seguridad"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#191C1D] hover:bg-[#D9FF50] hover:text-[#171E00] transition-colors"
                  >
                    Cambiar Contraseña
                  </Link>
                  <hr className="border-[#191C1D]/10 mx-4 my-1" />
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#ba1a1a] hover:bg-[#FFDAD6] transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-16">{children}</main>
    </>
  );
}