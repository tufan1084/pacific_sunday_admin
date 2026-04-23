"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "@/app/components/ui/Modal";
import Button from "@/app/components/ui/Button";
import FormField, { Input, Textarea } from "@/app/components/ui/FormField";
import Loader from "@/app/components/Loader";
import StatsCard from "@/app/components/StatsCard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// SVG path constants (match other admin pages)
const ICON_TAG = "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01";
const ICON_KEY = "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z";
const ICON_DOC = "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2";

interface TagKeyword {
  id: number;
  keyword: string;
}

interface TagRow {
  id: number;
  slug: string;
  label: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  keywordCount: number;
  postCount: number;
  keywords: TagKeyword[];
  createdAt: string;
  updatedAt: string;
}

export default function TagManagementPage() {
  const [tags, setTags] = useState<TagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const [editingTag, setEditingTag] = useState<TagRow | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/tags`);
      const json = await res.json();
      if (json.success) {
        setTags(json.data as TagRow[]);
        setError(null);
      } else {
        setError(json.message || "Failed to load tags");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTags(); }, [fetchTags]);

  const totals = useMemo(() => ({
    tags: tags.length,
    activeTags: tags.filter(t => t.isActive).length,
    keywords: tags.reduce((s, t) => s + t.keywordCount, 0),
    taggedPosts: tags.reduce((s, t) => s + t.postCount, 0),
  }), [tags]);

  const handleCreate = async () => {
    if (!newLabel.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: newLabel.trim(),
          description: newDescription.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setCreateOpen(false);
        setNewLabel("");
        setNewDescription("");
        fetchTags();
      } else {
        alert(json.message || "Failed to create tag");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (tag: TagRow) => {
    const res = await fetch(`${API_BASE}/admin/tags/${tag.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !tag.isActive }),
    });
    const json = await res.json();
    if (json.success) fetchTags();
  };

  const handleDeleteTag = async (tag: TagRow) => {
    if (!confirm(`Delete tag "${tag.label}"? This will also remove it from ${tag.postCount} post(s).`)) return;
    const res = await fetch(`${API_BASE}/admin/tags/${tag.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      setEditingTag(null);
      fetchTags();
    }
  };

  // Fetch-once helper used to refresh the edit modal's tag after a
  // keyword mutation. Returns the freshly-loaded list so we can pick the
  // currently-edited tag out of it.
  const reloadTags = useCallback(async (): Promise<TagRow[]> => {
    try {
      const res = await fetch(`${API_BASE}/admin/tags`);
      const json = await res.json();
      if (json.success) {
        const data = json.data as TagRow[];
        setTags(data);
        return data;
      }
    } catch { /* ignore */ }
    return [];
  }, []);

  const handleAddKeyword = async (tag: TagRow, keyword: string) => {
    const clean = keyword.trim().toLowerCase();
    if (!clean) return;
    const res = await fetch(`${API_BASE}/admin/tags/${tag.id}/keywords`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: clean }),
    });
    const json = await res.json();
    if (json.success) {
      const fresh = await reloadTags();
      const updated = fresh.find(t => t.id === tag.id);
      if (updated) setEditingTag(updated);
    } else {
      alert(json.message || "Failed to add keyword");
    }
  };

  const handleDeleteKeyword = async (tag: TagRow, keywordId: number) => {
    const res = await fetch(`${API_BASE}/admin/keywords/${keywordId}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      const fresh = await reloadTags();
      const updated = fresh.find(t => t.id === tag.id);
      if (updated) setEditingTag(updated);
    }
  };

  if (loading) return <Loader text="Loading tags..." fullPage />;

  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ height: "calc(100vh - 120px)" }}>
        <div className="text-center">
          <p className="text-sm text-[#EF4444]">{error}</p>
          <Button onClick={fetchTags}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatsCard title="Total Tags" value={totals.tags} icon={ICON_TAG} />
        <StatsCard title="Active Tags" value={totals.activeTags} icon={ICON_TAG} />
        <StatsCard title="Total Keywords" value={totals.keywords} icon={ICON_KEY} />
        <StatsCard title="Tagged Posts" value={totals.taggedPosts} icon={ICON_DOC} />
      </div>

      {/* Header with Create button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Tags & Keywords</h2>
          <p className="text-xs text-[#64748B]" style={{ marginTop: "4px" }}>
            Posts are auto-tagged when a keyword is found in their content. Used by community tabs & filters.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ Create Tag</Button>
      </div>

      {/* Tag cards grid */}
      {tags.length === 0 ? (
        <div className="rounded-xl border border-white/[0.08] bg-[#0b1326]" style={{ padding: "40px", textAlign: "center" }}>
          <p className="text-sm text-[#94A3B8]">No tags yet. Create one to start auto-categorizing posts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="rounded-xl border border-white/[0.08] bg-[#0b1326]"
              style={{ padding: "16px" }}
            >
              <div className="flex items-start justify-between" style={{ marginBottom: "12px" }}>
                <div style={{ minWidth: 0 }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: "4px" }}>
                    <span className="text-sm font-bold text-white truncate">{tag.label}</span>
                    {!tag.isActive && (
                      <span className="text-[10px] font-bold text-[#94A3B8] border border-white/[0.08] rounded" style={{ padding: "2px 6px" }}>
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#64748B]">#{tag.slug}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(tag)}
                    title={tag.isActive ? "Deactivate" : "Activate"}
                    className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-white/5 hover:text-white"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {tag.isActive ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={() => setEditingTag(tag)}
                    title="Manage keywords"
                    className="rounded-lg p-1.5 text-[#E6C36A] hover:bg-[#E6C36A]/10"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteTag(tag)}
                    title="Delete tag"
                    className="rounded-lg p-1.5 text-[#EF4444]/70 hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>

              {tag.description && (
                <p className="text-xs text-[#94A3B8]" style={{ marginBottom: "10px" }}>{tag.description}</p>
              )}

              <div className="flex items-center gap-4 text-[11px] text-[#64748B]" style={{ marginBottom: "10px" }}>
                <span>{tag.keywordCount} keyword{tag.keywordCount !== 1 ? "s" : ""}</span>
                <span>•</span>
                <span>{tag.postCount} post{tag.postCount !== 1 ? "s" : ""}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {tag.keywords.slice(0, 8).map(kw => (
                  <span
                    key={kw.id}
                    className="text-[11px] text-[#E6C36A] border border-[#E6C36A]/30 bg-[#E6C36A]/5 rounded"
                    style={{ padding: "3px 8px" }}
                  >
                    {kw.keyword}
                  </span>
                ))}
                {tag.keywords.length > 8 && (
                  <span className="text-[11px] text-[#64748B]" style={{ padding: "3px 8px" }}>
                    +{tag.keywords.length - 8} more
                  </span>
                )}
                {tag.keywords.length === 0 && (
                  <span className="text-[11px] text-[#64748B] italic">No keywords yet</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Tag Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Tag" width="500px">
        <FormField label="Label">
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="e.g. Fantasy Talk"
          />
        </FormField>
        <FormField label="Description (optional)">
          <Textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="What does this tag mean?"
          />
        </FormField>
        <div className="flex justify-end gap-3" style={{ marginTop: "8px" }}>
          <Button variant="ghost" onClick={() => setCreateOpen(false)} disabled={saving}>Cancel</Button>
          <Button onClick={handleCreate} disabled={saving || !newLabel.trim()}>
            {saving ? "Creating..." : "Create Tag"}
          </Button>
        </div>
      </Modal>

      {/* Edit Keywords Modal */}
      <KeywordEditor
        tag={editingTag}
        onClose={() => setEditingTag(null)}
        onAdd={async (kw) => { if (editingTag) await handleAddKeyword(editingTag, kw); }}
        onDelete={async (kwId) => { if (editingTag) await handleDeleteKeyword(editingTag, kwId); }}
      />
    </div>
  );
}

// Keywords-only sub-modal. Kept inline because it's tightly coupled to the
// page's data fetching helpers.
function KeywordEditor({
  tag,
  onClose,
  onAdd,
  onDelete,
}: {
  tag: TagRow | null;
  onClose: () => void;
  onAdd: (keyword: string) => void | Promise<void>;
  onDelete: (keywordId: number) => void | Promise<void>;
}) {
  const [draft, setDraft] = useState("");

  useEffect(() => { setDraft(""); }, [tag?.id]);

  if (!tag) return null;

  const submit = () => {
    if (!draft.trim()) return;
    onAdd(draft);
    setDraft("");
  };

  return (
    <Modal open={!!tag} onClose={onClose} title={`Keywords for ${tag.label}`} width="560px">
      <p className="text-xs text-[#94A3B8]" style={{ marginBottom: "16px" }}>
        Any post whose content contains one of these keywords (word-boundary match, case-insensitive) will be auto-tagged with #{tag.slug}.
      </p>

      <div className="flex gap-2" style={{ marginBottom: "16px" }}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } }}
          placeholder="Add a keyword and press Enter"
          className="flex-1 rounded-lg border border-white/[0.08] bg-[#1A2235] text-sm text-white outline-none transition-all focus:border-[#E6C36A]/50"
          style={{ height: "40px", padding: "0 14px" }}
        />
        <Button onClick={submit} disabled={!draft.trim()}>Add</Button>
      </div>

      {tag.keywords.length === 0 ? (
        <p className="text-xs text-[#64748B] italic">No keywords yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tag.keywords.map(kw => (
            <span
              key={kw.id}
              className="flex items-center gap-2 text-xs text-[#E6C36A] border border-[#E6C36A]/30 bg-[#E6C36A]/5 rounded"
              style={{ padding: "6px 10px" }}
            >
              <span>{kw.keyword}</span>
              <button
                onClick={() => onDelete(kw.id)}
                className="text-[#94A3B8] hover:text-[#EF4444]"
                title="Remove"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-end" style={{ marginTop: "24px" }}>
        <Button variant="ghost" onClick={onClose}>Done</Button>
      </div>
    </Modal>
  );
}
