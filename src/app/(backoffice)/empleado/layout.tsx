export default function EmpleadoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-amber-900 px-6 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
          Rol
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Empleado</h2>
      </div>
      {children}
    </section>
  );
}
