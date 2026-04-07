"use client";

import Image from "next/image";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header
      className="fixed top-0 left-0 z-[60] flex w-full items-center border-b border-white/[0.06] bg-[#020617] px-5"
      style={{ height: 50 }}
    >
      <button onClick={onMenuClick} className="mr-3 rounded-md p-1 text-[#94A3B8] hover:bg-white/5 lg:hidden">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      <Image src="/logo.png" alt="Pacific Sunday" width={140} height={36} className="h-9 w-auto" style={{ marginLeft: 20 }} priority />
    </header>
  );
}
