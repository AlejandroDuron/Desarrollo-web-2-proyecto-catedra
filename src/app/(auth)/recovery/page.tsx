"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function RecoveryPage() {
  const supabase = createClient();
  const [isRecoverySession, setIsRecoverySession] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [isSendingRecovery, setIsSendingRecovery] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const recoveryCode = searchParams.get("code");
    const tokenHash = searchParams.get("token_hash");
    const queryType = searchParams.get("type");
    const queryErrorDescription = searchParams.get("error_description");
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const recoveryType = hashParams.get("type") ?? queryType;
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const hashErrorDescription = hashParams.get("error_description");

    let isMounted = true;

    function cleanupRecoveryUrl() {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    async function restoreRecoverySession() {
      const providerError = queryErrorDescription ?? hashErrorDescription;

      if (providerError) {
        if (!isMounted) {
          return;
        }

        setResetError(providerError);
        cleanupRecoveryUrl();
        return;
      }

      let error: { message: string } | null = null;

      if (recoveryType === "recovery" && tokenHash) {
        const response = await supabase.auth.verifyOtp({
          type: "recovery",
          token_hash: tokenHash,
        });
        error = response.error;
      } else if (recoveryCode) {
        const response = await supabase.auth.exchangeCodeForSession(recoveryCode);
        error = response.error;
      } else if (recoveryType === "recovery" && accessToken && refreshToken) {
        const response = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        error = response.error;
      } else {
        return;
      }

      if (!isMounted) {
        return;
      }

      if (error) {
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          setIsRecoverySession(true);
          cleanupRecoveryUrl();
          return;
        }

        setResetError(
          error.message || "El enlace de recuperacion no es valido o ya expiro.",
        );
        cleanupRecoveryUrl();
        return;
      }

      setIsRecoverySession(true);
      cleanupRecoveryUrl();
    }

    void restoreRecoverySession();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function handleRecoveryRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestError(null);
    setRequestSuccess(null);
    setResetError(null);

    if (!email) {
      setRequestError("Debes ingresar un correo electronico.");
      return;
    }

    setIsSendingRecovery(true);

    const redirectBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${redirectBaseUrl}/recovery`,
    });

    setIsSendingRecovery(false);

    if (error) {
      setRequestError(`No se pudo procesar la recuperacion: ${error.message}`);
      return;
    }

    setRequestSuccess(
      "Si el correo existe, recibiras un enlace para recuperar tu acceso.",
    );
  }

  async function handlePasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResetError(null);
    setResetSuccess(null);

    if (!password || !confirmPassword) {
      setResetError("Debes completar ambos campos.");
      return;
    }

    if (password.length < 6) {
      setResetError("La nueva contrasena debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setResetError("Las contrasenas no coinciden.");
      return;
    }

    setIsSavingPassword(true);

    const { error } = await supabase.auth.updateUser({ password });

    setIsSavingPassword(false);

    if (error) {
      setResetError("No se pudo actualizar la contrasena. Intenta de nuevo.");
      return;
    }

    setResetSuccess("Contrasena actualizada. Ya puedes iniciar sesion.");
    setPassword("");
    setConfirmPassword("");
    await supabase.auth.signOut();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-6 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[#e1e3e4] bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#191c1d]">
            {isRecoverySession ? "Crear Nueva Contrasena" : "Recuperar Acceso"}
          </h1>
          <p className="mt-2 text-sm text-[#454935]">
            {isRecoverySession
              ? "Ingresa tu nueva contrasena para completar la recuperacion."
              : "Ingresa el correo asociado a tu cuenta administrativa."}
          </p>
        </div>

        {isRecoverySession ? (
          <form className="space-y-5" onSubmit={handlePasswordReset}>
            <div>
              <label
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#757963]"
                htmlFor="password"
              >
                Nueva contrasena
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                required
              />
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#757963]"
                htmlFor="confirmPassword"
              >
                Confirmar contrasena
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                required
              />
            </div>

            {resetError ? (
              <p className="rounded-lg border border-[#ffdad6] bg-[#fff5f4] px-4 py-3 text-sm text-[#ba1a1a]">
                {resetError}
              </p>
            ) : null}

            {resetSuccess ? (
              <p className="rounded-lg border border-[#d8eb96] bg-[#f6fdd7] px-4 py-3 text-sm text-[#526600]">
                {resetSuccess}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSavingPassword}
              className="w-full rounded-lg bg-[linear-gradient(135deg,#CCF143_0%,#D9FF50_100%)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#171e00] transition hover:brightness-[0.98] disabled:opacity-70"
            >
              {isSavingPassword ? "Guardando..." : "Actualizar Contrasena"}
            </button>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={handleRecoveryRequest}>
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                required
              />
            </div>

            {requestError ? (
              <p className="rounded-lg border border-[#ffdad6] bg-[#fff5f4] px-4 py-3 text-sm text-[#ba1a1a]">
                {requestError}
              </p>
            ) : null}

            {requestSuccess ? (
              <p className="rounded-lg border border-[#d8eb96] bg-[#f6fdd7] px-4 py-3 text-sm text-[#526600]">
                {requestSuccess}
              </p>
            ) : null}

            {resetError ? (
              <p className="rounded-lg border border-[#ffdad6] bg-[#fff5f4] px-4 py-3 text-sm text-[#ba1a1a]">
                {resetError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSendingRecovery}
              className="w-full rounded-lg bg-[linear-gradient(135deg,#CCF143_0%,#D9FF50_100%)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#171e00] transition hover:brightness-[0.98] disabled:opacity-70"
            >
              {isSendingRecovery ? "Enviando..." : "Enviar Recuperacion"}
            </button>
          </form>
        )}

        <Link className="mt-6 inline-flex text-sm font-semibold text-[#526600] hover:underline" href="/login">
          Volver al inicio de sesion
        </Link>
      </section>
    </main>
  );
}
