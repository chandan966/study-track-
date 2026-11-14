"use client";

import React, { useState, useEffect } from "react";
import { Download, Volume2, Bell, Shield, Sparkles, Moon, Sun, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [theme, setTheme] = useState("light");
  const [isExporting, setIsExporting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.soundEnabled !== undefined) setSoundEnabled(data.soundEnabled);
          if (data.notificationsEnabled !== undefined) setNotificationsEnabled(data.notificationsEnabled);
          if (data.theme) setTheme(data.theme);
        }
      })
      .catch((err) => console.error("Failed to load settings", err));
  }, []);

  const handleSavePreferences = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soundEnabled,
          notificationsEnabled,
          theme,
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error("Failed to save preferences", err);
    }
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    window.location.href = "/api/export";
    setTimeout(() => setIsExporting(false), 1500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Application Settings &amp; Data Export
        </h1>
        <p className="text-xs text-zinc-500">
          Customize notifications, sound cues, visual themes, and export your study archives.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Preferences updated successfully!
        </div>
      )}

      {/* Preferences Card */}
      <Card className="border-pink-100 bg-white shadow-sm">
        <CardHeader className="py-4 px-6 border-b border-pink-50">
          <CardTitle className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            Study Environment Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Session Chime Sound</h4>
                <p className="text-xs text-zinc-500">
                  Play harmonic tone when Pomodoro intervals or timer sessions complete.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-5 h-5 accent-pink-500 cursor-pointer"
            />
          </div>

          {/* Browser Notifications Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-pink-50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Study Notifications</h4>
                <p className="text-xs text-zinc-500">
                  Notify on daily goal completion and upcoming spaced topic revisions.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-5 h-5 accent-pink-500 cursor-pointer"
            />
          </div>

          {/* Theme Palette */}
          <div className="pt-4 border-t border-pink-50">
            <h4 className="text-sm font-bold text-zinc-900 mb-1">Color Theme</h4>
            <p className="text-xs text-zinc-500 mb-3">
              StudyTrack&apos;s signature palette is Pink + White for optimal focus and clean contrast.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "light", label: "Pink + White (Signature)", icon: Sun },
                { id: "dark", label: "Dark + Pink Accent", icon: Moon },
                { id: "system", label: "System Sync", icon: Sparkles },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`p-3 text-xs font-semibold rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      theme === t.id
                        ? "bg-brand-50 border-brand-500 text-brand-700 shadow-xs ring-1 ring-brand-300"
                        : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-brand-500" />
                    <span className="text-center">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleSavePreferences}
              size="sm"
              className="bg-brand-500 hover:bg-brand-600 text-white shadow-sm"
            >
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Export Card */}
      <Card className="border-pink-100 bg-white shadow-sm">
        <CardHeader className="py-4 px-6 border-b border-pink-50">
          <CardTitle className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-brand-500" />
            Export Study History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-xs text-zinc-600 leading-relaxed">
            Download your entire study session log, notes, subject breakdowns, topic understanding levels, and timestamps as a standardized CSV file.
          </p>

          <Button
            onClick={handleExportCSV}
            isLoading={isExporting}
            variant="outline"
            size="md"
            className="border-pink-200 text-brand-600 hover:bg-brand-50 font-bold"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Study History (.CSV)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
