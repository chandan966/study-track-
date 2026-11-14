import React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Navbar } from "@/components/navigation/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-study-bg flex text-study-darkText selection:bg-pink-200">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
        {/* Dashboard Footer */}
        <footer className="no-print border-t border-pink-100 py-4 px-6 text-xs text-zinc-500 max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-3">
          <p>© 2026 StudyTrack. All rights reserved.</p>
          <p>
            <a
              href="https://www.instagram.com/trigger_toofan"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="webdevchandna Instagram (opens in new tab)"
              className="font-semibold text-pink-600 hover:text-pink-700 hover:underline transition-colors"
            >
              webdevchandna
            </a>
          </p>
        </footer>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
