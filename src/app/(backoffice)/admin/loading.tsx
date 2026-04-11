export default function AdminLoading() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-6 w-full animate-pulse">
      <div className="mb-2">
        <div className="h-10 bg-[var(--surface)] w-64 rounded-lg mb-2"></div>
        <div className="h-4 bg-[var(--surface)] w-96 rounded"></div>
      </div>
      
      {/* Stats Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card p-6 border border-[var(--border)] h-32 rounded-[var(--radius-lg)]"></div>
        ))}
      </div>

      {/* Grid Inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 border border-[var(--border)] h-64 rounded-[var(--radius-lg)]"></div>
        <div className="card p-6 border border-[var(--border)] h-64 rounded-[var(--radius-lg)]"></div>
      </div>
    </div>
  );
}
