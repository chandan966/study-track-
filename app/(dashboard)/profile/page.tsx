"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, GraduationCap, School, BookOpen, Clock, Save, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [dailyGoalHours, setDailyGoalHours] = useState(6);
  const [preferredStudyHours, setPreferredStudyHours] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setName(data.name || "");
        setEmail(data.email || "");
        setCollege(data.college || "");
        setCourse(data.course || "");
        setBranch(data.branch || "");
        setAcademicYear(data.academicYear || "");
        setSemester(data.semester || "");
        setDailyGoalHours(Math.round((data.dailyGoalMinutes || 360) / 60));
        setPreferredStudyHours(data.preferredStudyHours || "");
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          college,
          course,
          branch,
          academicYear,
          semester,
          dailyGoalMinutes: Math.round(dailyGoalHours * 60),
          preferredStudyHours,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Student Profile &amp; Academic Details
        </h1>
        <p className="text-xs text-zinc-500">
          Personalize your curriculum, degree program, and daily study targets.
        </p>
      </div>

      <Card className="border-pink-100 bg-white shadow-sm">
        <CardHeader className="py-5 px-6 border-b border-pink-50 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-100 border border-brand-300 text-brand-700 flex items-center justify-center font-black text-base shadow-xs">
              {name ? name.charAt(0).toUpperCase() : "S"}
            </div>
            <div>
              <CardTitle className="text-base font-bold text-zinc-900">{name || "Student"}</CardTitle>
              <p className="text-xs text-zinc-400">{email}</p>
            </div>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Profile Updated!
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-5">
            {error && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Email Address (Read-only)
                </label>
                <Input value={email} disabled className="bg-zinc-50 text-zinc-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  College / University
                </label>
                <Input
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Stanford University, IIT Delhi"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Degree / Program
                </label>
                <Input
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science, BSC Physics"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Branch / Major
                </label>
                <Input
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="e.g. Software Engineering"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Academic Year
                </label>
                <Input
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="e.g. 3rd Year"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Semester
                </label>
                <Input
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g. 5th Semester"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-pink-50">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Daily Study Target Goal (Hours / Day)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={16}
                    value={dailyGoalHours}
                    onChange={(e) => setDailyGoalHours(Number(e.target.value))}
                    required
                  />
                  <span className="text-xs font-semibold text-zinc-500 whitespace-nowrap">
                    hours / day
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Preferred Study Hours
                </label>
                <Input
                  value={preferredStudyHours}
                  onChange={(e) => setPreferredStudyHours(e.target.value)}
                  placeholder="e.g. Morning 6am-9am, Night 8pm-11pm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-pink-50">
              <Button
                type="submit"
                size="md"
                isLoading={isSaving}
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-sm shadow-pink-200"
              >
                <Save className="w-4 h-4 mr-1.5" /> Save Profile Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
