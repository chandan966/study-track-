"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Bell,
  Timer,
  User,
  LogOut,
  Settings,
  GraduationCap,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  title?: string;
  subtitle?: string;
}

export function Navbar({ title, subtitle }: NavbarProps) {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-pink-100 px-4 sm:px-8 h-16 flex items-center justify-between">
      {/* Page Title or Brand on Mobile */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg text-zinc-900">
            Study<span className="text-brand-500">Track</span>
          </span>
        </div>

        {title && (
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-zinc-900">{title}</h1>
            {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Launch Study Timer */}
        <Link href="/timer">
          <Button
            size="sm"
            className="hidden sm:inline-flex bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-pink-200"
          >
            <Timer className="w-4 h-4 mr-1.5 animate-pulse" />
            Study Now
          </Button>
        </Link>

        {/* User Profile / Menu */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1 rounded-full sm:rounded-xl hover:bg-brand-50 border border-transparent hover:border-pink-200 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-300 text-brand-700 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {session?.user?.name ? session.user.name.charAt(0) : "U"}
            </div>
            <div className="hidden md:block text-left text-xs">
              <p className="font-semibold text-zinc-800 line-clamp-1">{session?.user?.name || "Student"}</p>
              <p className="text-[10px] text-zinc-400">StudyTrack Scholar</p>
            </div>
            <ChevronDown className="hidden md:block w-3.5 h-3.5 text-zinc-400" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-pink-100 shadow-xl py-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-pink-50">
                  <p className="text-xs font-semibold text-zinc-900">{session?.user?.name || "Student"}</p>
                  <p className="text-[11px] text-zinc-500 truncate">{session?.user?.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                  >
                    <User className="w-4 h-4 text-zinc-400" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-zinc-400" />
                    <span>Preferences & Export</span>
                  </Link>
                </div>

                <div className="border-t border-pink-50 pt-1">
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
