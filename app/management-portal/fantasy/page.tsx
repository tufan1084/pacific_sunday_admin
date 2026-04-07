"use client";

import { useState } from "react";
import StatsCard from "@/app/components/StatsCard";
import DataTable from "@/app/components/DataTable";
import Modal from "@/app/components/ui/Modal";
import StatusBadge from "@/app/components/StatusBadge";
import FormField, { Input, Select } from "@/app/components/ui/FormField";
import Button from "@/app/components/ui/Button";
import { GOLFERS, FANTASY_ROUNDS } from "@/app/lib/mock-data";
import type { AdminGolfer, FantasyRound } from "@/app/lib/types";

const TIER_COLORS: Record<string, { bg: string; text: string }> = {
  T1: { bg: "rgba(230, 195, 106, 0.15)", text: "#E6C36A" },
  T2: { bg: "rgba(59, 130, 246, 0.12)", text: "#60A5FA" },
  T3: { bg: "rgba(74, 222, 128, 0.12)", text: "#4ADE80" },
  T4: { bg: "rgba(168, 85, 247, 0.12)", text: "#A855F7" },
  T5: { bg: "rgba(100, 116, 139, 0.12)", text: "#94A3B8" },
};

export default function FantasyPage() {
  const [activeTab, setActiveTab] = useState<"golfers" | "rounds">("golfers");
  const [editGolferOpen, setEditGolferOpen] = useState(false);
  const [editRoundOpen, setEditRoundOpen] = useState(false);
  const [selectedGolfer, setSelectedGolfer] = useState<AdminGolfer | null>(null);
  const [selectedRound, setSelectedRound] = useState<FantasyRound | null>(null);

  const totalPicks = FANTASY_ROUNDS.reduce((sum, r) => sum + r.totalPicks, 0);
  const activeRounds = FANTASY_ROUNDS.filter((r) => r.status === "Live" || r.status === "Upcoming").length;
  const avgPicks = FANTASY_ROUNDS.length > 0 ? Math.round(totalPicks / FANTASY_ROUNDS.length) : 0;

  const handleEditGolfer = (golfer: AdminGolfer) => {
    setSelectedGolfer({ ...golfer });
    setEditGolferOpen(true);
  };

  const handleEditRound = (round: FantasyRound) => {
    setSelectedRound({ ...round });
    setEditRoundOpen(true);
  };

  const golferColumns = [
    {
      key: "name",
      label: "Name",
      render: (row: AdminGolfer) => (
        <span className="text-white">{row.name}</span>
      ),
    },
    { key: "country", label: "Country" },
    {
      key: "tier",
      label: "Tier",
      render: (row: AdminGolfer) => {
        const color = TIER_COLORS[row.tier] || TIER_COLORS.T5;
        return (
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold"
            style={{ backgroundColor: color.bg, color: color.text }}
          >
            {row.tier}
          </span>
        );
      },
    },
    {
      key: "ranking",
      label: "Ranking",
      render: (row: AdminGolfer) => (
        <span className="text-white">#{row.ranking}</span>
      ),
    },
    {
      key: "avgScore",
      label: "Avg Score",
      render: (row: AdminGolfer) => (
        <span className={row.avgScore < 0 ? "text-[#4ADE80]" : "text-[#EF4444]"}>
          {row.avgScore > 0 ? "+" : ""}{row.avgScore}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: AdminGolfer) => <StatusBadge status={row.status} />,
    },
  ];

  const roundColumns = [
    {
      key: "week",
      label: "Week",
      render: (row: FantasyRound) => (
        <span className="text-white">Week {row.week}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row: FantasyRound) => (
        <span className="text-white">{row.name}</span>
      ),
    },
    {
      key: "lockDeadline",
      label: "Lock Deadline",
      render: (row: FantasyRound) => (
        <span className="text-[#94A3B8]">{row.lockDeadline}</span>
      ),
    },
    {
      key: "totalPicks",
      label: "Total Picks",
      render: (row: FantasyRound) => (
        <span className="text-[#E6C36A]">{row.totalPicks}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: FantasyRound) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        <StatsCard
          title="Total Golfers"
          value={GOLFERS.length}
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <StatsCard
          title="Active Rounds"
          value={activeRounds}
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
        <StatsCard
          title="Total Picks"
          value={totalPicks}
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
        <StatsCard
          title="Avg Picks / Round"
          value={avgPicks}
          icon="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </div>

      {/* Tab Toggle and Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 rounded-lg bg-[#0b1326] border border-white/[0.08]" style={{ padding: "6px" }}>
          <button
            onClick={() => setActiveTab("golfers")}
            className={`rounded-md text-sm font-semibold transition-all ${
              activeTab === "golfers"
                ? "bg-gradient-to-r from-[#E6C36A] to-[#c9a84e] text-[#020617] shadow-lg shadow-[#E6C36A]/20"
                : "text-[#94A3B8] hover:text-white hover:bg-white/5"
            }`}
            style={{ padding: "10px 24px" }}
          >
            Golfers
          </button>
          <button
            onClick={() => setActiveTab("rounds")}
            className={`rounded-md text-sm font-semibold transition-all ${
              activeTab === "rounds"
                ? "bg-gradient-to-r from-[#E6C36A] to-[#c9a84e] text-[#020617] shadow-lg shadow-[#E6C36A]/20"
                : "text-[#94A3B8] hover:text-white hover:bg-white/5"
            }`}
            style={{ padding: "10px 24px" }}
          >
            Rounds
          </button>
        </div>
        {activeTab === "golfers" && (
          <Button
            onClick={() => {
              setSelectedGolfer({ id: 0, name: "", country: "", tier: "T3", ranking: 0, avgScore: 0, status: "Active" });
              setEditGolferOpen(true);
            }}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            }
          >
            Add Golfer
          </Button>
        )}
      </div>

      {/* Data Tables */}
      {activeTab === "golfers" ? (
        <DataTable<AdminGolfer & Record<string, unknown>>
          columns={golferColumns as { key: string; label: string; render?: (row: AdminGolfer & Record<string, unknown>) => React.ReactNode }[]}
          data={GOLFERS as (AdminGolfer & Record<string, unknown>)[]}
          searchKey="name"
          searchPlaceholder="Search golfers..."
          actions={(row) => (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleEditGolfer(row as unknown as AdminGolfer)}
                className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-white"
                title="Edit"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                className="rounded-lg p-1.5 text-[#EF4444]/70 transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
                title="Remove"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                </svg>
              </button>
            </div>
          )}
        />
      ) : (
        <DataTable<FantasyRound & Record<string, unknown>>
          columns={roundColumns as { key: string; label: string; render?: (row: FantasyRound & Record<string, unknown>) => React.ReactNode }[]}
          data={FANTASY_ROUNDS as (FantasyRound & Record<string, unknown>)[]}
          actions={(row) => (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleEditRound(row as unknown as FantasyRound)}
                className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-white"
                title="Edit"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                className="rounded-lg p-1.5 text-[#E6C36A]/70 transition-colors hover:bg-[#E6C36A]/10 hover:text-[#E6C36A]"
                title="Lock"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </button>
            </div>
          )}
        />
      )}

      {/* Edit Golfer Modal */}
      <Modal open={editGolferOpen} onClose={() => setEditGolferOpen(false)} title={selectedGolfer?.id ? "Edit Golfer" : "Add Golfer"} width="650px">
        {selectedGolfer && (
          <div>
            <div className="grid grid-cols-2 gap-x-4">
              <FormField label="Name">
                <Input
                  value={selectedGolfer.name}
                  onChange={(e) => setSelectedGolfer({ ...selectedGolfer, name: e.target.value })}
                  placeholder="Golfer name"
                />
              </FormField>
              <FormField label="Country">
                <Input
                  value={selectedGolfer.country}
                  onChange={(e) => setSelectedGolfer({ ...selectedGolfer, country: e.target.value })}
                  placeholder="Country code (e.g. US, CAN)"
                />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <FormField label="Tier">
                <Select
                  value={selectedGolfer.tier}
                  onChange={(e) => setSelectedGolfer({ ...selectedGolfer, tier: e.target.value as AdminGolfer["tier"] })}
                >
                  <option value="T1">T1 - Elite</option>
                  <option value="T2">T2 - Top Contender</option>
                  <option value="T3">T3 - Mid Tier</option>
                  <option value="T4">T4 - Value Pick</option>
                  <option value="T5">T5 - Sleeper</option>
                </Select>
              </FormField>
              <FormField label="Ranking">
                <Input
                  type="number"
                  value={selectedGolfer.ranking}
                  onChange={(e) => setSelectedGolfer({ ...selectedGolfer, ranking: Number(e.target.value) })}
                  placeholder="World ranking"
                />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <FormField label="Avg score">
                <Input
                  type="number"
                  step="0.1"
                  value={selectedGolfer.avgScore}
                  onChange={(e) => setSelectedGolfer({ ...selectedGolfer, avgScore: Number(e.target.value) })}
                  placeholder="Average score (e.g. -5.2)"
                />
              </FormField>
              <FormField label="Status">
                <Select
                  value={selectedGolfer.status}
                  onChange={(e) => setSelectedGolfer({ ...selectedGolfer, status: e.target.value as AdminGolfer["status"] })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </FormField>
            </div>
            <div className="flex justify-end gap-3 border-t border-white/[0.08]" style={{ marginTop: "40px", paddingTop: "20px", marginBottom: "20px" }}>
              <Button
                variant="ghost"
                onClick={() => setEditGolferOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setEditGolferOpen(false)}
              >
                {selectedGolfer.id ? "Save Changes" : "Add Golfer"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Round Modal */}
      <Modal open={editRoundOpen} onClose={() => setEditRoundOpen(false)} title="Edit Round" width="650px">
        {selectedRound && (
          <div>
            <FormField label="Round name">
              <Input
                value={selectedRound.name}
                onChange={(e) => setSelectedRound({ ...selectedRound, name: e.target.value })}
                placeholder="Round name"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-x-4">
              <FormField label="Lock deadline">
                <Input
                  type="datetime-local"
                  value={selectedRound.lockDeadline.replace(" ", "T")}
                  onChange={(e) => setSelectedRound({ ...selectedRound, lockDeadline: e.target.value.replace("T", " ") })}
                />
              </FormField>
              <FormField label="Status">
                <Select
                  value={selectedRound.status}
                  onChange={(e) => setSelectedRound({ ...selectedRound, status: e.target.value as FantasyRound["status"] })}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Live">Live</option>
                  <option value="Locked">Locked</option>
                  <option value="Completed">Completed</option>
                </Select>
              </FormField>
            </div>
            <div className="flex justify-end gap-3 border-t border-white/[0.08]" style={{ marginTop: "40px", paddingTop: "20px", marginBottom: "20px" }}>
              <Button
                variant="ghost"
                onClick={() => setEditRoundOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setEditRoundOpen(false)}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
