"use client";

import { useState } from "react";
import { Input, Select } from "@/app/components/ui/FormField";
import Button from "@/app/components/ui/Button";
import Modal from "@/app/components/ui/Modal";
import FormField from "@/app/components/ui/FormField";

export default function SettingsPage() {
  // General Settings
  const [appName, setAppName] = useState("Pacific Sunday");
  const [appDescription, setAppDescription] = useState("Fantasy golf platform with NFC-enabled bag collectibles");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Scoring Rules
  const [pointsPerPick, setPointsPerPick] = useState(10);
  const [h2hWinBonus, setH2hWinBonus] = useState(25);
  const [majorMultiplier, setMajorMultiplier] = useState(2);
  const [streakBonus, setStreakBonus] = useState(5);

  // Game Configuration
  const [pickLockTime, setPickLockTime] = useState("08:00");
  const [maxH2HWager, setMaxH2HWager] = useState(150);
  const [fantasyTiers, setFantasyTiers] = useState(5);

  // Add Admin Modal
  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);

  // Admin accounts
  const adminUsers = [
    { name: "Alex Richardson", email: "alex@pacificsunday.com", role: "Super Admin" },
    { name: "Jordan Lee", email: "jordan@pacificsunday.com", role: "Moderator" },
    { name: "Sam Nakamura", email: "sam@pacificsunday.com", role: "Moderator" },
  ];

  const roleBadgeStyle = (role: string) => {
    if (role === "Super Admin") {
      return { color: "#E6C36A" };
    }
    return { color: "#3B82F6" };
  };

  return (
    <div className="space-y-4">
      {/* General Settings */}
      <div className="rounded-lg border border-white/[0.08] bg-gradient-to-br from-[#0b1326] to-[#0a1020] overflow-hidden" style={{ marginBottom: "16px" }}>
        <div className="border-b border-white/[0.08]" style={{ padding: "10px" }}>
          <h2 className="text-xs font-bold uppercase tracking-wide text-[#E6C36A]">General Settings</h2>
        </div>
        <div style={{ padding: "10px" }} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#94A3B8]">App name</label>
            <Input value={appName} onChange={(e) => setAppName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-[#94A3B8]">Description</label>
            <Input value={appDescription} onChange={(e) => setAppDescription(e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Maintenance mode</p>
              <p className="text-xs text-[#64748B]">Temporarily disable platform access for all users</p>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative h-5 w-10 rounded-full transition-colors ${
                maintenanceMode ? "bg-[#E6C36A]" : "bg-[#1A2235]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${
                  maintenanceMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Scoring Rules */}
      <div className="rounded-lg border border-white/[0.08] bg-gradient-to-br from-[#0b1326] to-[#0a1020] overflow-hidden" style={{ marginBottom: "16px" }}>
        <div className="border-b border-white/[0.08]" style={{ padding: "10px" }}>
          <h2 className="text-xs font-bold uppercase tracking-wide text-[#E6C36A]">Scoring Rules</h2>
        </div>
        <div style={{ padding: "10px" }}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#94A3B8]">Points per pick</label>
              <Input type="number" value={pointsPerPick} onChange={(e) => setPointsPerPick(Number(e.target.value))} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#94A3B8]">H2H win bonus</label>
              <Input type="number" value={h2hWinBonus} onChange={(e) => setH2hWinBonus(Number(e.target.value))} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#94A3B8]">Major multiplier</label>
              <Input type="number" value={majorMultiplier} onChange={(e) => setMajorMultiplier(Number(e.target.value))} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#94A3B8]">Streak bonus</label>
              <Input type="number" value={streakBonus} onChange={(e) => setStreakBonus(Number(e.target.value))} />
            </div>
          </div>
        </div>
      </div>

      {/* Game Configuration */}
      <div className="rounded-lg border border-white/[0.08] bg-gradient-to-br from-[#0b1326] to-[#0a1020] overflow-hidden" style={{ marginBottom: "16px" }}>
        <div className="border-b border-white/[0.08]" style={{ padding: "10px" }}>
          <h2 className="text-xs font-bold uppercase tracking-wide text-[#E6C36A]">Game Configuration</h2>
        </div>
        <div style={{ padding: "10px" }}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#94A3B8]">Pick lock time</label>
              <Input type="time" value={pickLockTime} onChange={(e) => setPickLockTime(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#94A3B8]">Max H2H wager</label>
              <Input type="number" value={maxH2HWager} onChange={(e) => setMaxH2HWager(Number(e.target.value))} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#94A3B8]">Fantasy tiers</label>
              <Input type="number" value={fantasyTiers} onChange={(e) => setFantasyTiers(Number(e.target.value))} />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Accounts */}
      <div className="rounded-lg border border-white/[0.08] bg-gradient-to-br from-[#0b1326] to-[#0a1020] overflow-hidden" style={{ marginBottom: "16px" }}>
        <div className="flex items-center justify-between border-b border-white/[0.08]" style={{ padding: "10px" }}>
          <h2 className="text-xs font-bold uppercase tracking-wide text-[#E6C36A]">Admin Accounts</h2>
          <Button onClick={() => setAddAdminModalOpen(true)}>
            + Add Admin
          </Button>
        </div>
        <div className="divide-y divide-white/[0.08]">
          {adminUsers.map((admin) => (
            <div key={admin.email} className="flex items-center justify-between" style={{ padding: "10px" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E6C36A]/15 text-sm font-bold text-[#E6C36A]">
                  {admin.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{admin.name}</p>
                  <p className="text-xs text-[#64748B]">{admin.email}</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold" style={roleBadgeStyle(admin.role)}>
                {admin.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-[#EF4444]/20 bg-gradient-to-br from-[#0b1326] to-[#0a1020] overflow-hidden" style={{ marginBottom: "16px" }}>
        <div className="border-b border-[#EF4444]/10" style={{ padding: "10px" }}>
          <h2 className="text-xs font-bold uppercase tracking-wide text-[#EF4444]">Danger Zone</h2>
        </div>
        <div style={{ padding: "10px" }} className="space-y-3">
          <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
            <div>
              <p className="text-sm font-medium text-white">Reset all points</p>
              <p className="text-xs text-[#64748B]">Reset all user points to zero. This action cannot be undone.</p>
            </div>
            <button className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 text-sm font-semibold text-[#EF4444] transition-colors hover:bg-[#EF4444]/20" style={{ padding: "10px 20px" }}>
              Reset Points
            </button>
          </div>
          <div className="border-t border-white/[0.08]" style={{ marginBottom: "12px" }} />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Purge inactive users</p>
              <p className="text-xs text-[#64748B]">Permanently remove all inactive user accounts and their data.</p>
            </div>
            <button className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 text-sm font-semibold text-[#EF4444] transition-colors hover:bg-[#EF4444]/20" style={{ padding: "10px 20px" }}>
              Purge Users
            </button>
          </div>
        </div>
      </div>

      {/* Save Footer */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={() => {}}>
          Reset to Defaults
        </Button>
        <Button onClick={() => {}}>
          Save All Settings
        </Button>
      </div>

      {/* Add Admin Modal */}
      <Modal
        open={addAdminModalOpen}
        onClose={() => setAddAdminModalOpen(false)}
        title="Add Admin"
        width="650px"
      >
        <div>
          <FormField label="Name">
            <Input placeholder="Enter admin name" />
          </FormField>

          <FormField label="Email">
            <Input type="email" placeholder="Enter admin email" />
          </FormField>

          <FormField label="Role">
            <Select defaultValue="Moderator">
              <option value="Super Admin">Super Admin</option>
              <option value="Moderator">Moderator</option>
            </Select>
          </FormField>

          <div className="flex justify-end gap-3 border-t border-white/[0.08]" style={{ marginTop: "40px", paddingTop: "20px", marginBottom: "20px" }}>
            <Button
              variant="ghost"
              onClick={() => setAddAdminModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setAddAdminModalOpen(false)}
            >
              Add Admin
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
