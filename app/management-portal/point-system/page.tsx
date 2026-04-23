"use client";

import { useState, useEffect } from "react";
import StatsCard from "@/app/components/StatsCard";
import DataTable from "@/app/components/DataTable";
import Button from "@/app/components/ui/Button";
import StatusBadge from "@/app/components/StatusBadge";
import Toast from "@/app/components/ui/Toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface PointsRange {
  id: number;
  name: string;
  minScore: number;
  maxScore: number;
  points: number;
  isActive: boolean;
  sortOrder: number;
}

export default function PointSystemPage() {
  const [ranges, setRanges] = useState<PointsRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRange, setEditingRange] = useState<PointsRange | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    minScore: "",
    maxScore: "",
    points: "",
    sortOrder: "0",
  });

  useEffect(() => {
    loadRanges();
  }, []);

  const loadRanges = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/points/ranges`);
      const data = await res.json();
      if (data.success) {
        setRanges(data.data.ranges || []);
      }
    } catch (error) {
      console.error("Failed to load ranges:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (range?: PointsRange) => {
    if (range) {
      setEditingRange(range);
      setFormData({
        name: range.name,
        minScore: String(range.minScore),
        maxScore: String(range.maxScore),
        points: String(range.points),
        sortOrder: String(range.sortOrder),
      });
    } else {
      setEditingRange(null);
      setFormData({ name: "", minScore: "", maxScore: "", points: "", sortOrder: "0" });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRange(null);
    setFormData({ name: "", minScore: "", maxScore: "", points: "", sortOrder: "0" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const minScore = parseInt(formData.minScore);
    const maxScore = parseInt(formData.maxScore);

    if (minScore > maxScore) {
      setToast({ message: "Min score must be less than or equal to max score", type: "error" });
      return;
    }

    const hasOverlap = ranges.some((range) => {
      if (editingRange && range.id === editingRange.id) return false;
      const overlaps =
        (minScore >= range.minScore && minScore <= range.maxScore) ||
        (maxScore >= range.minScore && maxScore <= range.maxScore) ||
        (minScore <= range.minScore && maxScore >= range.maxScore);
      return overlaps;
    });

    if (hasOverlap) {
      setToast({ message: "This range overlaps with an existing range. Please adjust the scores.", type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        minScore,
        maxScore,
        points: parseInt(formData.points),
        sortOrder: parseInt(formData.sortOrder),
      };

      const url = editingRange
        ? `${API_BASE_URL}/points/ranges/${editingRange.id}`
        : `${API_BASE_URL}/points/ranges`;

      const res = await fetch(url, {
        method: editingRange ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setToast({
          message: editingRange ? "Range updated successfully" : "Range created successfully",
          type: "success",
        });
        loadRanges();
        handleCloseForm();
      } else {
        setToast({ message: data.message || "Failed to save range", type: "error" });
      }
    } catch (error) {
      console.error("Failed to save range:", error);
      setToast({ message: "An error occurred", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this range?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/points/ranges/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setToast({ message: "Range deleted successfully", type: "success" });
        loadRanges();
      } else {
        setToast({ message: data.message || "Failed to delete range", type: "error" });
      }
    } catch (error) {
      console.error("Failed to delete range:", error);
      setToast({ message: "An error occurred", type: "error" });
    }
  };

  const handleToggleActive = async (range: PointsRange) => {
    try {
      const res = await fetch(`${API_BASE_URL}/points/ranges/${range.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !range.isActive }),
      });

      const data = await res.json();
      if (data.success) {
        setToast({
          message: `Range ${!range.isActive ? "activated" : "deactivated"} successfully`,
          type: "success",
        });
        loadRanges();
      } else {
        setToast({ message: data.message || "Failed to update range", type: "error" });
      }
    } catch (error) {
      console.error("Failed to toggle active:", error);
      setToast({ message: "An error occurred", type: "error" });
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row: PointsRange) => <span className="text-white">{row.name}</span>,
    },
    {
      key: "range",
      label: "Score Range",
      render: (row: PointsRange) => (
        <span className="text-[#94A3B8]">
          {row.minScore} to {row.maxScore}
        </span>
      ),
    },
    {
      key: "points",
      label: "Points",
      render: (row: PointsRange) => (
        <span className="text-[#4ADE80] font-semibold">{row.points} pts</span>
      ),
    },
    {
      key: "sortOrder",
      label: "Order",
      render: (row: PointsRange) => <span className="text-[#94A3B8]">{row.sortOrder}</span>,
    },
    {
      key: "isActive",
      label: "Status",
      render: (row: PointsRange) => (
        <StatusBadge status={row.isActive ? "Active" : "Inactive"} />
      ),
    },
  ];

  const activeRanges = ranges.filter((r) => r.isActive).length;
  const totalPoints = ranges.reduce((sum, r) => sum + (r.isActive ? r.points : 0), 0);

  return (
    <div className="space-y-3">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 xl:grid-cols-3">
        <StatsCard title="Total Ranges" value={ranges.length} icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        <StatsCard title="Active Ranges" value={activeRanges} icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        <StatsCard title="Max Points" value={`${totalPoints} pts`} icon="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Points Ranges</h2>
          <p className="text-sm text-[#94A3B8] mt-1">Configure points based on player tournament scores</p>
        </div>
        {!showForm && (
          <Button onClick={() => handleOpenForm()} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>}>
            Add Range
          </Button>
        )}
      </div>

      {showForm && (
        <div className="rounded-lg border border-white/[0.08] bg-gradient-to-br from-[#0b1326] to-[#0a1020]" style={{ padding: "40px" }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {editingRange ? "Edit Points Range" : "Create New Points Range"}
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Define the score range and points awarded to players
              </p>
            </div>
            <button 
              onClick={handleCloseForm} 
              className="rounded-lg p-2.5 text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Range Name Section */}
            <div className="mb-10">
              <label className="block text-base font-bold text-[#E6C36A] mb-4">
                Range Name
              </label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                placeholder="e.g., Excellent, Great, Good, Average" 
                required 
                className="w-full rounded-lg border border-white/[0.08] bg-[#1A2235] text-base text-white placeholder-[#64748B] outline-none transition-all focus:border-[#E6C36A]/50 focus:ring-2 focus:ring-[#E6C36A]/10" 
                style={{ height: "60px", padding: "0 24px" }} 
              />
              <p className="mt-4 text-sm text-[#64748B] leading-relaxed">
                Give this range a descriptive name that reflects the performance level
              </p>
            </div>

            {/* Score Range Section */}
            <div className="mb-10">
              <label className="block text-base font-bold text-[#E6C36A] mb-4">
                Score Range
              </label>
              <div className="rounded-xl border border-white/[0.08] bg-[#0a0f1e]" style={{ padding: "32px" }}>
                {/* Visual Display */}
                <div className="flex items-center justify-center gap-8 mb-8">
                  <div className="flex-1 text-center">
                    <div className="text-5xl font-bold text-[#E6C36A] mb-3">
                      {formData.minScore || "--"}
                    </div>
                    <div className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">
                      Minimum Score
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-px w-16 bg-gradient-to-r from-[#E6C36A] via-[#9dd162] to-[#4ADE80]"></div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <div className="text-xs text-[#64748B] font-medium">to</div>
                  </div>
                  
                  <div className="flex-1 text-center">
                    <div className="text-5xl font-bold text-[#4ADE80] mb-3">
                      {formData.maxScore || "--"}
                    </div>
                    <div className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">
                      Maximum Score
                    </div>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#E6C36A] mb-3">
                      Minimum Score
                    </label>
                    <input 
                      type="number" 
                      value={formData.minScore} 
                      onChange={(e) => setFormData({ ...formData, minScore: e.target.value })} 
                      placeholder="e.g., -20" 
                      required 
                      className="w-full rounded-lg border border-white/[0.08] bg-[#1A2235] text-base text-white placeholder-[#64748B] outline-none transition-all focus:border-[#E6C36A]/50 focus:ring-2 focus:ring-[#E6C36A]/10" 
                      style={{ height: "56px", padding: "0 20px" }} 
                    />
                    <p className="mt-3 text-xs text-[#64748B]">
                      Lower bound (negative for under par)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#4ADE80] mb-3">
                      Maximum Score
                    </label>
                    <input 
                      type="number" 
                      value={formData.maxScore} 
                      onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })} 
                      placeholder="e.g., -15" 
                      required 
                      className="w-full rounded-lg border border-white/[0.08] bg-[#1A2235] text-base text-white placeholder-[#64748B] outline-none transition-all focus:border-[#4ADE80]/50 focus:ring-2 focus:ring-[#4ADE80]/10" 
                      style={{ height: "56px", padding: "0 20px" }} 
                    />
                    <p className="mt-3 text-xs text-[#64748B]">
                      Upper bound (negative for under par)
                    </p>
                  </div>
                </div>

                {/* Validation Message */}
                {formData.minScore && formData.maxScore && (
                  <div className="mt-6 rounded-lg bg-white/[0.03] border border-white/[0.05]" style={{ padding: "16px 20px" }}>
                    <div className="flex items-center gap-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={parseInt(formData.minScore) > parseInt(formData.maxScore) ? "#EF4444" : "#3B82F6"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                      <p className="text-sm text-[#94A3B8] leading-relaxed">
                        This range covers scores from <span className="text-[#E6C36A] font-bold">{formData.minScore}</span> to <span className="text-[#4ADE80] font-bold">{formData.maxScore}</span>
                        {parseInt(formData.minScore) > parseInt(formData.maxScore) && (
                          <span className="text-[#EF4444] font-semibold ml-2">⚠ Invalid: Min must be ≤ Max</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Points Award Section */}
            <div className="mb-10">
              <label className="block text-base font-bold text-[#E6C36A] mb-4">
                Points Award
              </label>
              <div className="rounded-xl border border-white/[0.08] bg-[#0a0f1e]" style={{ padding: "32px" }}>
                {/* Star Badge */}
                <div className="flex justify-center mb-8">
                  <div className="inline-flex items-center gap-4 rounded-xl bg-gradient-to-r from-[#4ADE80]/10 to-[#10B981]/10 border border-[#4ADE80]/30" style={{ padding: "20px 40px" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-[#4ADE80]">{formData.points || 0}</div>
                      <div className="text-sm text-[#4ADE80] font-semibold mt-1">POINTS</div>
                    </div>
                  </div>
                </div>

                {/* Points Input */}
                <div className="max-w-md mx-auto">
                  <label className="block text-sm font-semibold text-[#4ADE80] mb-3">
                    Points Value
                  </label>
                  <input 
                    type="number" 
                    value={formData.points} 
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })} 
                    placeholder="e.g., 100" 
                    required 
                    className="w-full rounded-lg border border-white/[0.08] bg-[#1A2235] text-base text-white placeholder-[#64748B] outline-none transition-all focus:border-[#4ADE80]/50 focus:ring-2 focus:ring-[#4ADE80]/10" 
                    style={{ height: "60px", padding: "0 24px" }} 
                  />
                  <p className="mt-4 text-sm text-[#64748B] leading-relaxed text-center">
                    Players scoring within this range will earn these points
                  </p>
                </div>
              </div>
            </div>

            {/* Display Order Section */}
            <div className="mb-10">
              <label className="block text-base font-bold text-[#E6C36A] mb-4">
                Display Order <span className="text-xs text-[#64748B] font-normal">(Optional)</span>
              </label>
              <div className="max-w-xs">
                <input 
                  type="number" 
                  value={formData.sortOrder} 
                  onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })} 
                  placeholder="0" 
                  className="w-full rounded-lg border border-white/[0.08] bg-[#1A2235] text-base text-white placeholder-[#64748B] outline-none transition-all focus:border-[#E6C36A]/50 focus:ring-2 focus:ring-[#E6C36A]/10" 
                  style={{ height: "56px", padding: "0 20px" }} 
                />
                <p className="mt-3 text-xs text-[#64748B]">
                  Lower numbers appear first in the list
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 border-t border-white/[0.08] pt-8">
              <Button variant="ghost" onClick={handleCloseForm} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingRange ? "Update Range" : "Create Range"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {!showForm && ranges.length > 0 && (
        <div className="rounded-lg border border-[#3B82F6]/20 bg-[#3B82F6]/5" style={{ padding: "12px 16px" }}>
          <div className="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
            <div className="flex-1">
              <p className="text-xs text-[#3B82F6] font-semibold mb-1">Range Coverage</p>
              <p className="text-xs text-[#94A3B8]">Current ranges: {ranges.filter(r => r.isActive).map(r => `${r.minScore} to ${r.maxScore}`).join(", ")}. Scores outside these ranges will receive 0 points.</p>
            </div>
          </div>
        </div>
      )}

      {!showForm && (
        <DataTable<PointsRange & Record<string, unknown>>
          columns={columns as { key: string; label: string; render?: (row: PointsRange & Record<string, unknown>) => React.ReactNode }[]}
          data={ranges as (PointsRange & Record<string, unknown>)[]}
          searchKey="name"
          searchPlaceholder="Search ranges..."
          actions={(row) => (
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => handleToggleActive(row as unknown as PointsRange)} className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-white" title={row.isActive ? "Deactivate" : "Activate"}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{row.isActive ? <path d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /> : <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}</svg>
              </button>
              <button onClick={() => handleOpenForm(row as unknown as PointsRange)} className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-white" title="Edit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              </button>
              <button onClick={() => handleDelete((row as unknown as PointsRange).id)} className="rounded-lg p-1.5 text-[#EF4444]/70 transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444]" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></svg>
              </button>
            </div>
          )}
        />
      )}

      <div className="rounded-lg border border-[#E6C36A]/20 bg-[#E6C36A]/5" style={{ padding: "16px 20px" }}>
        <h3 className="text-sm font-semibold text-[#E6C36A] mb-2">How it works:</h3>
        <ul className="text-xs text-[#94A3B8] space-y-1" style={{ paddingLeft: "20px", listStyleType: "disc" }}>
          <li>Define score ranges (e.g., -20 to -15) and assign points</li>
          <li>Ranges cannot overlap - each score must belong to only one range</li>
          <li>Users pick 5 players from different tiers before tournament starts</li>
          <li>After tournament completion, each player's final score is matched to a range</li>
          <li>If a player's score falls outside all ranges, they receive 0 points</li>
          <li>Total points are calculated and credited to user's wallet</li>
          <li>Use negative numbers for under par (e.g., -18), positive for over par (e.g., +5)</li>
          <li><strong>Tip:</strong> Create catch-all ranges like -999 to -21 or +10 to +999 to handle extreme scores</li>
        </ul>
      </div>
    </div>
  );
}
