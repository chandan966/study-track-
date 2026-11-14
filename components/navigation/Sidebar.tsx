"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Timer,
  CalendarDays,
  BookOpen,
  ListTodo,
  FileText,
  BarChart3,
  Clock,
  RotateCcw,
  Trophy,
  Award,
  User,
  Settings,
  GraduationCap,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Timer", href: "/timer", icon: Timer },
  { name: "Report Card", href: "/report-card", icon: Award },
  { name: "Calendar", href: "/calendar", icon: CalendarDays },
  { name: "Subjects", href: "/subjects", icon: BookOpen },
  { name: "Tasks", href: "/tasks", icon: ListTodo },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Timeline", href: "/timeline", icon: Clock },
  { name: "Revisions", href: "/revisions", icon: RotateCcw },
  { name: "Achievements", href: "/achievements", icon: Trophy },
];

const secondaryNavItems = [
  { name: "Verify Certificate", href: "/verify", icon: ShieldCheck },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-pink-100 min-h-screen sticky top-0 z-30 select-none">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-pink-50">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-pink-200 transition-transform group-hover:scale-105">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-zinc-900">
                Study<span className="text-brand-500">Track</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-brand-100 text-brand-700">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">Smart Student Portal</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mb-2">
          Study Space
        </p>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-brand-50 text-brand-600 shadow-sm border border-brand-200/60 font-semibold"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-transform group-hover:scale-110",
                  isActive ? "text-brand-500" : "text-zinc-400 group-hover:text-zinc-600"
                )}
              />
              <span>{item.name}</span>
              {item.name === "Timer" && (
                <span className="ml-auto flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-5 pb-2">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mb-2">
            Account & System
          </p>
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-brand-50 text-brand-600 shadow-sm border border-brand-200/60 font-semibold"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-110",
                    isActive ? "text-brand-500" : "text-zinc-400 group-hover:text-zinc-600"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Upgrade / Daily Streak Encouragement Card */}
      <div className="p-4 border-t border-pink-50">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-brand-50 via-pink-50/50 to-white border border-brand-100 text-center">
          <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-brand-500 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-semibold text-zinc-900">Study Smarter Today</h4>
          <p className="text-[11px] text-zinc-500 mt-1">Keep your streak alive with a focused session.</p>
          <Link
            href="/timer"
            className="mt-3 block w-full py-1.5 px-3 bg-brand-500 hover:bg-brand-600 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
          >
            Start Timer
          </Link>
        </div>
      </div>
    </aside>
  );
}
