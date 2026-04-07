"use client";

import StatsCard from "@/app/components/StatsCard";
import { DASHBOARD_STATS, USERS, COMMUNITY_POSTS, REDEMPTIONS } from "@/app/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid - Primary Metrics */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#64748B]">Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Total Users" value={DASHBOARD_STATS.totalUsers} change={DASHBOARD_STATS.userGrowth} positive icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          <StatsCard title="Active Bags" value={DASHBOARD_STATS.totalBags} change={DASHBOARD_STATS.scanGrowth} positive icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          <StatsCard title="Total NFC Scans" value={DASHBOARD_STATS.totalScans.toLocaleString()} change={DASHBOARD_STATS.scanGrowth} positive icon="M13 10V3L4 14h7v7l9-11h-7z" />
          <StatsCard title="Community Posts" value={DASHBOARD_STATS.communityPosts} change={DASHBOARD_STATS.postGrowth} positive icon="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1" />
        </div>
      </div>

      {/* Stats Grid - Secondary Metrics */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#64748B]">Engagement</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Active Users" value={DASHBOARD_STATS.activeUsers} icon="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
          <StatsCard title="Fantasy Participation" value={`${DASHBOARD_STATS.fantasyParticipation}%`} icon="M13 10V3L4 14h7v7l9-11h-7z" />
          <StatsCard title="Rewards Redeemed" value={DASHBOARD_STATS.rewardsRedeemed} change={DASHBOARD_STATS.rewardGrowth} positive icon="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          <StatsCard title="Revenue" value={DASHBOARD_STATS.revenue} icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </div>
      </div>

      {/* Recent Users Section */}
      <div>
        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#64748B]">Recent Users</h2>
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#64748B]">Community Activity</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Recent Users */}
          <div className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-[#0b1326] to-[#0a1020] shadow-lg" style={{ marginTop: "10px", marginBottom: "10px" }}>
            <div className="space-y-0">
              {USERS.slice(0, 5).map((u, idx) => (
                <div key={u.id}>
                  <div className="flex items-center justify-between" style={{ padding: "5px 10px" }}>
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#E6C36A] to-[#c9a84e] text-sm font-bold text-[#030812] shadow-lg shadow-[#E6C36A]/20">
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">{u.name}</div>
                        <div className="mt-0.5 truncate text-xs text-[#64748B]">{u.email}</div>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-bold text-[#E6C36A]">{u.points}</div>
                      <div className="mt-0.5 text-xs text-[#64748B]">points</div>
                    </div>
                  </div>
                  {idx !== 4 && <div className="border-b border-white/[0.06]"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Community Activity */}
          <div className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-[#0b1326] to-[#0a1020] shadow-lg" style={{ marginTop: "10px", marginBottom: "10px" }}>
            <div className="space-y-0">
              {COMMUNITY_POSTS.slice(0, 5).map((p, idx) => (
                <div key={p.id}>
                  <div style={{ padding: "5px 10px" }}>
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold text-white">{p.author}</span>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wide"
                        style={{
                          color: p.status === "Flagged" ? "#EF4444" : p.status === "Hidden" ? "#64748B" : "#4ADE80",
                        }}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="mb-2 text-xs leading-relaxed text-[#94A3B8] line-clamp-2">{p.content}</p>
                    <div className="flex gap-4 text-xs text-[#64748B]">
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {p.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        {p.replies}
                      </span>
                      {p.reports > 0 && (
                        <span className="flex items-center gap-1 text-[#EF4444]">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                          {p.reports}
                        </span>
                      )}
                    </div>
                  </div>
                  {idx !== 4 && <div className="border-b border-white/[0.06]"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Redemptions Section */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#64748B]">Recent Redemptions</h2>
        <div className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-[#0b1326] to-[#0a1020] shadow-lg" style={{ marginTop: "10px", marginBottom: "10px" }}>
          <div className="space-y-0">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1.5fr] gap-4 border-b border-white/[0.08]" style={{ padding: "8px 10px" }}>
              <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">User</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Item</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Points</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Status</div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Date</div>
            </div>
            {/* Table Rows */}
            {REDEMPTIONS.map((r, idx) => (
              <div key={r.id}>
                <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1.5fr] gap-4" style={{ padding: "5px 10px" }}>
                  <div className="text-sm font-medium text-white">{r.user}</div>
                  <div className="text-sm text-[#94A3B8]">{r.item}</div>
                  <div className="text-sm font-bold text-[#E6C36A]">{r.points}</div>
                  <div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide"
                      style={{
                        color: r.status === "Fulfilled" ? "#4ADE80" : r.status === "Shipped" ? "#3B82F6" : "#E6C36A",
                      }}
                    >
                      {r.status}
                    </span>
                  </div>
                  <div className="text-sm text-[#64748B]">{r.redeemedAt}</div>
                </div>
                {idx !== REDEMPTIONS.length - 1 && <div className="border-b border-white/[0.06]"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
