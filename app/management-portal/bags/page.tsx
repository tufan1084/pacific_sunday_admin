"use client";

import { useState, useEffect } from "react";
import StatsCard from "@/app/components/StatsCard";
import DataTable from "@/app/components/DataTable";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/Loader";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// SVG path constants
const ICON_BAG = "M20 7h-4l-2-3H10L8 7H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z";
const ICON_CHIP = "M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z";
const ICON_SYNC = "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15";

interface BagType {
  id: number;
  iykItemId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  collection: string | null;
  contractAddress: string | null;
  chainId: number | null;
  totalChips: number;
  createdAt: string;
  syncedAt: string;
  _count: { bags: number };
}

interface BagItem {
  id: number;
  uid: string;
  bagTypeId: number;
  tokenId: string | null;
  registered: boolean;
  userId: number | null;
  status: string;
  registeredAt: string | null;
  lastTappedAt: string | null;
  tapCount: number;
  createdAt: string;
  user: { id: number; email: string } | null;
}

// Flattened rows for DataTable
interface BagTypeRow extends Record<string, unknown> {
  id: number;
  name: string;
  collection: string;
  description: string;
  imageUrl: string;
  totalChips: number;
  createdAt: string;
  _raw: BagType;
}

interface BagRow extends Record<string, unknown> {
  uid: string;
  status: string;
  registered: string;
  user: string;
  tapCount: number;
}

export default function BagsPage() {
  const [bagTypes, setBagTypes] = useState<BagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // View mode: "types" or "bags"
  const [view, setView] = useState<"types" | "bags">("types");
  const [viewBagType, setViewBagType] = useState<BagType | null>(null);
  const [viewBags, setViewBags] = useState<BagItem[]>([]);
  const [viewBagsLoading, setViewBagsLoading] = useState(false);

  const fetchBagTypes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/bag-types`);
      const json = await res.json();
      if (json.success) setBagTypes(json.data);
      else setError(json.message || "Failed to load bag types");
    } catch (err: any) {
      setError(err.message || "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBagTypes();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch(`${API_BASE}/admin/sync-bags`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        const d = json.data;
        setSyncResult(`Synced! ${d.newBagTypes} new types, ${d.newBags} new bags. (${d.skippedBagTypes} types, ${d.skippedBags} bags already existed)`);
        await fetchBagTypes();
      } else {
        setSyncResult(`Sync failed: ${json.message}`);
      }
    } catch (err: any) {
      setSyncResult(`Sync error: ${err.message}`);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncResult(null), 6000);
    }
  };

  const handleViewBags = async (bagType: BagType) => {
    setViewBagType(bagType);
    setView("bags");
    setViewBagsLoading(true);
    setViewBags([]);
    try {
      const res = await fetch(`${API_BASE}/admin/bag-types/${bagType.id}/bags`);
      const json = await res.json();
      if (json.success) setViewBags(json.data);
    } catch {
      // silent
    } finally {
      setViewBagsLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return <Loader text="Loading bag inventory..." fullPage />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ height: "calc(100vh - 120px)" }}>
        <div className="text-center">
          <p className="text-sm text-[#EF4444]">{error}</p>
          <Button
            onClick={handleSync}
            disabled={syncing}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={syncing ? "animate-spin" : ""}>
                <path d={ICON_SYNC} />
              </svg>
            }
          >
            {syncing ? "Syncing..." : "Sync from IYK"}
          </Button>
        </div>
      </div>
    );
  }

  // Flatten bag types for DataTable
  const bagTypeRows: BagTypeRow[] = bagTypes.map((bt) => ({
    id: bt.id,
    name: bt.name,
    collection: bt.collection || "—",
    description: bt.description || "—",
    imageUrl: bt.imageUrl || "",
    totalChips: bt._count?.bags || bt.totalChips,
    createdAt: new Date(bt.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    _raw: bt,
  }));

  // Flatten bags for DataTable
  const bagRows: BagRow[] = viewBags.map((bag) => ({
    uid: bag.uid,
    status: bag.status,
    registered: bag.registered ? "Yes" : "No",
    user: bag.user?.email || "—",
    tapCount: bag.tapCount,
  }));

  const totalBags = bagTypes.reduce((sum, bt) => sum + (bt._count?.bags || bt.totalChips), 0);

  /* ── Bag Types Table Columns ── */
  const bagTypeColumns = [
    {
      key: "imageUrl",
      label: "Image",
      render: (row: BagTypeRow) => (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-[#060D1F]">
          {row.imageUrl ? (
            <img src={row.imageUrl as string} alt={row.name as string} className="h-full w-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
          ) : (
            <div className="text-[10px] text-white/60">No img</div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Bag Name",
      render: (row: BagTypeRow) => (
        <div className="min-w-0">
          <div className="truncate text-xs font-semibold text-white">{row.name}</div>
          <div className="truncate text-[10px] text-white/60">{(row.description as string).slice(0, 50)}{(row.description as string).length > 50 ? "..." : ""}</div>
        </div>
      ),
    },
    {
      key: "collection",
      label: "Collection",
      render: (row: BagTypeRow) => (
        <span className="text-xs text-white">
          {row.collection}
        </span>
      ),
    },
    {
      key: "totalChips",
      label: "Bags",
      render: (row: BagTypeRow) => (
        <span className="text-xs font-semibold text-white">{row.totalChips}</span>
      ),
    },
    { key: "createdAt", label: "Created" },
  ];

  const bagTypeActions = (row: BagTypeRow) => (
    <div className="flex items-center justify-end">
      <button
        onClick={(e) => { e.stopPropagation(); handleViewBags(row._raw as BagType); }}
        className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        title="View Details"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>
  );

  /* ── Bags Table Columns ── */
  const bagColumns = [
    {
      key: "uid",
      label: "Chip UID",
      render: (row: BagRow) => <span className="font-mono text-xs text-white">{row.uid}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (row: BagRow) => {
        const colors: Record<string, string> = {
          ACTIVE: "text-emerald-400",
          BANNED: "text-red-400",
          LOST: "text-orange-400",
          DEACTIVATED: "text-gray-400",
        };
        return (
          <span className={`text-[10px] font-bold uppercase ${colors[row.status as string] || "text-white"}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      key: "registered",
      label: "Registered",
      render: (row: BagRow) => (
        <span className={`text-xs font-semibold ${row.registered === "Yes" ? "text-emerald-400" : "text-white"}`}>
          {row.registered}
        </span>
      ),
    },
    {
      key: "user",
      label: "Owner",
      render: (row: BagRow) => <span className="text-xs text-white">{row.user}</span>,
    },
    {
      key: "tapCount",
      label: "Taps",
      render: (row: BagRow) => <span className="text-xs text-white">{row.tapCount}</span>,
    },
  ];

  return (
    <div className="space-y-3">
      {/* ── Bag Types List View ── */}
      {view === "types" && (
        <>
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 xl:grid-cols-2">
            <StatsCard title="Bag Types" value={bagTypes.length} icon={ICON_BAG} />
            <StatsCard title="Total Bags" value={totalBags} icon={ICON_CHIP} />
          </div>

          <div className="flex items-center justify-end gap-3">
            {syncResult && (
              <span className={`text-[11px] ${syncResult.startsWith("Synced") ? "text-emerald-400" : "text-[#EF4444]"}`}>
                {syncResult}
              </span>
            )}
            <Button
              onClick={handleSync}
              disabled={syncing}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={syncing ? "animate-spin" : ""}>
                  <path d={ICON_SYNC} />
                </svg>
              }
            >
              {syncing ? "Syncing..." : "Sync from IYK"}
            </Button>
          </div>

          <DataTable<BagTypeRow>
            columns={bagTypeColumns as { key: string; label: string; render?: (row: BagTypeRow) => React.ReactNode }[]}
            data={bagTypeRows}
            searchKey="name"
            searchPlaceholder="Search bags by name..."
            actions={bagTypeActions}
            gridColumns="60px 2fr 1fr 0.5fr 1fr 60px"
          />
        </>
      )}

      {/* ── Bag Type Detail View ── */}
      {view === "bags" && viewBagType && (
        <>
          {/* Back button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => { setView("types"); setViewBagType(null); setViewBags([]); }}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              }
            >
              Back to All Bag Types
            </Button>
          </div>

          {/* Bag Type Info Card */}
          <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-[#0b1326] to-[#0a1020]" style={{ padding: "20px 24px" }}>
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/[0.08] bg-[#060D1F]">
                {viewBagType.imageUrl ? (
                  <img src={viewBagType.imageUrl} alt={viewBagType.name} className="h-full w-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-white/60">No image</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-[#E6C36A]">{viewBagType.name}</h3>
                <p className="mt-1 text-xs text-white/60 leading-relaxed">{viewBagType.description || "No description"}</p>

                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#E6C36A]">Collection </span>
                    <span className="text-xs text-white">{viewBagType.collection || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#E6C36A]">Total Bags </span>
                    <span className="text-xs text-white">{viewBagType._count?.bags || viewBagType.totalChips}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#E6C36A]">Created </span>
                    <span className="text-xs text-white">
                      {new Date(viewBagType.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#E6C36A]">Last Synced </span>
                    <span className="text-xs text-white">
                      {new Date(viewBagType.syncedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 xl:grid-cols-2">
            <StatsCard title="Total Bags" value={viewBagsLoading ? "..." : viewBags.length} icon={ICON_CHIP} />
            <StatsCard title="Registered" value={viewBagsLoading ? "..." : viewBags.filter(b => b.registered).length} icon={ICON_BAG} />
          </div>

          {/* Bags Table */}
          {viewBagsLoading ? (
            <Loader text="Loading bags..." />
          ) : (
            <DataTable<BagRow>
              columns={bagColumns as { key: string; label: string; render?: (row: BagRow) => React.ReactNode }[]}
              data={bagRows}
              searchKey="uid"
              searchPlaceholder="Search bags by UID..."
              gridColumns="2fr 1fr 0.8fr 1.5fr 0.5fr"
            />
          )}
        </>
      )}
    </div>
  );
}
