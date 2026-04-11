import { PasswordForm } from "./components/password-form";

export default function SeguridadPage() {
  return (
    <main className="flex-grow pb-20 px-6 max-w-7xl mx-auto w-full pt-12 font-body">
      <h1 className="text-5xl font-black font-headline tracking-tighter uppercase mb-8">Seguridad</h1>
      <PasswordForm />
    </main>
  );
}
