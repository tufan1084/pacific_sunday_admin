"use client";

import { useState } from "react";
import StatsCard from "@/app/components/StatsCard";
import DataTable from "@/app/components/DataTable";
import Modal from "@/app/components/ui/Modal";
import StatusBadge from "@/app/components/StatusBadge";
import Button from "@/app/components/ui/Button";
import { COMMUNITY_POSTS } from "@/app/lib/mock-data";
import type { CommunityPost } from "@/app/lib/types";

// SVG path constants
const ICON_MESSAGE = "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z";
const ICON_FLAG = "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7";
const ICON_EYE_OFF = "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22";
const ICON_ALERT = "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01";

type FilterTab = "All" | "Published" | "Flagged" | "Hidden";

export default function CommunityPage() {
  const [filterTab, setFilterTab] = useState<FilterTab>("All");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  // Stats
  const totalPosts = COMMUNITY_POSTS.length;
  const flaggedPosts = COMMUNITY_POSTS.filter((p) => p.status === "Flagged").length;
  const hiddenPosts = COMMUNITY_POSTS.filter((p) => p.status === "Hidden").length;
  const totalReports = COMMUNITY_POSTS.reduce((sum, p) => sum + p.reports, 0);

  // Filter data
  const filteredPosts =
    filterTab === "All"
      ? COMMUNITY_POSTS
      : COMMUNITY_POSTS.filter((p) => p.status === filterTab);

  const filterTabs: FilterTab[] = ["All", "Published", "Flagged", "Hidden"];

  const handleView = (post: CommunityPost) => {
    setSelectedPost(post);
    setViewModalOpen(true);
  };

  // Columns
  const columns = [
    {
      key: "author",
      label: "Author",
      render: (row: CommunityPost) => (
        <span className="text-white">{row.author}</span>
      ),
    },
    {
      key: "content",
      label: "Content",
      render: (row: CommunityPost) => (
        <span className="text-[#94A3B8]">
          {row.content.length > 60 ? row.content.substring(0, 60) + "..." : row.content}
        </span>
      ),
    },
    {
      key: "group",
      label: "Group",
      render: (row: CommunityPost) => (
        <span className="text-[#94A3B8]">{row.group}</span>
      ),
    },
    {
      key: "likes",
      label: "Likes",
      render: (row: CommunityPost) => <span className="text-[#94A3B8]">{row.likes}</span>,
    },
    {
      key: "replies",
      label: "Replies",
      render: (row: CommunityPost) => <span className="text-[#94A3B8]">{row.replies}</span>,
    },
    {
      key: "reports",
      label: "Reports",
      render: (row: CommunityPost) => (
        <span className={row.reports > 0 ? "text-[#EF4444]" : "text-[#94A3B8]"}>
          {row.reports}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: CommunityPost) => <StatusBadge status={row.status} />,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row: CommunityPost) => (
        <span className="text-[#64748B]">{row.createdAt}</span>
      ),
    },
  ];

  const actions = (row: CommunityPost) => (
    <div className="flex items-center justify-end gap-2">
      {/* View */}
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
      {/* Hide / Show toggle */}
      <button
        onClick={(e) => e.stopPropagation()}
        className={`rounded-lg p-1.5 transition-colors ${
          row.status === "Hidden"
            ? "text-[#4ADE80]/70 hover:bg-[#4ADE80]/10 hover:text-[#4ADE80]"
            : "text-[#94A3B8] hover:bg-white/5 hover:text-white"
        }`}
        title={row.status === "Hidden" ? "Show" : "Hide"}
      >
        {row.status === "Hidden" ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        )}
      </button>
      {/* Delete */}
      <button
        onClick={(e) => e.stopPropagation()}
        className="rounded-lg p-1.5 text-[#EF4444]/70 transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
        title="Delete"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatsCard title="Total Posts" value={totalPosts} change="15.2%" positive icon={ICON_MESSAGE} />
        <StatsCard title="Flagged Posts" value={flaggedPosts} icon={ICON_FLAG} />
        <StatsCard title="Hidden Posts" value={hiddenPosts} icon={ICON_EYE_OFF} />
        <StatsCard title="Total Reports" value={totalReports} icon={ICON_ALERT} />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 rounded-lg border border-white/[0.08] bg-[#0b1326]" style={{ padding: "6px" }}>
        {filterTabs.map((tab) => {
          const count =
            tab === "All"
              ? COMMUNITY_POSTS.length
              : COMMUNITY_POSTS.filter((p) => p.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`flex-1 rounded-md text-sm font-semibold transition-all ${
                filterTab === tab
                  ? "bg-gradient-to-r from-[#E6C36A] to-[#c9a84e] text-[#020617] shadow-lg shadow-[#E6C36A]/20"
                  : "text-[#94A3B8] hover:text-white hover:bg-white/5"
              }`}
              style={{ padding: "10px 16px" }}
            >
              {tab}
              <sup className={`ml-1 text-xs font-bold ${
                filterTab === tab ? "text-[#020617]" : "text-[#E6C36A]"
              }`}>
                {count}
              </sup>
            </button>
          );
        })}
      </div>

      {/* Posts Table */}
      <DataTable<CommunityPost & Record<string, unknown>>
        columns={columns as { key: string; label: string; render?: (row: CommunityPost & Record<string, unknown>) => React.ReactNode }[]}
        data={filteredPosts as (CommunityPost & Record<string, unknown>)[]}
        searchKey="author"
        searchPlaceholder="Search posts by author..."
        gridColumns="1.8fr 2.8fr 0.9fr 0.5fr 0.6fr 0.6fr 0.9fr 1.4fr 90px"
        actions={actions as (row: CommunityPost & Record<string, unknown>) => React.ReactNode}
      />

      {/* View Post Modal */}
      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Post Details" width="650px">
        {selectedPost && (
          <div>
            {/* Author header - no background, border-bottom divider */}
            <div className="mb-6 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#64748B] mb-1">Author</p>
                  <p className="text-base font-semibold text-white">{selectedPost.author}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#64748B] mb-1">Group</p>
                  <p className="text-base font-semibold text-white">{selectedPost.group}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#64748B] mb-1">Date</p>
                  <p className="text-base font-semibold text-white">{selectedPost.createdAt}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#64748B] mb-1">Status</p>
                  <StatusBadge status={selectedPost.status} />
                </div>
              </div>
            </div>

            {/* Post content */}
            <div style={{ marginBottom: "24px" }}>
              <p className="text-xs font-bold text-[#64748B]" style={{ marginBottom: "12px" }}>Content</p>
              <p className="text-sm leading-relaxed text-white" style={{ marginLeft: "16px" }}>{selectedPost.content}</p>
            </div>

            {/* Engagement stats */}
            <div style={{ marginBottom: "24px" }}>
              <p className="text-xs font-bold text-[#64748B]" style={{ marginBottom: "12px" }}>Engagement</p>
              <div className="grid grid-cols-3" style={{ gap: "24px", marginLeft: "16px" }}>
                <div>
                  <p className="text-xs text-[#64748B]" style={{ marginBottom: "8px" }}>Likes</p>
                  <p className="text-lg font-bold text-white">{selectedPost.likes}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]" style={{ marginBottom: "8px" }}>Replies</p>
                  <p className="text-lg font-bold text-white">{selectedPost.replies}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]" style={{ marginBottom: "8px" }}>Reports</p>
                  <p className={`text-lg font-bold ${selectedPost.reports > 0 ? "text-[#EF4444]" : "text-white"}`}>
                    {selectedPost.reports}
                  </p>
                </div>
              </div>
            </div>

            {/* Moderate actions */}
            <div className="flex justify-end gap-3 border-t border-white/[0.08]" style={{ marginTop: "40px", paddingTop: "20px", marginBottom: "20px" }}>
              <Button
                variant="ghost"
                onClick={() => setViewModalOpen(false)}
              >
                Dismiss
              </Button>
              <Button
                variant="secondary"
                onClick={() => setViewModalOpen(false)}
              >
                {selectedPost.status === "Hidden" ? "Show Post" : "Hide Post"}
              </Button>
              <Button
                onClick={() => setViewModalOpen(false)}
              >
                Delete Post
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
