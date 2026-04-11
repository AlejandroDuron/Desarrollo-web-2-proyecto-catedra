/**
 * Elegant placeholder cover for entities without an image.
 * Uses initials + branded gradient.
 */
export default function PlaceholderCover({ title, subtitle }: { title: string; subtitle?: string }) {
  const initials = title
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="aspect-video bg-gradient-to-br from-[#191C1D] via-[#3f4749] to-[var(--green)] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAyMGgyME0yMCAwdjIwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')]"></div>
      <span className="text-white/90 text-4xl font-black tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
        {initials}
      </span>
      {subtitle && (
        <span className="text-white/50 text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">{subtitle}</span>
      )}
    </div>
  );
}
