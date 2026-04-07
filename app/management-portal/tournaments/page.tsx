"use client";

import { useState } from "react";
import StatsCard from "@/app/components/StatsCard";
import DataTable from "@/app/components/DataTable";
import Modal from "@/app/components/ui/Modal";
import StatusBadge from "@/app/components/StatusBadge";
import FormField, { Input, Select } from "@/app/components/ui/FormField";
import Button from "@/app/components/ui/Button";
import { TOURNAMENTS } from "@/app/lib/mock-data";
import type { Tournament } from "@/app/lib/types";

const EMPTY_TOURNAMENT: Tournament = {
  id: 0,
  name: "",
  location: "",
  startDate: "",
  endDate: "",
  rounds: 4,
  golfers: 72,
  status: "Upcoming",
  pointsMultiplier: 1,
};

export default function TournamentsPage() {
  const [editOpen, setEditOpen] = useState(false);
  const [scoresOpen, setScoresOpen] = useState(false);
  const [selected, setSelected] = useState<Tournament | null>(null);
  const [scoreRound, setScoreRound] = useState(1);

  const liveCount = TOURNAMENTS.filter((t) => t.status === "Live").length;
  const upcomingCount = TOURNAMENTS.filter((t) => t.status === "Upcoming").length;
  const totalGolfers = TOURNAMENTS.reduce((sum, t) => sum + t.golfers, 0);

  const handleEdit = (tournament: Tournament) => {
    setSelected({ ...tournament });
    setEditOpen(true);
  };

  const handleCreate = () => {
    setSelected({ ...EMPTY_TOURNAMENT });
    setEditOpen(true);
  };

  const handleManageScores = (tournament: Tournament) => {
    setSelected({ ...tournament });
    setScoreRound(1);
    setScoresOpen(true);
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row: Tournament) => (
        <span className="text-white">{row.name}</span>
      ),
    },
    { key: "location", label: "Location" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    {
      key: "rounds",
      label: "Rounds",
      render: (row: Tournament) => (
        <span className="text-white">{row.rounds}</span>
      ),
    },
    {
      key: "golfers",
      label: "Golfers",
      render: (row: Tournament) => (
        <span className="text-white">{row.golfers}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: Tournament) => <StatusBadge status={row.status} />,
    },
    {
      key: "pointsMultiplier",
      label: "Points Multiplier",
      render: (row: Tournament) => (
        <span className="text-white">{row.pointsMultiplier}x</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          className="rounded-lg bg-[#E6C36A] px-3 py-2 text-sm font-semibold text-[#020617] transition-colors hover:bg-[#d4b35e]"
        >
          + Create Tournament
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        <StatsCard
          title="Total Tournaments"
          value={TOURNAMENTS.length}
          icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
        <StatsCard
          title="Live Now"
          value={liveCount}
          icon="M13 10V3L4 14h7v7l9-11h-7z"
        />
        <StatsCard
          title="Upcoming"
          value={upcomingCount}
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
        <StatsCard
          title="Total Golfers"
          value={totalGolfers}
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </div>

      {/* Table */}
      <DataTable<Tournament & Record<string, unknown>>
        columns={columns as { key: string; label: string; render?: (row: Tournament & Record<string, unknown>) => React.ReactNode }[]}
        data={TOURNAMENTS as (Tournament & Record<string, unknown>)[]}
        searchKey="name"
        searchPlaceholder="Search tournaments..."
        gridColumns="2fr 1.5fr 1fr 1fr 0.6fr 0.7fr 1fr 1.2fr 90px"
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleEdit(row as unknown as Tournament)}
              className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-white"
              title="Edit"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              onClick={() => handleManageScores(row as unknown as Tournament)}
              className="rounded-lg p-1.5 text-[#E6C36A]/70 transition-colors hover:bg-[#E6C36A]/10 hover:text-[#E6C36A]"
              title="Manage Scores"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" />
              </svg>
            </button>
          </div>
        )}
      />

      {/* Create / Edit Tournament Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={selected?.id ? "Edit Tournament" : "Create Tournament"} width="650px">
        {selected && (
          <div>
            <FormField label="Tournament name">
              <Input
                value={selected.name}
                onChange={(e) => setSelected({ ...selected, name: e.target.value })}
                placeholder="Tournament name"
              />
            </FormField>
            <FormField label="Location">
              <Input
                value={selected.location}
                onChange={(e) => setSelected({ ...selected, location: e.target.value })}
                placeholder="Venue, City"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-x-4">
              <FormField label="Start date">
                <Input
                  type="date"
                  value={selected.startDate}
                  onChange={(e) => setSelected({ ...selected, startDate: e.target.value })}
                />
              </FormField>
              <FormField label="End date">
                <Input
                  type="date"
                  value={selected.endDate}
                  onChange={(e) => setSelected({ ...selected, endDate: e.target.value })}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-3 gap-x-4">
              <FormField label="Rounds">
                <Input
                  type="number"
                  min={1}
                  value={selected.rounds}
                  onChange={(e) => setSelected({ ...selected, rounds: Number(e.target.value) })}
                />
              </FormField>
              <FormField label="Golfers">
                <Input
                  type="number"
                  min={1}
                  value={selected.golfers}
                  onChange={(e) => setSelected({ ...selected, golfers: Number(e.target.value) })}
                />
              </FormField>
              <FormField label="Points multiplier">
                <Input
                  type="number"
                  min={0.5}
                  step={0.5}
                  value={selected.pointsMultiplier}
                  onChange={(e) => setSelected({ ...selected, pointsMultiplier: Number(e.target.value) })}
                />
              </FormField>
            </div>
            <FormField label="Status">
              <Select
                value={selected.status}
                onChange={(e) => setSelected({ ...selected, status: e.target.value as Tournament["status"] })}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
              </Select>
            </FormField>
            <div className="flex justify-end gap-3 border-t border-white/[0.08]" style={{ marginTop: "40px", paddingTop: "20px", marginBottom: "20px" }}>
              <Button
                variant="ghost"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setEditOpen(false)}
              >
                {selected.id ? "Save Changes" : "Create Tournament"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Manage Scores Modal */}
      <Modal open={scoresOpen} onClose={() => setScoresOpen(false)} title={`Manage Scores — ${selected?.name ?? ""}`} width="650px">
        <div>
          {/* Round Tabs */}
          <div className="mb-6 flex gap-2 rounded-lg bg-[#0b1326] border border-white/[0.08]" style={{ padding: "6px" }}>
            {[1, 2, 3, 4].map((r) => (
              <button
                key={r}
                onClick={() => setScoreRound(r)}
                className={`flex-1 rounded-md text-sm font-semibold transition-all ${
                  scoreRound === r
                    ? "bg-gradient-to-r from-[#E6C36A] to-[#c9a84e] text-[#020617] shadow-lg shadow-[#E6C36A]/20"
                    : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                }`}
                style={{ padding: "10px 16px" }}
              >
                Round {r}
              </button>
            ))}
          </div>

          {/* Placeholder Content */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] py-10">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#E6C36A]/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E6C36A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-white">Score management interface</p>
            <p className="mt-1 text-xs text-[#64748B]">Round {scoreRound} scoring will appear here</p>
          </div>

          <div className="flex justify-end border-t border-white/[0.08]" style={{ marginTop: "40px", paddingTop: "20px", marginBottom: "20px" }}>
            <Button
              variant="ghost"
              onClick={() => setScoresOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
