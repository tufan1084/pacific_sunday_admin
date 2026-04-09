"use client";

import { useState } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: string;
  searchPlaceholder?: string;
  actions?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
  gridColumns?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  actions,
  onRowClick,
  gridColumns,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const perPage = 25;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setPage(0);
  };

  const filtered = searchKey
    ? data.filter((row) => {
        const searchLower = search.toLowerCase();
        // Search in the primary key
        const primaryMatch = String(row[searchKey] ?? "").toLowerCase().includes(searchLower);
        // Also search in email if it exists
        const emailMatch = row.email ? String(row.email).toLowerCase().includes(searchLower) : false;
        return primaryMatch || emailMatch;
      })
    : data;

  // Sort the filtered data
  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        
        if (sortOrder === "asc") {
          return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
        } else {
          return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
        }
      })
    : filtered;

  const totalPages = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice(page * perPage, (page + 1) * perPage);

  return (
    <div className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-[#0b1326] to-[#0a1020] shadow-lg" style={{ marginTop: "10px", marginBottom: "10px" }}>
      {searchKey && (
        <div className="flex items-center gap-3" style={{ padding: "20px 20px 10px 20px" }}>
          <div className="shrink-0 text-sm font-bold text-[#E6C36A]">Search</div>
          <div className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-[#1A2235]" style={{ height: "48px", paddingLeft: "10px", paddingRight: "16px", maxWidth: "400px", width: "100%" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="flex-1 bg-transparent text-sm text-white placeholder-[#64748B] outline-none"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); setPage(0); }}
                className="shrink-0 text-[#64748B] transition-colors hover:text-white"
                title="Clear search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-0">
        {/* Table Header */}
        <div className="grid gap-4 border-b border-white/[0.08]" style={{ padding: "8px 10px", gridTemplateColumns: gridColumns || (actions ? '2fr 2.5fr 1fr 1fr 1.5fr 1.5fr 100px' : '2fr 2.5fr 1fr 1fr 1.5fr 1.5fr') }}>
          {columns.map((col) => (
            <button
              key={col.key}
              onClick={() => handleSort(col.key)}
              className="flex items-center gap-1.5 text-left text-sm font-bold text-[#E6C36A] transition-colors hover:text-[#c9a84e]"
            >
              {col.label}
              <div className="flex flex-col">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={sortKey === col.key && sortOrder === "asc" ? "#E6C36A" : "#64748B"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginBottom: "-2px" }}
                >
                  <path d="M18 15l-6-6-6 6" />
                </svg>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={sortKey === col.key && sortOrder === "desc" ? "#E6C36A" : "#64748B"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginTop: "-2px" }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </button>
          ))}
          {actions && <div className="text-right text-sm font-bold text-[#E6C36A]">Actions</div>}
        </div>

        {/* Table Rows */}
        {paged.map((row, i) => (
          <div key={i}>
            <div
              onClick={() => onRowClick?.(row)}
              className={`grid gap-4 ${onRowClick ? "cursor-pointer" : ""}`}
              style={{ padding: "10px 10px", gridTemplateColumns: gridColumns || (actions ? '2fr 2.5fr 1fr 1fr 1.5fr 1.5fr 100px' : '2fr 2.5fr 1fr 1fr 1.5fr 1.5fr') }}
            >
              {columns.map((col) => (
                <div key={col.key} className="text-xs text-white">
                  {col.render ? col.render(row) : String(row[col.key] ?? "")}
                </div>
              ))}
              {actions && <div className="text-right">{actions(row)}</div>}
            </div>
            {i !== paged.length - 1 && <div className="border-b border-white/[0.06]"></div>}
          </div>
        ))}

        {paged.length === 0 && (
          <div className="py-8 text-center text-sm text-white/60">
            No results found
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/[0.08]" style={{ padding: "16px 20px" }}>
          <span className="text-xs font-medium text-white/60">
            Showing {page * perPage + 1}–{Math.min((page + 1) * perPage, sorted.length)} of {sorted.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all hover:text-[#E6C36A] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all hover:text-[#E6C36A] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-white"
            >
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
