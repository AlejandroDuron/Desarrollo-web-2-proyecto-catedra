"use client";

import Link from "next/link";
import { useActionState } from "react";

import { recoveryAction, type AuthActionState } from "@/lib/auth/actions";

const initialState: AuthActionState = {};

export default function RecoveryPage() {
  const [state, formAction, pending] = useActionState(recoveryAction, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-6 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[#e1e3e4] bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#191c1d]">Recuperar Acceso</h1>
          <p className="mt-2 text-sm text-[#454935]">
            Ingresa el correo asociado a tu cuenta administrativa.
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

          {state.error ? (
            <p className="rounded-lg border border-[#ffdad6] bg-[#fff5f4] px-4 py-3 text-sm text-[#ba1a1a]">
              {state.error}
            </p>
          ) : null}

          {state.success ? (
            <p className="rounded-lg border border-[#d8eb96] bg-[#f6fdd7] px-4 py-3 text-sm text-[#526600]">
              {state.success}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-[linear-gradient(135deg,#CCF143_0%,#D9FF50_100%)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#171e00] transition hover:brightness-[0.98] disabled:opacity-70"
          >
            {pending ? "Enviando..." : "Enviar Recuperacion"}
          </button>
        </form>

        <Link className="mt-6 inline-flex text-sm font-semibold text-[#526600] hover:underline" href="/login">
          Volver al inicio de sesion
        </Link>
      </section>
    </main>
  );
}
