"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/auth/actions";

interface UserMenuProps {
  email:        string;
  activo:       boolean;
  securityPath: string;
}

export function UserMenu({ email, activo, securityPath }: UserMenuProps) {
  const [open, setOpen]         = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const ref                     = useRef<HTMLDivElement>(null);
  const btnRef                  = useRef<HTMLButtonElement>(null);
  const initials                = email.slice(0, 2).toUpperCase();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({
        top:   rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((v) => !v);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#526600] text-sm font-bold text-[#D9FF50] hover:opacity-90 transition-opacity"
      >
        {initials}
      </button>

      {open && (
        <div
          className="fixed w-64 rounded-xl border border-[#191C1D]/10 bg-white shadow-xl z-[200] overflow-hidden"
          style={{ top: dropdownPos.top, right: dropdownPos.right }}
        >
          <div className="px-4 py-3 border-b border-[#EDEEEF]">
            <p className="text-sm font-bold text-[#191C1D] truncate">{email}</p>
            <p className="text-xs uppercase tracking-widest text-[#9EA3A6] mt-0.5">
              {activo ? "Usuario activo" : "Usuario inactivo"}
            </p>
          </div>

          <div className="py-1">
            <Link
              href={securityPath}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#191C1D] hover:bg-[#F3F4F5] transition-colors"
            >
            Cambiar Contraseña
            </Link>
            <hr className="border-[#EDEEEF] mx-4 my-1" />
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#ba1a1a] hover:bg-[#FFDAD6] transition-colors"
              >
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}