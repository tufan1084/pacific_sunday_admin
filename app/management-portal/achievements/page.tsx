"use client";

import { useState } from "react";
import StatsCard from "@/app/components/StatsCard";
import DataTable from "@/app/components/DataTable";
import Modal from "@/app/components/Modal";
import StatusBadge from "@/app/components/StatusBadge";
import FormField, { Input, Select, Textarea } from "@/app/components/FormField";
import { ACHIEVEMENTS, CHALLENGES } from "@/app/lib/mock-data";
import type { Achievement, Challenge } from "@/app/lib/types";

// SVG path constants
const ICON_TROPHY = "M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22M18 2H6v7a6 6 0 0 0 12 0V2z";
const ICON_TARGET = "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z";
const ICON_PERCENT = "M19 5L5 19M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM17.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z";
const ICON_STAR = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

type ActiveTab = "achievements" | "challenges";

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("achievements");

  // Achievement modals
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [addAchievementOpen, setAddAchievementOpen] = useState(false);

  // Challenge modals
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [addChallengeOpen, setAddChallengeOpen] = useState(false);

  // Stats
  const totalAchievements = ACHIEVEMENTS.length;
  const activeChallenges = CHALLENGES.filter((c) => c.status === "Active").length;
  const avgUnlockRate =
    ACHIEVEMENTS.length > 0
      ? (
          ACHIEVEMENTS.reduce((sum, a) => sum + (a.unlockedBy / a.totalUsers) * 100, 0) /
          ACHIEVEMENTS.length
        ).toFixed(1) + "%"
      : "0%";
  const totalBonusPoints =
    ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0) +
    CHALLENGES.reduce((sum, c) => sum + c.points, 0);

  // Achievement columns
  const achievementColumns = [
    {
      key: "name",
      label: "Name",
      render: (row: Achievement) => (
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E6C36A]/15 text-xs font-bold text-[#E6C36A]">
            {row.name.charAt(0)}
          </div>
          <span className="font-medium text-white">{row.name}</span>
        </div>
      ),
    },
    { key: "description", label: "Description" },
    {
      key: "points",
      label: "Points",
      render: (row: Achievement) => (
        <span className="font-semibold text-[#E6C36A]">{row.points}</span>
      ),
    },
    {
      key: "unlockedBy",
      label: "Unlocked By",
      render: (row: Achievement) => (
        <span className="text-[#94A3B8]">
          {row.unlockedBy}/{row.totalUsers} users
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: Achievement) => <StatusBadge status={row.status} />,
    },
  ];

  const achievementActions = (row: Achievement) => (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedAchievement(row);
          setAchievementModalOpen(true);
        }}
        className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-white"
        title="Edit"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      <button
        onClick={(e) => e.stopPropagation()}
        className={`rounded-lg p-1.5 transition-colors ${
          row.status === "Locked"
            ? "text-[#4ADE80]/70 hover:bg-[#4ADE80]/10 hover:text-[#4ADE80]"
            : "text-[#94A3B8] hover:bg-white/5 hover:text-white"
        }`}
        title={row.status === "Locked" ? "Unlock" : "Lock"}
      >
        {row.status === "Locked" ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        )}
      </button>
    </div>
  );

  // Challenge columns
  const challengeColumns = [
    {
      key: "title",
      label: "Title",
      render: (row: Challenge) => <span className="font-medium text-white">{row.title}</span>,
    },
    { key: "description", label: "Description" },
    {
      key: "points",
      label: "Points",
      render: (row: Challenge) => (
        <span className="font-semibold text-[#E6C36A]">{row.points}</span>
      ),
    },
    {
      key: "week",
      label: "Week",
      render: (row: Challenge) => <span className="text-white">Week {row.week}</span>,
    },
    {
      key: "participants",
      label: "Participants",
      render: (row: Challenge) => (
        <span className="text-[#94A3B8]">{row.participants}</span>
      ),
    },
    {
      key: "completions",
      label: "Completions",
      render: (row: Challenge) => (
        <span className="text-[#94A3B8]">{row.completions}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: Challenge) => <StatusBadge status={row.status} />,
    },
  ];

  const challengeActions = (row: Challenge) => (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedChallenge(row);
          setChallengeModalOpen(true);
        }}
        className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-white"
        title="Edit"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex justify-end">
        <button
          onClick={() =>
            activeTab === "achievements" ? setAddAchievementOpen(true) : setAddChallengeOpen(true)
          }
          className="rounded-lg bg-[#E6C36A] px-3 py-2 text-sm font-semibold text-[#020617] transition-colors hover:bg-[#E6C36A]/90"
        >
          + Add {activeTab === "achievements" ? "Achievement" : "Challenge"}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatsCard title="Total Achievements" value={totalAchievements} icon={ICON_TROPHY} />
        <StatsCard title="Active Challenges" value={activeChallenges} change="2 this week" positive icon={ICON_TARGET} />
        <StatsCard title="Avg Unlock Rate" value={avgUnlockRate} icon={ICON_PERCENT} />
        <StatsCard title="Total Bonus Points" value={totalBonusPoints.toLocaleString()} icon={ICON_STAR} />
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-1 rounded-lg border border-white/[0.04] bg-[#0b1326] p-1">
        <button
          onClick={() => setActiveTab("achievements")}
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            activeTab === "achievements"
              ? "bg-[#E6C36A]/10 text-[#E6C36A]"
              : "text-[#64748B] hover:text-[#94A3B8]"
          }`}
        >
          Achievements
        </button>
        <button
          onClick={() => setActiveTab("challenges")}
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            activeTab === "challenges"
              ? "bg-[#E6C36A]/10 text-[#E6C36A]"
              : "text-[#64748B] hover:text-[#94A3B8]"
          }`}
        >
          Challenges
        </button>
      </div>

      {/* Data Tables */}
      {activeTab === "achievements" ? (
        <DataTable<Achievement & Record<string, unknown>>
          columns={achievementColumns as { key: string; label: string; render?: (row: Achievement & Record<string, unknown>) => React.ReactNode }[]}
          data={ACHIEVEMENTS as (Achievement & Record<string, unknown>)[]}
          searchKey="name"
          searchPlaceholder="Search achievements by name..."
          actions={achievementActions as (row: Achievement & Record<string, unknown>) => React.ReactNode}
        />
      ) : (
        <DataTable<Challenge & Record<string, unknown>>
          columns={challengeColumns as { key: string; label: string; render?: (row: Challenge & Record<string, unknown>) => React.ReactNode }[]}
          data={CHALLENGES as (Challenge & Record<string, unknown>)[]}
          searchKey="title"
          searchPlaceholder="Search challenges by title..."
          actions={challengeActions as (row: Challenge & Record<string, unknown>) => React.ReactNode}
        />
      )}

      {/* Edit Achievement Modal */}
      <Modal open={achievementModalOpen} onClose={() => setAchievementModalOpen(false)} title="Edit Achievement" width="520px">
        {selectedAchievement && (
          <div className="space-y-1">
            <FormField label="Name">
              <Input defaultValue={selectedAchievement.name} />
            </FormField>
            <FormField label="Description">
              <Textarea defaultValue={selectedAchievement.description} rows={3} />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Points">
                <Input defaultValue={selectedAchievement.points} type="number" />
              </FormField>
              <FormField label="Status">
                <Select defaultValue={selectedAchievement.status}>
                  <option value="Active">Active</option>
                  <option value="Locked">Locked</option>
                </Select>
              </FormField>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.04]">
              <button
                onClick={() => setAchievementModalOpen(false)}
                className="rounded-lg border border-white/[0.06] px-3 py-2 text-sm text-[#94A3B8] transition-colors hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => setAchievementModalOpen(false)}
                className="rounded-lg bg-[#E6C36A] px-3 py-2 text-sm font-semibold text-[#020617] transition-colors hover:bg-[#E6C36A]/90"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Achievement Modal */}
      <Modal open={addAchievementOpen} onClose={() => setAddAchievementOpen(false)} title="Add New Achievement" width="520px">
        <div className="space-y-1">
          <FormField label="Name">
            <Input placeholder="Enter achievement name" />
          </FormField>
          <FormField label="Description">
            <Textarea placeholder="Describe the achievement criteria..." rows={3} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Points">
              <Input placeholder="0" type="number" defaultValue={0} />
            </FormField>
            <FormField label="Status">
              <Select defaultValue="Active">
                <option value="Active">Active</option>
                <option value="Locked">Locked</option>
              </Select>
            </FormField>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.04]">
            <button
              onClick={() => setAddAchievementOpen(false)}
              className="rounded-lg border border-white/[0.06] px-3 py-2 text-sm text-[#94A3B8] transition-colors hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={() => setAddAchievementOpen(false)}
              className="rounded-lg bg-[#E6C36A] px-3 py-2 text-sm font-semibold text-[#020617] transition-colors hover:bg-[#E6C36A]/90"
            >
              Create Achievement
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Challenge Modal */}
      <Modal open={challengeModalOpen} onClose={() => setChallengeModalOpen(false)} title="Edit Challenge" width="520px">
        {selectedChallenge && (
          <div className="space-y-1">
            <FormField label="Title">
              <Input defaultValue={selectedChallenge.title} />
            </FormField>
            <FormField label="Description">
              <Textarea defaultValue={selectedChallenge.description} rows={3} />
            </FormField>
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Points">
                <Input defaultValue={selectedChallenge.points} type="number" />
              </FormField>
              <FormField label="Week">
                <Input defaultValue={selectedChallenge.week} type="number" />
              </FormField>
              <FormField label="Status">
                <Select defaultValue={selectedChallenge.status}>
                  <option value="Active">Active</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </Select>
              </FormField>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.04]">
              <button
                onClick={() => setChallengeModalOpen(false)}
                className="rounded-lg border border-white/[0.06] px-3 py-2 text-sm text-[#94A3B8] transition-colors hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => setChallengeModalOpen(false)}
                className="rounded-lg bg-[#E6C36A] px-3 py-2 text-sm font-semibold text-[#020617] transition-colors hover:bg-[#E6C36A]/90"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Challenge Modal */}
      <Modal open={addChallengeOpen} onClose={() => setAddChallengeOpen(false)} title="Add New Challenge" width="520px">
        <div className="space-y-1">
          <FormField label="Title">
            <Input placeholder="Enter challenge title" />
          </FormField>
          <FormField label="Description">
            <Textarea placeholder="Describe the challenge..." rows={3} />
          </FormField>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Points">
              <Input placeholder="0" type="number" defaultValue={0} />
            </FormField>
            <FormField label="Week Number">
              <Input placeholder="1" type="number" defaultValue={1} />
            </FormField>
            <FormField label="Status">
              <Select defaultValue="Upcoming">
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </Select>
            </FormField>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.04]">
            <button
              onClick={() => setAddChallengeOpen(false)}
              className="rounded-lg border border-white/[0.06] px-3 py-2 text-sm text-[#94A3B8] transition-colors hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={() => setAddChallengeOpen(false)}
              className="rounded-lg bg-[#E6C36A] px-3 py-2 text-sm font-semibold text-[#020617] transition-colors hover:bg-[#E6C36A]/90"
            >
              Create Challenge
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
