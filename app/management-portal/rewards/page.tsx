"use client";

import { useState } from "react";
import StatsCard from "@/app/components/StatsCard";
import DataTable from "@/app/components/DataTable";
import Modal from "@/app/components/ui/Modal";
import StatusBadge from "@/app/components/StatusBadge";
import FormField, { Input, Select, Textarea } from "@/app/components/ui/FormField";
import Button from "@/app/components/ui/Button";
import { REWARD_ITEMS, REDEMPTIONS } from "@/app/lib/mock-data";
import type { RewardItem, Redemption } from "@/app/lib/types";

// SVG path constants
const ICON_GIFT = "M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z";
const ICON_CHECK = "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3";
const ICON_AWARD = "M12 15l-2 5-1-3-3-1 5-2M22 9l-2 5-1-3-3-1 5-2M12 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z";
const ICON_CLOCK = "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2";

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<"items" | "redemptions">("items");
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RewardItem | null>(null);

  const totalItems = REWARD_ITEMS.length;
  const activeItems = REWARD_ITEMS.filter((i) => i.status === "Active").length;
  const totalRedeemed = REWARD_ITEMS.reduce((sum, i) => sum + i.redeemed, 0);
  const pendingOrders = REDEMPTIONS.filter((r) => r.status === "Pending").length;

  const openAddItem = () => {
    setSelectedItem(null);
    setItemModalOpen(true);
  };

  const openEditItem = (item: RewardItem) => {
    setSelectedItem(item);
    setItemModalOpen(true);
  };

  // --- Items Table ---
  const itemColumns = [
    {
      key: "name",
      label: "Name",
      render: (row: RewardItem) => (
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E6C36A]/10 text-xs font-bold text-[#E6C36A]">
            {row.name.charAt(0)}
          </div>
          <span className="font-medium text-white">{row.name}</span>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (row: RewardItem) => (
        <span className="text-[#94A3B8]">{row.description}</span>
      ),
    },
    {
      key: "pointCost",
      label: "Point Cost",
      render: (row: RewardItem) => (
        <span className="font-semibold text-[#E6C36A]">{row.pointCost.toLocaleString()}</span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (row: RewardItem) => (
        <span className={row.stock === 0 ? "text-[#EF4444]" : "text-white"}>{row.stock}</span>
      ),
    },
    {
      key: "redeemed",
      label: "Redeemed",
      render: (row: RewardItem) => (
        <span className="text-white">{row.redeemed}</span>
      ),
    },
    { key: "category", label: "Category" },
    {
      key: "status",
      label: "Status",
      render: (row: RewardItem) => <StatusBadge status={row.status} />,
    },
  ];

  const itemActions = (row: RewardItem) => (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          openEditItem(row);
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
        className="rounded-lg p-1.5 text-[#EF4444]/70 transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
        title="Deactivate"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M4.93 4.93l14.14 14.14" />
        </svg>
      </button>
    </div>
  );

  // --- Redemptions Table ---
  const redemptionColumns = [
    {
      key: "user",
      label: "User",
      render: (row: Redemption) => (
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E6C36A]/15 text-xs font-bold text-[#E6C36A]">
            {row.user.charAt(0)}
          </div>
          <span className="font-medium text-white">{row.user}</span>
        </div>
      ),
    },
    { key: "item", label: "Item" },
    {
      key: "points",
      label: "Points",
      render: (row: Redemption) => (
        <span className="font-semibold text-[#E6C36A]">{row.points.toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: Redemption) => <StatusBadge status={row.status} />,
    },
    {
      key: "redeemedAt",
      label: "Date",
      render: (row: Redemption) => (
        <span className="text-[#94A3B8]">{row.redeemedAt}</span>
      ),
    },
  ];

  const redemptionActions = (row: Redemption) => (
    <div className="flex items-center justify-end gap-2">
      {row.status === "Pending" && (
        <>
          <button
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg bg-[#4ADE80]/10 px-3 py-1.5 text-xs font-semibold text-[#4ADE80] transition-colors hover:bg-[#4ADE80]/20"
          >
            Fulfill
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg bg-[#3B82F6]/10 px-3 py-1.5 text-xs font-semibold text-[#3B82F6] transition-colors hover:bg-[#3B82F6]/20"
          >
            Ship
          </button>
        </>
      )}
      {row.status === "Fulfilled" && (
        <button
          onClick={(e) => e.stopPropagation()}
          className="rounded-lg bg-[#3B82F6]/10 px-3 py-1.5 text-xs font-semibold text-[#3B82F6] transition-colors hover:bg-[#3B82F6]/20"
        >
          Ship
        </button>
      )}
    </div>
  );

  const tabs = [
    { key: "items" as const, label: "Items", count: REWARD_ITEMS.length },
    { key: "redemptions" as const, label: "Redemptions", count: REDEMPTIONS.length },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatsCard title="Total Items" value={totalItems} icon={ICON_GIFT} />
        <StatsCard title="Active Items" value={activeItems} change="2 new" positive icon={ICON_CHECK} />
        <StatsCard title="Total Redeemed" value={totalRedeemed} change="22.1%" positive icon={ICON_AWARD} />
        <StatsCard title="Pending Orders" value={pendingOrders} icon={ICON_CLOCK} />
      </div>

      {/* Page Header */}
      {activeTab === "items" && (
        <div className="flex justify-end">
          <Button onClick={openAddItem}>
            + Add Item
          </Button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 rounded-lg border border-white/[0.08] bg-[#0b1326]" style={{ padding: "6px" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-[#E6C36A] to-[#c9a84e] text-[#020617] shadow-lg shadow-[#E6C36A]/20"
                : "text-[#94A3B8] hover:text-white hover:bg-white/5"
            }`}
            style={{ padding: "10px 16px" }}
          >
            {tab.label}
            <sup className={`ml-1 text-xs font-bold ${
              activeTab === tab.key ? "text-[#020617]" : "text-[#E6C36A]"
            }`}>
              {tab.count}
            </sup>
          </button>
        ))}
      </div>

      {/* Items Table */}
      {activeTab === "items" && (
        <DataTable<RewardItem & Record<string, unknown>>
          columns={itemColumns as { key: string; label: string; render?: (row: RewardItem & Record<string, unknown>) => React.ReactNode }[]}
          data={REWARD_ITEMS as (RewardItem & Record<string, unknown>)[]}
          searchKey="name"
          searchPlaceholder="Search reward items..."
          gridColumns="2.5fr 2.5fr 1fr 0.7fr 0.8fr 1fr 0.9fr 80px"
          actions={itemActions as (row: RewardItem & Record<string, unknown>) => React.ReactNode}
        />
      )}

      {/* Redemptions Table */}
      {activeTab === "redemptions" && (
        <DataTable<Redemption & Record<string, unknown>>
          columns={redemptionColumns as { key: string; label: string; render?: (row: Redemption & Record<string, unknown>) => React.ReactNode }[]}
          data={REDEMPTIONS as (Redemption & Record<string, unknown>)[]}
          searchKey="user"
          searchPlaceholder="Search redemptions by user..."
          gridColumns="2fr 2.5fr 1fr 1fr 1.5fr 120px"
          actions={redemptionActions as (row: Redemption & Record<string, unknown>) => React.ReactNode}
        />
      )}

      {/* Add / Edit Item Modal */}
      <Modal
        open={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        title={selectedItem ? "Edit Reward Item" : "Add Reward Item"}
        width="650px"
      >
        <div>
          <FormField label="Name">
            <Input
              placeholder="Enter item name"
              defaultValue={selectedItem?.name ?? ""}
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              placeholder="Enter item description..."
              rows={3}
              defaultValue={selectedItem?.description ?? ""}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-x-4">
            <FormField label="Point cost">
              <Input
                type="number"
                placeholder="0"
                defaultValue={selectedItem?.pointCost ?? ""}
              />
            </FormField>
            <FormField label="Stock">
              <Input
                type="number"
                placeholder="0"
                defaultValue={selectedItem?.stock ?? ""}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <FormField label="Category">
              <Select defaultValue={selectedItem?.category ?? "Apparel"}>
                <option value="Apparel">Apparel</option>
                <option value="Accessories">Accessories</option>
                <option value="Experiences">Experiences</option>
                <option value="Collectibles">Collectibles</option>
              </Select>
            </FormField>
            <FormField label="Status">
              <Select defaultValue={selectedItem?.status ?? "Active"}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </FormField>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/[0.08]" style={{ marginTop: "40px", paddingTop: "20px", marginBottom: "20px" }}>
            <Button
              variant="ghost"
              onClick={() => setItemModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setItemModalOpen(false)}
            >
              {selectedItem ? "Save Changes" : "Add Item"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
