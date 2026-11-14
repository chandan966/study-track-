"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Timer,
  CalendarDays,
  BookOpen,
  Menu,
  X,
  ListTodo,
  FileText,
  BarChart3,
  Clock,
  RotateCcw,
  Trophy,
  User,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainTabs = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Timer", href: "/timer", icon: Timer },
  { name: "Calendar", href: "/calendar", icon: CalendarDays },
  { name: "Subjects", href: "/subjects", icon: BookOpen },
];

const moreItems = [
  { name: "Tasks", href: "/tasks", icon: ListTodo },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Timeline", href: "/timeline", icon: Clock },
  { name: "Revisions", href: "/revisions", icon: RotateCcw },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-up Menu Drawer */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-16 z-50 bg-white border-t border-pink-100 rounded-t-3xl shadow-2xl transition-transform duration-300 ease-in-out lg:hidden p-5 max-h-[70vh] overflow-y-auto",
          isOpen ? "translate-y-0" : "translate-y-full pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between pb-3 border-b border-pink-50 mb-4">
          <h3 className="font-bold text-base text-zinc-900">Explore StudyTrack</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {moreItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 border-brand-200 text-brand-600 font-semibold"
                    : "bg-white border-zinc-100 text-zinc-700 hover:bg-zinc-50"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-brand-500" : "text-zinc-400")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Persistent Bottom Tab Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 bg-white border-t border-pink-100 lg:hidden px-3 py-2 flex items-center justify-around shadow-lg">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors",
                isActive ? "text-brand-600 font-semibold" : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-lg mb-0.5",
                  isActive ? "bg-brand-50 text-brand-500" : "text-zinc-400"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px]">{tab.name}</span>
            </Link>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors",
            isOpen ? "text-brand-600 font-semibold" : "text-zinc-500 hover:text-zinc-900"
          )}
        >
          <div
            className={cn(
              "p-1.5 rounded-lg mb-0.5",
              isOpen ? "bg-brand-50 text-brand-500" : "text-zinc-400"
            )}
          >
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[11px]">More</span>
        </button>
      </nav>
    </>
  );
}
