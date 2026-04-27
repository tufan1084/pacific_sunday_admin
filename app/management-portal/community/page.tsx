"use client";

import { useEffect, useState, useCallback } from "react";
import StatsCard from "@/app/components/StatsCard";
import DataTable from "@/app/components/DataTable";
import Modal from "@/app/components/ui/Modal";
import StatusBadge from "@/app/components/StatusBadge";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/Loader";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// SVG path constants
const ICON_MESSAGE = "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z";
const ICON_FLAG = "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7";
const ICON_EYE_OFF = "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22";
const ICON_ALERT = "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01";

type FilterTab = "All" | "Published" | "Flagged" | "Hidden";

interface CommunityPost extends Record<string, unknown> {
  id: number;
  author: string;
  authorId?: number;
  authorUsername?: string | null;
  content: string;
  group: string;
  teamId: number | null;
  likes: number;
  replies: number;
  reports: number;
  pendingReports: number;
  status: "Published" | "Flagged" | "Hidden";
  isHidden: boolean;
  createdAt: string;
}

interface ReportRow {
  id: number;
  reason: string;
  details: string | null;
  status: "pending" | "reviewed" | "dismissed";
  createdAt: string;
  reporter: { id: number; name: string; username: string };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Translate raw report-reason slugs ("spam_or_misleading") into clean labels
// ("Spam or misleading content"). Mirrors the mapping the backend email
// service uses so the moderator UI and the user's email read the same way.
const REASON_LABELS: Record<string, string> = {
  spam: "Spam or misleading content",
  spam_or_misleading: "Spam or misleading content",
  harassment: "Harassment or bullying",
  hate_speech: "Hate speech",
  nudity: "Nudity or sexual content",
  violence: "Violence or graphic content",
  scam: "Scam or fraud",
  off_topic: "Off topic for this community",
  inappropriate: "Inappropriate content",
  other: "Other",
};
const reasonLabel = (raw: string | null | undefined) => {
  if (!raw) return "Community guidelines violation";
  const key = String(raw).toLowerCase().trim();
  if (REASON_LABELS[key]) return REASON_LABELS[key];
  return key.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};
const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

interface AdminTagOption {
  id: number;
  slug: string;
  label: string;
}

interface PostTagRow {
  id: number;
  slug: string;
  label: string;
  source: "auto" | "manual";
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterTab, setFilterTab] = useState<FilterTab>("All");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  const [reports, setReports] = useState<ReportRow[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  const [actionBusy, setActionBusy] = useState<number | null>(null);

  // Tag override modal state — separate from the view modal so admins can
  // edit tags without leaving the moderation table.
  const [tagModalPost, setTagModalPost] = useState<CommunityPost | null>(null);
  const [tagOptions, setTagOptions] = useState<AdminTagOption[]>([]);
  const [postTagRows, setPostTagRows] = useState<PostTagRow[]>([]);
  const [tagModalLoading, setTagModalLoading] = useState(false);
  const [tagModalSaving, setTagModalSaving] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/posts`);
      const json = await res.json();
      if (json.success) {
        setPosts(json.data as CommunityPost[]);
      } else {
        setError(json.message || "Failed to load posts");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to connect to server";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const fetchReportsFor = useCallback(async (postId: number) => {
    setReportsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/posts/${postId}/reports`);
      const json = await res.json();
      if (json.success) setReports(json.data as ReportRow[]);
      else setReports([]);
    } catch {
      setReports([]);
    } finally {
      setReportsLoading(false);
    }
  }, []);

  // Stats
  const totalPosts = posts.length;
  const flaggedPosts = posts.filter((p) => p.status === "Flagged").length;
  const hiddenPosts = posts.filter((p) => p.status === "Hidden").length;
  const totalReports = posts.reduce((sum, p) => sum + p.reports, 0);

  const filteredPosts =
    filterTab === "All"
      ? posts
      : posts.filter((p) => p.status === filterTab);

  const filterTabs: FilterTab[] = ["All", "Published", "Flagged", "Hidden"];

  const handleView = (post: CommunityPost) => {
    setSelectedPost(post);
    setViewModalOpen(true);
    fetchReportsFor(post.id);
  };

  const handleToggleHide = async (post: CommunityPost) => {
    setActionBusy(post.id);
    try {
      const res = await fetch(`${API_BASE}/admin/posts/${post.id}/hide`, { method: "PATCH" });
      const json = await res.json();
      if (json.success) {
        const newHidden = json.data.isHidden as boolean;
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? { ...p, isHidden: newHidden, status: newHidden ? "Hidden" : p.pendingReports > 0 ? "Flagged" : "Published" }
              : p
          )
        );
        if (selectedPost?.id === post.id) {
          setSelectedPost({ ...post, isHidden: newHidden, status: newHidden ? "Hidden" : post.pendingReports > 0 ? "Flagged" : "Published" });
        }
      }
    } finally {
      setActionBusy(null);
    }
  };

  const handleDelete = async (post: CommunityPost) => {
    if (!confirm(`Delete this post by ${post.author}? This cannot be undone.`)) return;
    setActionBusy(post.id);
    try {
      const res = await fetch(`${API_BASE}/admin/posts/${post.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        if (selectedPost?.id === post.id) {
          setViewModalOpen(false);
          setSelectedPost(null);
        }
      }
    } finally {
      setActionBusy(null);
    }
  };

  // Open the tag-override modal for a post: load the tag catalog + the
  // post's current tag rows in parallel and preselect them.
  const handleOpenTags = async (post: CommunityPost) => {
    setTagModalPost(post);
    setTagModalLoading(true);
    try {
      const [tagsRes, postTagsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/tags`).then(r => r.json()),
        fetch(`${API_BASE}/admin/posts/${post.id}/tags`).then(r => r.json()),
      ]);
      const opts: AdminTagOption[] = tagsRes.success
        ? (tagsRes.data as any[]).map(t => ({ id: t.id, slug: t.slug, label: t.label }))
        : [];
      const rows: PostTagRow[] = postTagsRes.success ? (postTagsRes.data as PostTagRow[]) : [];
      setTagOptions(opts);
      setPostTagRows(rows);
      setSelectedSlugs(rows.map(r => r.slug));
    } finally {
      setTagModalLoading(false);
    }
  };

  const toggleSlug = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  // Save admin-selected tags as manual overrides. `replace` mode wipes auto
  // rows too — the admin's selection becomes the full set.
  const handleSaveTags = async () => {
    if (!tagModalPost) return;
    setTagModalSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/posts/${tagModalPost.id}/tags`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: selectedSlugs, mode: "replace" }),
      });
      const json = await res.json();
      if (json.success) {
        setTagModalPost(null);
      } else {
        alert(json.message || "Failed to update tags");
      }
    } finally {
      setTagModalSaving(false);
    }
  };

  // Ask the backend to re-run keyword detection on the post content. Handy
  // after changing keywords in /tags — existing posts don't auto-update.
  const handleRescanTags = async () => {
    if (!tagModalPost) return;
    setTagModalSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/posts/${tagModalPost.id}/tags`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: [], mode: "override", rescan: true }),
      });
      const json = await res.json();
      if (json.success) {
        // Refresh the modal state without closing it.
        const postTagsRes = await fetch(`${API_BASE}/admin/posts/${tagModalPost.id}/tags`).then(r => r.json());
        const rows: PostTagRow[] = postTagsRes.success ? (postTagsRes.data as PostTagRow[]) : [];
        setPostTagRows(rows);
        setSelectedSlugs(rows.map(r => r.slug));
      }
    } finally {
      setTagModalSaving(false);
    }
  };

  const handleResolveReports = async (post: CommunityPost, status: "reviewed" | "dismissed") => {
    const res = await fetch(`${API_BASE}/admin/posts/${post.id}/reports/resolve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (json.success) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? { ...p, pendingReports: 0, status: p.isHidden ? "Hidden" : "Published" }
            : p
        )
      );
      if (selectedPost?.id === post.id) {
        setSelectedPost({
          ...post,
          pendingReports: 0,
          status: post.isHidden ? "Hidden" : "Published",
        });
        fetchReportsFor(post.id);
      }
    }
  };

  if (loading) return <Loader text="Loading posts..." fullPage />;

  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ height: "calc(100vh - 120px)" }}>
        <div className="text-center">
          <p className="text-sm text-[#EF4444]">{error}</p>
          <Button onClick={fetchPosts}>Retry</Button>
        </div>
      </div>
    );
  }

  const columns: Array<{
    key: string;
    label: string;
    align?: "left" | "center" | "right";
    render?: (row: CommunityPost) => React.ReactNode;
  }> = [
    {
      key: "author",
      label: "Author",
      align: "left",
      render: (row) => (
        <span className="block truncate font-medium normal-case text-white" title={row.author}>{row.author}</span>
      ),
    },
    {
      key: "content",
      label: "Content",
      align: "left",
      render: (row) => (
        <span className="block truncate text-[#94A3B8]" title={row.content}>
          {row.content}
        </span>
      ),
    },
    {
      key: "group",
      label: "Group",
      align: "left",
      render: (row) => (
        <span className="block truncate text-[#94A3B8]" title={row.group}>{row.group}</span>
      ),
    },
    {
      key: "likes",
      label: "Likes",
      align: "center",
      render: (row) => <span className="tabular-nums text-[#94A3B8]">{row.likes}</span>,
    },
    {
      key: "replies",
      label: "Replies",
      align: "center",
      render: (row) => <span className="tabular-nums text-[#94A3B8]">{row.replies}</span>,
    },
    {
      key: "reports",
      label: "Reports",
      align: "center",
      render: (row) => (
        <span className={`tabular-nums ${row.pendingReports > 0 ? "font-semibold text-[#EF4444]" : "text-[#94A3B8]"}`}>
          {row.reports}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "left",
      render: (row) => (
        <span className="inline-flex"><StatusBadge status={row.status} /></span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      align: "right",
      render: (row) => (
        <span className="whitespace-nowrap tabular-nums text-[#64748B]">{formatDate(row.createdAt)}</span>
      ),
    },
  ];

  const actions = (row: CommunityPost) => (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={(e) => { e.stopPropagation(); handleView(row); }}
        className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-white"
        title="View"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); handleToggleHide(row); }}
        disabled={actionBusy === row.id}
        className={`rounded-lg p-1.5 transition-colors ${
          row.isHidden
            ? "text-[#4ADE80]/70 hover:bg-[#4ADE80]/10 hover:text-[#4ADE80]"
            : "text-[#94A3B8] hover:bg-white/5 hover:text-white"
        } ${actionBusy === row.id ? "opacity-50 cursor-wait" : ""}`}
        title={row.isHidden ? "Show" : "Hide"}
      >
        {row.isHidden ? (
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
      <button
        onClick={(e) => { e.stopPropagation(); handleDelete(row); }}
        disabled={actionBusy === row.id}
        className={`rounded-lg p-1.5 text-[#EF4444]/70 transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444] ${actionBusy === row.id ? "opacity-50 cursor-wait" : ""}`}
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
        <StatsCard title="Total Posts" value={totalPosts} icon={ICON_MESSAGE} />
        <StatsCard title="Flagged Posts" value={flaggedPosts} icon={ICON_FLAG} />
        <StatsCard title="Hidden Posts" value={hiddenPosts} icon={ICON_EYE_OFF} />
        <StatsCard title="Total Reports" value={totalReports} icon={ICON_ALERT} />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 rounded-lg border border-white/[0.08] bg-[#0b1326]" style={{ padding: "6px" }}>
        {filterTabs.map((tab) => {
          const count =
            tab === "All"
              ? posts.length
              : posts.filter((p) => p.status === tab).length;
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
              <sup className={`ml-1 text-xs font-bold ${filterTab === tab ? "text-[#020617]" : "text-[#E6C36A]"}`}>
                {count}
              </sup>
            </button>
          );
        })}
      </div>

      {/* Posts Table.
          Columns: Author | Content | Group | Likes | Replies | Reports | Status | Date | Actions.
          Numeric columns (Likes/Replies/Reports) get tabular-nums for clean
          right-edge alignment of varying-width digits. */}
      <DataTable<CommunityPost>
        columns={columns as { key: string; label: string; align?: "left" | "center" | "right"; render?: (row: CommunityPost) => React.ReactNode }[]}
        data={filteredPosts}
        searchKey="author"
        searchPlaceholder="Search posts by author..."
        gridColumns="1.4fr 2.6fr 1fr 70px 80px 90px 110px 1fr 110px"
        actions={actions}
      />

      {/* View Post Modal */}
      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Post Details" width="640px">
        {selectedPost && (() => {
          const labelClass = "text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#E8C96A]/80";
          const dividerStyle: React.CSSProperties = { borderTop: "1px solid rgba(255,255,255,0.06)" };
          return (
          <div>
            {/* Meta strip — flat 4-column row, no card. */}
            <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: "16px", paddingBottom: "14px" }}>
              <div className="min-w-0">
                <div className={labelClass} style={{ marginBottom: "4px" }}>Author</div>
                <div className="truncate text-[13px] font-semibold text-white" title={selectedPost.author}>{selectedPost.author}</div>
              </div>
              <div className="min-w-0">
                <div className={labelClass} style={{ marginBottom: "4px" }}>Group</div>
                <div className="truncate text-[13px] font-semibold text-white" title={selectedPost.group}>{selectedPost.group}</div>
              </div>
              <div className="min-w-0">
                <div className={labelClass} style={{ marginBottom: "4px" }}>Date</div>
                <div className="whitespace-nowrap text-[13px] font-semibold text-white">{formatDate(selectedPost.createdAt)}</div>
              </div>
              <div className="min-w-0">
                <div className={labelClass} style={{ marginBottom: "4px" }}>Status</div>
                <StatusBadge status={selectedPost.status} />
              </div>
            </div>

            <div style={{ ...dividerStyle, paddingTop: "14px" }}>
              <div className={labelClass} style={{ marginBottom: "6px" }}>Content</div>
              <div
                className="text-[13px] leading-[1.6] text-white"
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {selectedPost.content}
              </div>
            </div>

            <div style={{ ...dividerStyle, marginTop: "14px", paddingTop: "14px" }}>
              <div className={labelClass} style={{ marginBottom: "8px" }}>Engagement</div>
              <div className="flex" style={{ gap: "32px" }}>
                {[
                  { label: "Likes", value: selectedPost.likes, color: "text-white" },
                  { label: "Replies", value: selectedPost.replies, color: "text-white" },
                  { label: "Reports", value: selectedPost.reports, color: selectedPost.pendingReports > 0 ? "text-[#EF4444]" : "text-white" },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/55" style={{ marginBottom: "2px" }}>{m.label}</div>
                    <div className={`text-[20px] font-bold leading-none tabular-nums ${m.color}`}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reports list — divider rows, no nested cards. */}
            {selectedPost.reports > 0 && (
              <div style={{ ...dividerStyle, marginTop: "14px", paddingTop: "14px" }}>
                <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                  <div className={labelClass}>Reports · {selectedPost.reports}</div>
                  {selectedPost.pendingReports > 0 && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleResolveReports(selectedPost, "dismissed")}
                        className="text-[11px] font-semibold text-white/60 transition-colors hover:text-white"
                      >
                        Dismiss all
                      </button>
                      <button
                        onClick={() => handleResolveReports(selectedPost, "reviewed")}
                        className="text-[11px] font-semibold text-[#4ADE80] transition-colors hover:text-[#86EFAC]"
                      >
                        Mark all reviewed
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ maxHeight: "220px", overflowY: "auto" }}>
                  {reportsLoading ? (
                    <p className="text-xs text-white/55">Loading reports…</p>
                  ) : reports.length === 0 ? (
                    <p className="text-xs text-white/55">No reports</p>
                  ) : (
                    reports.map((r, idx) => (
                      <div
                        key={r.id}
                        style={{
                          paddingTop: idx === 0 ? "0" : "10px",
                          paddingBottom: idx === reports.length - 1 ? "0" : "10px",
                          borderBottom: idx === reports.length - 1 ? "none" : "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <div className="flex items-start justify-between" style={{ gap: "10px", marginBottom: "4px" }}>
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-semibold text-white" title={r.reporter.name}>
                              {r.reporter.name}
                            </div>
                            <div className="text-[11px] text-white/55">@{r.reporter.username} · {formatDate(r.createdAt)}</div>
                          </div>
                          <StatusBadge status={titleCase(r.status)} />
                        </div>
                        <div className="text-[12.5px] text-white/85" style={{ lineHeight: 1.5 }}>
                          <span className="font-semibold text-[#E8C96A]">{reasonLabel(r.reason)}</span>
                          {r.details && <span className="text-white/70"> — {r.details}</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Footer actions */}
            <div className="flex flex-wrap items-center justify-end" style={{ ...dividerStyle, gap: "8px", marginTop: "16px", paddingTop: "14px" }}>
              <Button variant="ghost" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
              <Button variant="secondary" onClick={() => handleToggleHide(selectedPost)} disabled={actionBusy === selectedPost.id}>
                {selectedPost.isHidden ? "Show post" : "Hide post"}
              </Button>
              <Button
                onClick={() => handleDelete(selectedPost)}
                disabled={actionBusy === selectedPost.id}
                className="!bg-[#EF4444] !shadow-none !text-white hover:!bg-[#dc2626]"
              >
                Delete post
              </Button>
            </div>
          </div>
          );
        })()}
      </Modal>

      {/* Edit Tags Modal */}
      <Modal
        open={!!tagModalPost}
        onClose={() => setTagModalPost(null)}
        title={tagModalPost ? `Edit tags for post by ${tagModalPost.author}` : "Edit tags"}
        width="520px"
      >
        {tagModalPost && (
          <div>
            <div
              className="rounded-lg border border-white/[0.06] bg-[#0b1326] text-xs text-[#94A3B8]"
              style={{ padding: "10px 12px", marginBottom: "16px", maxHeight: "80px", overflow: "auto" }}
            >
              {tagModalPost.content}
            </div>

            {tagModalLoading ? (
              <p className="text-xs text-[#64748B]">Loading tags…</p>
            ) : tagOptions.length === 0 ? (
              <p className="text-xs text-[#64748B]">
                No tags exist yet. Create some in the Tags & Keywords section first.
              </p>
            ) : (
              <>
                <p className="text-xs font-bold text-[#94A3B8]" style={{ marginBottom: "10px" }}>
                  Tags on this post
                </p>
                <div className="flex flex-wrap gap-2" style={{ marginBottom: "16px" }}>
                  {tagOptions.map(opt => {
                    const selected = selectedSlugs.includes(opt.slug);
                    const existingRow = postTagRows.find(r => r.slug === opt.slug);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleSlug(opt.slug)}
                        className={`text-xs rounded border transition-colors ${
                          selected
                            ? "text-[#020617] bg-[#E6C36A] border-[#E6C36A]"
                            : "text-[#94A3B8] border-white/[0.08] hover:border-[#E6C36A]/50 hover:text-white"
                        }`}
                        style={{ padding: "6px 12px" }}
                      >
                        {opt.label}
                        {existingRow?.source === "manual" && (
                          <sup className="ml-1 text-[9px] font-bold opacity-70">M</sup>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-[#64748B]" style={{ marginBottom: "20px" }}>
                  Saving will replace all tags on this post with your selection (including auto-detected ones).
                  Use <b>Rescan</b> to re-run keyword detection without manual changes.
                </p>
              </>
            )}

            <div className="flex justify-between border-t border-white/[0.08]" style={{ paddingTop: "16px" }}>
              <Button variant="ghost" onClick={handleRescanTags} disabled={tagModalSaving || tagModalLoading}>
                Rescan keywords
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setTagModalPost(null)} disabled={tagModalSaving}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTags} disabled={tagModalSaving || tagModalLoading}>
                  {tagModalSaving ? "Saving..." : "Save tags"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
