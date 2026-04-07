"use client";

import { useState } from "react";
import StatsCard from "@/app/components/StatsCard";
import DataTable from "@/app/components/DataTable";
import Modal from "@/app/components/ui/Modal";
import StatusBadge from "@/app/components/StatusBadge";
import FormField, { Input } from "@/app/components/ui/FormField";
import Button from "@/app/components/ui/Button";
import { H2H_MATCHES } from "@/app/lib/mock-data";
import type { H2HMatch } from "@/app/lib/types";

export default function H2HPage() {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<H2HMatch | null>(null);

  const totalMatches = H2H_MATCHES.length;
  const activeMatches = H2H_MATCHES.filter((m) => m.status === "Active").length;
  const completedMatches = H2H_MATCHES.filter(
    (m) => m.status === "Completed"
  ).length;
  const totalWagers = H2H_MATCHES.reduce((sum, m) => sum + m.wager, 0);

  const handleView = (match: H2HMatch) => {
    setSelectedMatch(match);
    setViewModalOpen(true);
  };

  const handleCancel = (match: H2HMatch) => {
    // In a real app, this would call an API to cancel the match
    console.log("Cancel match", match.id);
  };

  const columns = [
    {
      key: "player1",
      label: "Player 1",
      render: (row: H2HMatch) => (
        <span className="text-white">{row.player1}</span>
      ),
    },
    {
      key: "player2",
      label: "Player 2",
      render: (row: H2HMatch) => (
        <span className="text-white">{row.player2}</span>
      ),
    },
    {
      key: "p1Score",
      label: "P1 Score",
      render: (row: H2HMatch) => (
        <span className="text-white">{row.p1Score}</span>
      ),
    },
    {
      key: "p2Score",
      label: "P2 Score",
      render: (row: H2HMatch) => (
        <span className="text-white">{row.p2Score}</span>
      ),
    },
    {
      key: "wager",
      label: "Wager",
      render: (row: H2HMatch) => (
        <span className="text-[#E6C36A]">{row.wager} pts</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: H2HMatch) => <StatusBadge status={row.status} />,
    },
    {
      key: "result",
      label: "Result",
      render: (row: H2HMatch) => <StatusBadge status={row.result} />,
    },
    {
      key: "createdAt",
      label: "Created",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatsCard
          title="Total Matches"
          value={totalMatches}
          icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"
        />
        <StatsCard
          title="Active"
          value={activeMatches}
          icon="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
          change={`${Math.round((activeMatches / totalMatches) * 100)}% of total`}
          positive
        />
        <StatsCard
          title="Completed"
          value={completedMatches}
          icon="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3"
          change={`${Math.round((completedMatches / totalMatches) * 100)}% completion`}
          positive
        />
        <StatsCard
          title="Total Wagers"
          value={`${totalWagers.toLocaleString()} pts`}
          icon="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </div>

      {/* H2H Table */}
      <DataTable<H2HMatch & Record<string, unknown>>
        columns={columns as Array<{ key: string; label: string; render?: (row: H2HMatch & Record<string, unknown>) => React.ReactNode }>}
        data={H2H_MATCHES as Array<H2HMatch & Record<string, unknown>>}
        searchKey="player1"
        searchPlaceholder="Search by Player 1..."
        gridColumns="1.5fr 1.5fr 0.9fr 0.9fr 1fr 1fr 1fr 1.2fr 90px"
        actions={(row) => {
          const match = row as unknown as H2HMatch;
          return (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(match);
                }}
                className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-white"
                title="View"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              {match.status === "Active" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancel(match);
                  }}
                  className="rounded-lg p-1.5 text-[#EF4444]/70 transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
                  title="Cancel"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          );
        }}
      />

      {/* View Match Modal */}
      <Modal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Match Details"
        width="650px"
      >
        {selectedMatch && (
          <div>
            {/* Players Card */}
            <div className="mb-6 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="text-sm font-semibold text-white">
                    {selectedMatch.player1}
                  </div>
                  <div className="mt-1 text-2xl font-bold text-white">
                    {selectedMatch.p1Score}
                  </div>
                  <div className="mt-0.5 text-xs text-[#64748B]">
                    Player 1
                  </div>
                </div>
                <div className="mx-4 flex flex-col items-center">
                  <div className="text-sm font-semibold text-[#64748B]">VS</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-sm font-semibold text-white">
                    {selectedMatch.player2}
                  </div>
                  <div className="mt-1 text-2xl font-bold text-white">
                    {selectedMatch.p2Score}
                  </div>
                  <div className="mt-0.5 text-xs text-[#64748B]">
                    Player 2
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-x-4">
              <FormField label="Wager">
                <Input value={`${selectedMatch.wager} pts`} readOnly />
              </FormField>
              <FormField label="Created">
                <Input value={selectedMatch.createdAt} readOnly />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-x-4">
              <FormField label="Status">
                <div style={{ marginTop: "5px", marginBottom: "10px" }}>
                  <StatusBadge status={selectedMatch.status} />
                </div>
              </FormField>
              <FormField label="Result">
                <div style={{ marginTop: "5px", marginBottom: "10px" }}>
                  <StatusBadge status={selectedMatch.result} />
                </div>
              </FormField>
            </div>

            <FormField label="Match ID">
              <Input value={`H2H-${String(selectedMatch.id).padStart(4, "0")}`} readOnly className="font-mono" />
            </FormField>

            <div className="flex justify-end border-t border-white/[0.08]" style={{ marginTop: "40px", paddingTop: "20px", marginBottom: "20px" }}>
              <Button
                variant="ghost"
                onClick={() => setViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
