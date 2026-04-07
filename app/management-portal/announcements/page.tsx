"use client";

import { useState } from "react";
import StatsCard from "@/app/components/StatsCard";
import DataTable from "@/app/components/DataTable";
import Modal from "@/app/components/ui/Modal";
import StatusBadge from "@/app/components/StatusBadge";
import FormField, { Input, Select, Textarea } from "@/app/components/ui/FormField";
import Button from "@/app/components/ui/Button";
import { ANNOUNCEMENTS } from "@/app/lib/mock-data";
import type { Announcement } from "@/app/lib/types";

// SVG path constants
const ICON_SEND = "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z";
const ICON_PUBLISHED = "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3";
const ICON_SCHEDULED = "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2";
const ICON_DRAFT = "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z";

export default function AnnouncementsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const totalSent = ANNOUNCEMENTS.reduce((sum, a) => sum + a.sentTo, 0);
  const published = ANNOUNCEMENTS.filter((a) => a.status === "Published").length;
  const scheduled = ANNOUNCEMENTS.filter((a) => a.status === "Scheduled").length;
  const drafts = ANNOUNCEMENTS.filter((a) => a.status === "Draft").length;

  const openCreate = () => {
    setSelectedAnnouncement(null);
    setModalOpen(true);
  };

  const openEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setModalOpen(true);
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (row: Announcement) => (
        <span className="font-medium text-white">{row.title}</span>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (row: Announcement) => (
        <span className="text-[#94A3B8]">
          {row.message.length > 50 ? row.message.slice(0, 50) + "..." : row.message}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (row: Announcement) => <StatusBadge status={row.type} />,
    },
    { key: "audience", label: "Audience" },
    {
      key: "status",
      label: "Status",
      render: (row: Announcement) => <StatusBadge status={row.status} />,
    },
    {
      key: "scheduledAt",
      label: "Scheduled At",
      render: (row: Announcement) => (
        <span className="text-[#94A3B8]">{row.scheduledAt || "—"}</span>
      ),
    },
    {
      key: "sentTo",
      label: "Sent To",
      render: (row: Announcement) => (
        <span className="font-medium text-white">{row.sentTo > 0 ? row.sentTo.toLocaleString() : "—"}</span>
      ),
    },
  ];

  const actions = (row: Announcement) => (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          openEdit(row);
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
        title="Delete"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatsCard title="Total Sent" value={totalSent} change="18.3%" positive icon={ICON_SEND} />
        <StatsCard title="Published" value={published} icon={ICON_PUBLISHED} />
        <StatsCard title="Scheduled" value={scheduled} icon={ICON_SCHEDULED} />
        <StatsCard title="Drafts" value={drafts} icon={ICON_DRAFT} />
      </div>

      {/* Page Header */}
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          + Create Announcement
        </Button>
      </div>

      {/* Announcements Table */}
      <DataTable<Announcement & Record<string, unknown>>
        columns={columns as { key: string; label: string; render?: (row: Announcement & Record<string, unknown>) => React.ReactNode }[]}
        data={ANNOUNCEMENTS as (Announcement & Record<string, unknown>)[]}
        searchKey="title"
        searchPlaceholder="Search announcements by title..."
        gridColumns="2fr 2.5fr 0.8fr 1fr 0.9fr 1.2fr 0.8fr 80px"
        actions={actions as (row: Announcement & Record<string, unknown>) => React.ReactNode}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedAnnouncement ? "Edit Announcement" : "Create Announcement"}
        width="650px"
      >
        <div>
          <FormField label="Title">
            <Input
              placeholder="Enter announcement title"
              defaultValue={selectedAnnouncement?.title ?? ""}
            />
          </FormField>

          <FormField label="Message">
            <Textarea
              placeholder="Enter announcement message..."
              rows={4}
              defaultValue={selectedAnnouncement?.message ?? ""}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-x-4">
            <FormField label="Type">
              <Select defaultValue={selectedAnnouncement?.type ?? "Both"}>
                <option value="Banner">Banner</option>
                <option value="Push">Push</option>
                <option value="Both">Both</option>
              </Select>
            </FormField>
            <FormField label="Audience">
              <Select defaultValue={selectedAnnouncement?.audience ?? "All"}>
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Premium">Premium</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <FormField label="Status">
              <Select defaultValue={selectedAnnouncement?.status ?? "Draft"}>
                <option value="Published">Published</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Draft">Draft</option>
              </Select>
            </FormField>
            <FormField label="Scheduled date">
              <Input
                type="datetime-local"
                defaultValue={selectedAnnouncement?.scheduledAt?.replace(" ", "T") ?? ""}
              />
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
              {selectedAnnouncement ? "Save Changes" : "Create Announcement"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
