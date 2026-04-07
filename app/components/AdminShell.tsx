"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main-panel" style={{ paddingTop: 50 }}>
        <main className="min-h-screen overflow-y-auto" style={{ padding: "20px 30px" }}>{children}</main>
      </div>
    </>
  );
}
