"use client";

import { useState, useEffect } from "react";
import StatsCard from "@/app/components/StatsCard";
import DataTable from "@/app/components/DataTable";
import FormField from "@/app/components/FormField";
import Modal from "@/app/components/Modal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

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
  const [showModal, setShowModal] = useState(false);
  const [editingRange, setEditingRange] = useState<PointsRange | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE_URL}/points/ranges`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const handleOpenModal = (range?: PointsRange) => {
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
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRange(null);
    setFormData({ name: "", minScore: "", maxScore: "", points: "", sortOrder: "0" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (parseInt(formData.minScore) > parseInt(formData.maxScore)) {
      alert("Min score must be less than or equal to max score");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("admin_token");
      const payload = {
        name: formData.name,
        minScore: parseInt(formData.minScore),
        maxScore: parseInt(formData.maxScore),
        points: parseInt(formData.points),
        sortOrder: parseInt(formData.sortOrder),
      };

      const url = editingRange
        ? `${API_BASE_URL}/points/ranges/${editingRange.id}`
        : `${API_BASE_URL}/points/ranges`;

      const res = await fetch(url, {
        method: editingRange ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert(editingRange ? "Range updated successfully" : "Range created successfully");
        loadRanges();
        handleCloseModal();
      } else {
        alert(data.message || "Failed to save range");
      }
    } catch (error) {
      console.error("Failed to save range:", error);
      alert("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this range?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE_URL}/points/ranges/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        alert("Range deleted successfully");
        loadRanges();
      } else {
        alert(data.message || "Failed to delete range");
      }
    } catch (error) {
      console.error("Failed to delete range:", error);
      alert("An error occurred");
    }
  };

  const handleToggleActive = async (range: PointsRange) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE_URL}/points/ranges/${range.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !range.isActive }),
      });

      const data = await res.json();
      if (data.success) {
        loadRanges();
      } else {
        alert(data.message || "Failed to update range");
      }
    } catch (error) {
      console.error("Failed to toggle active:", error);
      alert("An error occurred");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    {
      key: "range",
      label: "Score Range",
      render: (range: PointsRange) => `${range.minScore} to ${range.maxScore}`,
    },
    {
      key: "points",
      label: "Points",
      render: (range: PointsRange) => (
        <span style={{ color: "#10B981", fontWeight: 600 }}>{range.points} pts</span>
      ),
    },
    {
      key: "sortOrder",
      label: "Order",
    },
    {
      key: "isActive",
      label: "Status",
      render: (range: PointsRange) => (
        <button
          onClick={() => handleToggleActive(range)}
          style={{
            padding: "4px 12px",
            borderRadius: "4px",
            border: "none",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            backgroundColor: range.isActive ? "#D1FAE5" : "#F3F4F6",
            color: range.isActive ? "#065F46" : "#6B7280",
          }}
        >
          {range.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (range: PointsRange) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => handleOpenModal(range)}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "none",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: "#DBEAFE",
              color: "#1E40AF",
            }}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(range.id)}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "none",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: "#FEE2E2",
              color: "#991B1B",
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const activeRanges = ranges.filter((r) => r.isActive).length;
  const totalPoints = ranges.reduce((sum, r) => sum + (r.isActive ? r.points : 0), 0);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>
          Point System
        </h1>
        <p style={{ color: "#6B7280", fontSize: "14px" }}>
          Configure points ranges based on player tournament scores
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <StatsCard title="Total Ranges" value={ranges.length} />
        <StatsCard title="Active Ranges" value={activeRanges} />
        <StatsCard title="Max Points Available" value={`${totalPoints} pts`} />
      </div>

      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827" }}>Points Ranges</h2>
        <button
          onClick={() => handleOpenModal()}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            backgroundColor: "#3B82F6",
            color: "#FFFFFF",
          }}
        >
          + Add Range
        </button>
      </div>

      <DataTable columns={columns} data={ranges} loading={loading} />

      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          backgroundColor: "#FEF3C7",
          border: "1px solid #FCD34D",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#92400E", marginBottom: "8px" }}>
          How it works:
        </h3>
        <ul style={{ fontSize: "13px", color: "#78350F", lineHeight: "1.6", margin: 0, paddingLeft: "20px" }}>
          <li>Define score ranges (e.g., -20 to -15) and assign points</li>
          <li>Users pick 5 players from different tiers before tournament starts</li>
          <li>After tournament completion, each player's final score is matched to a range</li>
          <li>Total points are calculated and credited to user's wallet</li>
          <li>Use negative numbers for under par (e.g., -18), positive for over par (e.g., +5)</li>
          <li>To calculate points for a completed tournament, use the API endpoint: POST /api/points/calculate/:tournId</li>
        </ul>
      </div>

      {showModal && (
        <Modal
          title={editingRange ? "Edit Points Range" : "Add Points Range"}
          onClose={handleCloseModal}
        >
          <form onSubmit={handleSubmit}>
            <FormField
              label="Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Excellent"
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField
                label="Min Score"
                type="number"
                required
                value={formData.minScore}
                onChange={(e) => setFormData({ ...formData, minScore: e.target.value })}
                placeholder="e.g., -20"
              />

              <FormField
                label="Max Score"
                type="number"
                required
                value={formData.maxScore}
                onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                placeholder="e.g., -15"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField
                label="Points"
                type="number"
                required
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                placeholder="e.g., 100"
              />

              <FormField
                label="Sort Order"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                placeholder="0"
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: submitting ? "not-allowed" : "pointer",
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? "Saving..." : editingRange ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #D1D5DB",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  backgroundColor: "#FFFFFF",
                  color: "#374151",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
