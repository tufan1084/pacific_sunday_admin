"use client";

import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import AdminShell from "@/app/components/AdminShell";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/management-portal/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full`}>
      <body className="h-full antialiased" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
