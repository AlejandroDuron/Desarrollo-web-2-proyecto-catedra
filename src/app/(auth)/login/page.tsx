"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginAction, type AuthActionState } from "@/lib/auth/actions";

const initialState: AuthActionState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-6 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[#e1e3e4] bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#191c1d]">Iniciar Sesion</h1>
          <p className="mt-2 text-sm text-[#454935]">
            Ingresa tus credenciales administrativas.
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#757963]"
              htmlFor="email"
            >
              Correo electronico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="admin@lacuponera.com"
              className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
              required
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#757963]"
                htmlFor="password"
              >
                Contrasena
              </label>
              <Link className="text-xs font-semibold text-[#526600] hover:underline" href="/recovery">
                Olvidaste tu contrasena?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="********"
              className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
              required
            />
          </div>

          {state.error ? (
            <p className="rounded-lg border border-[#ffdad6] bg-[#fff5f4] px-4 py-3 text-sm text-[#ba1a1a]">
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-[linear-gradient(135deg,#CCF143_0%,#D9FF50_100%)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#171e00] transition hover:brightness-[0.98] disabled:opacity-70"
          >
            {pending ? "Validando..." : "Iniciar Sesion"}
          </button>
        </form>
      </section>
    </main>
  );
}
