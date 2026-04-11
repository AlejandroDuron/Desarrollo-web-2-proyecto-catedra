"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalCount: number;
  perPage?: number;
}

export default function GlobalPagination({ totalCount, perPage = 10 }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalCount / perPage);

  if (totalPages <= 1) return null;

  const navigate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  // Build page numbers array with ellipsis
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 pt-6">
      <button
        onClick={() => navigate(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 text-xs font-bold rounded-[var(--radius-sm)] border border-[var(--border)] disabled:opacity-30 hover:bg-[var(--surface)] transition-colors"
      >
        &larr; Anterior
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e-${i}`} className="px-2 text-[var(--muted)] text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => navigate(p)}
            className={`w-9 h-9 text-xs font-bold rounded-[var(--radius-sm)] border transition-colors ${
              currentPage === p
                ? "bg-[var(--green)] text-white border-[var(--green)] shadow-sm"
                : "border-[var(--border)] hover:bg-[var(--surface)]"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => navigate(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 text-xs font-bold rounded-[var(--radius-sm)] border border-[var(--border)] disabled:opacity-30 hover:bg-[var(--surface)] transition-colors"
      >
        Siguiente &rarr;
      </button>
    </div>
  );
}
