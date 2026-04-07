"use client";

import { useState } from "react";
import StatsCard from "@/app/components/StatsCard";
import DataTable from "@/app/components/DataTable";
import Modal from "@/app/components/ui/Modal";
import StatusBadge from "@/app/components/StatusBadge";
import FormField, { Input, Select } from "@/app/components/ui/FormField";
import Button from "@/app/components/ui/Button";
import { BAGS, TRANSFER_REQUESTS } from "@/app/lib/mock-data";
import type { AdminBag, TransferRequest } from "@/app/lib/types";

// SVG path constants
const ICON_BAG = "M20 7h-4l-2-3H10L8 7H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z";
const ICON_CHECK = "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3";
const ICON_SCAN = "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z";
const ICON_TRANSFER = "M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4";

export default function BagsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBag, setSelectedBag] = useState<AdminBag | null>(null);

  const totalBags = BAGS.length;
  const activeBags = BAGS.filter((b) => b.status === "Active").length;
  const totalScans = BAGS.reduce((sum, b) => sum + b.scans, 0);
  const pendingTransfers = TRANSFER_REQUESTS.filter((t) => t.status === "Pending").length;

  const handleView = (bag: AdminBag) => {
    setSelectedBag(bag);
    setModalOpen(true);
  };

  /* ── Bags Table Columns ── */
  const bagColumns = [
    {
      key: "serial",
      label: "Serial",
      render: (row: AdminBag) => (
        <span className="font-mono text-xs text-white">{row.serial}</span>
      ),
    },
    { key: "model", label: "Model" },
    {
      key: "owner",
      label: "Owner",
      render: (row: AdminBag) => (
        <span className="text-white">{row.owner}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: AdminBag) => <StatusBadge status={row.status} />,
    },
    {
      key: "nfcToken",
      label: "NFC Token",
      render: (row: AdminBag) => (
        <span className="font-mono text-[11px] text-white">{row.nfcToken}</span>
      ),
    },
    {
      key: "scans",
      label: "Scans",
      render: (row: AdminBag) => (
        <span className="text-white">{row.scans}</span>
      ),
    },
    { key: "lastScan", label: "Last Scan" },
  ];

  const bagActions = (row: AdminBag) => (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleView(row);
        }}
        className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-white"
        title="View"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
      <button
        onClick={(e) => e.stopPropagation()}
        className="rounded-lg p-1.5 text-[#EF4444]/70 transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
        title="Delete"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
        </svg>
      </button>
    </div>
  );

  /* ── Transfer Requests Table Columns ── */
  const transferColumns = [
    {
      key: "bag",
      label: "Bag Serial",
      render: (row: TransferRequest) => (
        <span className="font-mono text-xs text-white">{row.bag}</span>
      ),
    },
    {
      key: "from",
      label: "From",
      render: (row: TransferRequest) => <span className="text-white">{row.from}</span>,
    },
    {
      key: "to",
      label: "To",
      render: (row: TransferRequest) => <span className="text-white">{row.to}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (row: TransferRequest) => <StatusBadge status={row.status} />,
    },
    { key: "requestedAt", label: "Requested" },
  ];

  const transferActions = (row: TransferRequest) => (
    <div className="flex items-center justify-end gap-2">
      {row.status === "Pending" ? (
        <>
          <button
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-[#4ADE80] transition-colors hover:bg-[#4ADE80]/10"
            title="Approve"
          >
            <div className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Approve
            </div>
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-[#EF4444] transition-colors hover:bg-[#EF4444]/10"
            title="Reject"
          >
            <div className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Reject
            </div>
          </button>
        </>
      ) : (
        <span className="text-xs text-[#64748B]">--</span>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 xl:grid-cols-4">
        <StatsCard title="Total Bags" value={totalBags} change="5.2%" positive icon={ICON_BAG} />
        <StatsCard title="Active Bags" value={activeBags} change="3.8%" positive icon={ICON_CHECK} />
        <StatsCard title="Total Scans" value={totalScans.toLocaleString()} change="8.3%" positive icon={ICON_SCAN} />
        <StatsCard title="Pending Transfers" value={pendingTransfers} icon={ICON_TRANSFER} />
      </div>

      {/* Bags Table */}
      <DataTable<AdminBag & Record<string, unknown>>
        columns={bagColumns as { key: string; label: string; render?: (row: AdminBag & Record<string, unknown>) => React.ReactNode }[]}
        data={BAGS as (AdminBag & Record<string, unknown>)[]}
        searchKey="serial"
        searchPlaceholder="Search bags by serial number..."
        actions={bagActions as (row: AdminBag & Record<string, unknown>) => React.ReactNode}
        gridColumns="1fr 1.2fr 1.5fr 1fr 1fr 0.6fr 1.2fr 100px"
      />

      {/* Transfer Requests Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between" style={{ marginBottom: "10px" }}>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#64748B]">Transfer Requests</h2>
            <p className="text-xs text-[#94A3B8] mt-1">Review and manage bag ownership transfer requests</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#E6C36A]" />
            <span className="text-xs font-bold text-[#E6C36A]">{pendingTransfers} pending</span>
          </div>
        </div>

        <DataTable<TransferRequest & Record<string, unknown>>
          columns={transferColumns as { key: string; label: string; render?: (row: TransferRequest & Record<string, unknown>) => React.ReactNode }[]}
          data={TRANSFER_REQUESTS as (TransferRequest & Record<string, unknown>)[]}
          actions={transferActions as (row: TransferRequest & Record<string, unknown>) => React.ReactNode}
        />
      </div>

      {/* View Bag Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Bag Details" width="650px">
        {selectedBag && (
          <div>
            {/* Bag header */}
            <div className="mb-6 pb-4" style={{ marginBottom: "20px" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-12">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#64748B]">Serial number:</span>
                    <span className="font-mono text-base font-semibold text-white">{selectedBag.serial}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#64748B]">Model:</span>
                    <span className="text-base text-white">{selectedBag.model}</span>
                  </div>
                </div>
                <StatusBadge status={selectedBag.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4">
              <FormField label="Owner">
                <Input defaultValue={selectedBag.owner} />
              </FormField>
              <FormField label="Status">
                <Select defaultValue={selectedBag.status}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Lost">Lost</option>
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-x-4">
              <FormField label="NFC token">
                <Input defaultValue={selectedBag.nfcToken} readOnly />
              </FormField>
              <FormField label="Total scans">
                <Input defaultValue={selectedBag.scans} type="number" readOnly />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-x-4">
              <FormField label="Last scan">
                <Input defaultValue={selectedBag.lastScan} readOnly />
              </FormField>
              <FormField label="Registered">
                <Input defaultValue={selectedBag.registeredAt} readOnly />
              </FormField>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/[0.08]" style={{ marginTop: "40px", paddingTop: "20px", marginBottom: "20px" }}>
              <Button
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setModalOpen(false)}
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
