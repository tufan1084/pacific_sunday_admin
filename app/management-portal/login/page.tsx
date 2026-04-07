"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/FormField";
import Button from "@/app/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Redirect to dashboard on sign in
    router.push("/management-portal");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#020617] via-[#0a1020] to-[#020617]">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E6C36A] to-[#c9a84e] shadow-lg shadow-[#E6C36A]/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#020617" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Pacific Sunday</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="rounded-lg border border-white/[0.08] bg-gradient-to-br from-[#0b1326] to-[#0a1020] overflow-hidden">
          <div className="border-b border-white/[0.08]" style={{ padding: "20px" }}>
            <h2 className="text-base font-bold text-white">Sign in to your account</h2>
            <p className="text-xs text-[#64748B] mt-1">Enter your credentials to access the admin panel</p>
          </div>

          <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label className="mb-2 block text-xs font-bold text-[#94A3B8]">Email address</label>
              <Input
                type="email"
                placeholder="admin@pacificsunday.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label className="mb-2 block text-xs font-bold text-[#94A3B8]">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors"
                  style={{ marginTop: "-5px" }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between" style={{ marginBottom: "24px" }}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/[0.08] bg-[#1A2235] text-[#E6C36A] focus:ring-2 focus:ring-[#E6C36A]/20"
                />
                <span className="text-xs text-[#94A3B8]">Remember me</span>
              </label>
              <button className="text-xs font-semibold text-[#E6C36A] hover:text-[#E6C36A]/80 transition-colors">
                Forgot password?
              </button>
            </div>

            <div style={{ marginTop: "24px" }}>
              <Button onClick={handleLogin} style={{ width: "100%", padding: "12px 20px", fontSize: "14px", fontWeight: "600", textAlign: "center", display: "block" }}>
                Sign In
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#64748B]">
            © 2024 Pacific Sunday. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
