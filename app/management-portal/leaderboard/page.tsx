"use client";

import { useState } from "react";
import StatsCard from "@/app/components/StatsCard";
import DataTable from "@/app/components/DataTable";
import Modal from "@/app/components/ui/Modal";
import FormField, { Input, Textarea } from "@/app/components/ui/FormField";
import Button from "@/app/components/ui/Button";
import { LEADERBOARD } from "@/app/lib/mock-data";
import type { LeaderboardUser } from "@/app/lib/types";

export default function LeaderboardPage() {
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  const topScore = Math.max(...LEADERBOARD.map((u) => u.points));
  const avgPoints = Math.round(
    LEADERBOARD.reduce((sum, u) => sum + u.points, 0) / LEADERBOARD.length
  );
  const activeStreaks = LEADERBOARD.filter((u) => u.streak > 0).length;

  const handleAdjust = (user: LeaderboardUser) => {
    setSelectedUser(user);
    setAdjustAmount("");
    setAdjustReason("");
    setAdjustModalOpen(true);
  };

  const handleApplyAdjust = () => {
    // In a real app, this would call an API
    setAdjustModalOpen(false);
    setSelectedUser(null);
  };

  const columns = [
    {
      key: "rank",
      label: "Rank",
      render: (row: LeaderboardUser) => (
        <span
          className={`${
            row.rank <= 3 ? "text-[#E6C36A]" : "text-white"
          }`}
        >
          #{row.rank}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row: LeaderboardUser) => (
        <span className="text-white">{row.name}</span>
      ),
    },
    {
      key: "country",
      label: "Country",
    },
    {
      key: "bag",
      label: "Bag Serial",
      render: (row: LeaderboardUser) => (
        <span className="font-mono text-xs text-[#94A3B8]">{row.bag}</span>
      ),
    },
    {
      key: "points",
      label: "Points",
      render: (row: LeaderboardUser) => (
        <span className="text-[#E6C36A]">
          {row.points.toLocaleString()}
        </span>
      ),
    },
    {
      key: "weeksPlayed",
      label: "Weeks Played",
    },
    {
      key: "streak",
      label: "Streak",
      render: (row: LeaderboardUser) => (
        <span className="text-white">
          {row.streak > 0 ? (
            <>
              {row.streak} <span className="ml-0.5">🔥</span>
            </>
          ) : (
            <span className="text-[#64748B]">0</span>
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatsCard
          title="Total Players"
          value={LEADERBOARD.length}
          icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"
        />
        <StatsCard
          title="Top Score"
          value={topScore.toLocaleString()}
          icon="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          change="12.5%"
          positive
        />
        <StatsCard
          title="Average Points"
          value={avgPoints.toLocaleString()}
          icon="M18 20V10 M12 20V4 M6 20v-6"
        />
        <StatsCard
          title="Active Streaks"
          value={activeStreaks}
          icon="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
          change={`${activeStreaks} of ${LEADERBOARD.length}`}
          positive
        />
      </div>

      {/* Leaderboard Table */}
      <DataTable<LeaderboardUser & Record<string, unknown>>
        columns={columns as Array<{ key: string; label: string; render?: (row: LeaderboardUser & Record<string, unknown>) => React.ReactNode }>}
        data={LEADERBOARD as Array<LeaderboardUser & Record<string, unknown>>}
        searchKey="name"
        searchPlaceholder="Search players..."
        gridColumns="0.6fr 2fr 1fr 1.5fr 1fr 1fr 0.8fr 80px"
        actions={(row) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAdjust(row as unknown as LeaderboardUser);
            }}
            className="rounded-lg p-1.5 text-[#E6C36A]/70 transition-colors hover:bg-[#E6C36A]/10 hover:text-[#E6C36A]"
            title="Adjust Points"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
      />

      {/* Adjust Points Modal */}
      <Modal
        open={adjustModalOpen}
        onClose={() => setAdjustModalOpen(false)}
        title="Adjust Points"
        width="650px"
      >
        {selectedUser && (
          <div>
            <div className="mb-6 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-white">{selectedUser.name}</p>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Rank #{selectedUser.rank} · {selectedUser.country}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-[#64748B] mb-1">Current points</p>
                  <p className="text-lg font-semibold text-[#E6C36A]">
                    {selectedUser.points.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <FormField label="Adjustment amount">
              <Input
                type="number"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                placeholder="e.g. +100 or -50"
              />
            </FormField>
            <p className="text-xs text-[#64748B] -mt-2 mb-4">
              Use positive numbers to add, negative to deduct
            </p>

            <FormField label="Reason">
              <Textarea
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="Reason for adjustment..."
                rows={3}
              />
            </FormField>

            {adjustAmount && (
              <div className="rounded-lg border border-white/[0.04] bg-[#020617] p-3 mb-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B]">New Total</span>
                  <span className="font-bold text-white">
                    {(
                      selectedUser.points + Number(adjustAmount)
                    ).toLocaleString()}{" "}
                    pts
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-white/[0.08]" style={{ marginTop: "40px", paddingTop: "20px", marginBottom: "20px" }}>
              <Button
                variant="ghost"
                onClick={() => setAdjustModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyAdjust}
                disabled={!adjustAmount || !adjustReason}
              >
                Apply Adjustment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
