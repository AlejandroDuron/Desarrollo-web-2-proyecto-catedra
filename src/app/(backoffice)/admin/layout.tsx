export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-slate-900 px-6 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
          Rol
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Administrador</h2>
      </div>
      {children}
    </section>
  );
}
