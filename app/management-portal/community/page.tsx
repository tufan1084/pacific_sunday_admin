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

  const columns = [
    {
      key: "author",
      label: "Author",
      render: (row: CommunityPost) => <span className="text-white">{row.author}</span>,
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
      render: (row: CommunityPost) => <span className="text-[#94A3B8]">{row.group}</span>,
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
        <span className={row.pendingReports > 0 ? "text-[#EF4444]" : "text-[#94A3B8]"}>
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
      render: (row: CommunityPost) => <span className="text-[#64748B]">{formatDate(row.createdAt)}</span>,
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
        onClick={(e) => { e.stopPropagation(); handleOpenTags(row); }}
        className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-[#E6C36A]"
        title="Edit tags"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          <line x1="7" y1="7" x2="7" y2="7" />
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

      {/* Posts Table */}
      <DataTable<CommunityPost>
        columns={columns as { key: string; label: string; render?: (row: CommunityPost) => React.ReactNode }[]}
        data={filteredPosts}
        searchKey="author"
        searchPlaceholder="Search posts by author..."
        gridColumns="1.8fr 2.8fr 0.9fr 0.5fr 0.6fr 0.6fr 0.9fr 1.4fr 120px"
        actions={actions}
      />

      {/* View Post Modal */}
      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Post Details" width="650px">
        {selectedPost && (
          <div>
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
                  <p className="text-base font-semibold text-white">{formatDate(selectedPost.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#64748B] mb-1">Status</p>
                  <StatusBadge status={selectedPost.status} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p className="text-xs font-bold text-[#64748B]" style={{ marginBottom: "12px" }}>Content</p>
              <p className="text-sm leading-relaxed text-white" style={{ marginLeft: "16px" }}>{selectedPost.content}</p>
            </div>

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
                  <p className={`text-lg font-bold ${selectedPost.pendingReports > 0 ? "text-[#EF4444]" : "text-white"}`}>
                    {selectedPost.reports}
                  </p>
                </div>
              </div>
            </div>

            {selectedPost.reports > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
                  <p className="text-xs font-bold text-[#64748B]">Reports ({selectedPost.reports})</p>
                  {selectedPost.pendingReports > 0 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResolveReports(selectedPost, "dismissed")}
                        className="text-xs font-semibold text-[#94A3B8] hover:text-white"
                      >
                        Dismiss all
                      </button>
                      <button
                        onClick={() => handleResolveReports(selectedPost, "reviewed")}
                        className="text-xs font-semibold text-[#4ADE80] hover:text-[#4ADE80]/80"
                      >
                        Mark all reviewed
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ marginLeft: "16px", maxHeight: "200px", overflowY: "auto" }}>
                  {reportsLoading ? (
                    <p className="text-xs text-[#64748B]">Loading reports…</p>
                  ) : reports.length === 0 ? (
                    <p className="text-xs text-[#64748B]">No reports</p>
                  ) : (
                    <ul className="space-y-2">
                      {reports.map((r) => (
                        <li key={r.id} className="rounded-lg border border-white/[0.06] p-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">{r.reporter.name}</span>
                            <StatusBadge status={r.status} />
                          </div>
                          <p className="text-xs text-[#94A3B8]" style={{ marginTop: "4px" }}>
                            <span className="font-semibold text-[#E6C36A]">{r.reason}</span>
                            {r.details ? ` — ${r.details}` : ""}
                          </p>
                          <p className="text-[10px] text-[#64748B]" style={{ marginTop: "4px" }}>
                            {formatDate(r.createdAt)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-white/[0.08]" style={{ marginTop: "40px", paddingTop: "20px", marginBottom: "20px" }}>
              <Button variant="ghost" onClick={() => setViewModalOpen(false)}>
                Dismiss
              </Button>
              <Button variant="secondary" onClick={() => handleToggleHide(selectedPost)}>
                {selectedPost.isHidden ? "Show Post" : "Hide Post"}
              </Button>
              <Button onClick={() => handleDelete(selectedPost)}>
                Delete Post
              </Button>
            </div>
          </div>
        )}
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
