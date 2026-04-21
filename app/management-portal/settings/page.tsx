"use client";

import { useEffect, useState } from "react";
import { Input } from "@/app/components/ui/FormField";
import Button from "@/app/components/ui/Button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  enabled: boolean;
}

const emptySmtp: SmtpConfig = {
  host: "",
  port: 587,
  secure: false,
  username: "",
  password: "",
  fromEmail: "",
  fromName: "",
  enabled: true,
};

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

  // SMTP
  const [smtp, setSmtp] = useState<SmtpConfig>(emptySmtp);
  const [smtpLoading, setSmtpLoading] = useState(true);
  const [smtpSaving, setSmtpSaving] = useState(false);
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpMessage, setSmtpMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [smtpConfigured, setSmtpConfigured] = useState(false);

  useEffect(() => {
    const loadSmtp = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/smtp-config`);
        const json = await res.json();
        if (json.success && json.data) {
          setSmtp({
            host: json.data.host || "",
            port: json.data.port || 587,
            secure: !!json.data.secure,
            username: json.data.username || "",
            password: json.data.password || "",
            fromEmail: json.data.fromEmail || "",
            fromName: json.data.fromName || "",
            enabled: json.data.enabled !== false,
          });
          setSmtpConfigured(true);
        }
      } catch (err) {
        console.error("Failed to load SMTP config", err);
      } finally {
        setSmtpLoading(false);
      }
    };
    loadSmtp();
  }, []);

  const handleSaveSmtp = async () => {
    setSmtpMessage(null);
    setSmtpSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/smtp-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(smtp),
      });
      const json = await res.json();
      if (json.success) {
        setSmtpMessage({ type: "success", text: json.message || "SMTP settings saved." });
        setSmtpConfigured(true);
        // Swap the returned masked password back into state so the form doesn't try to resend the real one
        if (json.data?.password) {
          setSmtp((s) => ({ ...s, password: json.data.password }));
        }
      } else {
        setSmtpMessage({ type: "error", text: json.message || "Failed to save SMTP settings." });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Request failed";
      setSmtpMessage({ type: "error", text: msg });
    } finally {
      setSmtpSaving(false);
    }
  };

  const handleTestSmtp = async () => {
    setSmtpMessage(null);
    setSmtpTesting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/smtp-config/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...smtp, testEmail: testEmail || undefined }),
      });
      const json = await res.json();
      if (json.success) {
        setSmtpMessage({ type: "success", text: json.message || "SMTP test succeeded." });
      } else {
        setSmtpMessage({ type: "error", text: json.message || "SMTP test failed." });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Request failed";
      setSmtpMessage({ type: "error", text: msg });
    } finally {
      setSmtpTesting(false);
    }
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

      {/* SMTP Configuration */}
      <div className="rounded-lg border border-white/[0.08] bg-gradient-to-br from-[#0b1326] to-[#0a1020] overflow-hidden" style={{ marginBottom: "16px" }}>
        <div className="flex items-center justify-between border-b border-white/[0.08]" style={{ padding: "10px" }}>
          <h2 className="text-xs font-bold uppercase tracking-wide text-[#E6C36A]">SMTP Configuration</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#94A3B8]">Enabled</span>
            <button
              onClick={() => setSmtp((s) => ({ ...s, enabled: !s.enabled }))}
              className={`relative h-5 w-10 rounded-full transition-colors ${
                smtp.enabled ? "bg-[#E6C36A]" : "bg-[#1A2235]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${
                  smtp.enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
        <div style={{ padding: "10px" }} className="space-y-3">
          {smtpLoading ? (
            <p className="text-xs text-[#94A3B8]">Loading SMTP settings...</p>
          ) : (
            <>
              <p className="text-xs text-[#64748B]">
                Configure the outgoing mail server used for password resets and user notifications.
                {smtpConfigured ? " Leave password blank to keep the existing one." : ""}
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#94A3B8]">SMTP host</label>
                  <Input
                    placeholder="smtp.gmail.com"
                    value={smtp.host}
                    onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#94A3B8]">Port</label>
                  <Input
                    type="number"
                    value={smtp.port}
                    onChange={(e) => setSmtp({ ...smtp, port: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#94A3B8]">Username</label>
                  <Input
                    placeholder="you@example.com"
                    value={smtp.username}
                    onChange={(e) => setSmtp({ ...smtp, username: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#94A3B8]">Password</label>
                  <Input
                    type="password"
                    placeholder={smtpConfigured ? "Leave blank to keep current" : "Password or app password"}
                    value={smtp.password}
                    onChange={(e) => setSmtp({ ...smtp, password: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#94A3B8]">From email</label>
                  <Input
                    type="email"
                    placeholder="noreply@pacificsunday.com"
                    value={smtp.fromEmail}
                    onChange={(e) => setSmtp({ ...smtp, fromEmail: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#94A3B8]">From name</label>
                  <Input
                    placeholder="Pacific Sunday"
                    value={smtp.fromName}
                    onChange={(e) => setSmtp({ ...smtp, fromName: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-sm font-medium text-white">Use TLS/SSL (secure)</p>
                  <p className="text-xs text-[#64748B]">Enable for port 465. Disable for 587 (STARTTLS).</p>
                </div>
                <button
                  onClick={() => setSmtp({ ...smtp, secure: !smtp.secure })}
                  className={`relative h-5 w-10 rounded-full transition-colors ${
                    smtp.secure ? "bg-[#E6C36A]" : "bg-[#1A2235]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${
                      smtp.secure ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="border-t border-white/[0.08]" style={{ marginTop: "12px", paddingTop: "12px" }}>
                <label className="mb-1 block text-xs font-bold text-[#94A3B8]">Send test email to</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="recipient@example.com (optional)"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  <Button variant="secondary" onClick={handleTestSmtp} disabled={smtpTesting}>
                    {smtpTesting ? "Testing..." : "Test Connection"}
                  </Button>
                  <Button onClick={handleSaveSmtp} disabled={smtpSaving}>
                    {smtpSaving ? "Saving..." : "Save SMTP"}
                  </Button>
                </div>
              </div>

              {smtpMessage && (
                <div
                  className="rounded-md"
                  style={{
                    padding: "10px",
                    marginTop: "8px",
                    backgroundColor: smtpMessage.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${smtpMessage.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                  }}
                >
                  <p
                    className="text-xs"
                    style={{ color: smtpMessage.type === "success" ? "#22C55E" : "#EF4444" }}
                  >
                    {smtpMessage.text}
                  </p>
                </div>
              )}
            </>
          )}
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
    </div>
  );
}
