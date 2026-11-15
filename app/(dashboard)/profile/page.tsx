"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  School,
  BookOpen,
  Clock,
  Save,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Copy,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatStudentId } from "@/lib/studentId";

export default function ProfilePage() {
  // Profile Info States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  const [copiedId, setCopiedId] = useState(false);
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [dailyGoalHours, setDailyGoalHours] = useState(6);
  const [preferredStudyHours, setPreferredStudyHours] = useState("");

  // Password Update States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Status & Loaders
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real-time password requirement checks for new password
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasTwoNumbers = (newPassword.match(/\d/g) || []).length >= 2;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-=+~`[\]\\;/]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmNewPassword;
  const isNewPasswordValid =
    hasMinLength && hasUppercase && hasLowercase && hasTwoNumbers && hasSpecialChar;

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setStudentId(data.studentId || "");
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

  // Handle Profile Details Update (Name, Email, Phone, Academics, Goals)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          college: college.trim() || null,
          course: course.trim() || null,
          branch: branch.trim() || null,
          academicYear: academicYear.trim() || null,
          semester: semester.trim() || null,
          dailyGoalMinutes: Math.round(dailyGoalHours * 60),
          preferredStudyHours: preferredStudyHours.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Password Change
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (!isNewPasswordValid) {
      setPasswordError("New password must meet all 5 security criteria below.");
      return;
    }

    if (!passwordsMatch) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => setPasswordSuccess(false), 5000);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleCopyId = () => {
    if (studentId) {
      navigator.clipboard.writeText(studentId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Title & Description */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          <span>Student Profile &amp; Account Settings</span>
          <span className="text-[10px] bg-brand-100 text-brand-700 font-extrabold px-2 py-0.5 rounded-full border border-pink-200 uppercase tracking-wider">
            Verified
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Manage your student credentials, personal information, degree program, and account security.
        </p>
      </div>

      {/* Official 12-Digit Student ID & Triple-Login Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-50 via-white to-pink-50/60 border border-pink-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full border border-pink-200 tracking-wider">
              OFFICIAL 12-DIGIT STUDENT ID
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active
            </span>
          </div>
          <p className="text-2xl font-black font-mono text-pink-600 tracking-wider">
            {studentId ? formatStudentId(studentId) : "Generating ID..."}
          </p>
          <p className="text-xs text-zinc-500">
            Triple Login Active: You can sign in anytime using your <strong>12-Digit Student ID</strong>, <strong>Email Address</strong>, or <strong>Mobile Number</strong>!
          </p>
        </div>

        {studentId && (
          <button
            type="button"
            onClick={handleCopyId}
            className="px-4 py-2 rounded-xl border border-pink-200 text-xs font-bold text-pink-700 bg-white hover:bg-pink-50 flex items-center gap-2 transition-all shadow-2xs self-start md:self-center"
            title="Copy 12-Digit Student ID"
          >
            {copiedId ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-pink-600" />
                <span>Copy 12-Digit ID</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* CARD 1: PERSONAL & CONTACT INFORMATION */}
      <Card className="border-pink-100 bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-pink-50 flex flex-row items-center justify-between bg-pink-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center font-black text-sm shadow-xs">
              {name ? name.charAt(0).toUpperCase() : "S"}
            </div>
            <div>
              <CardTitle className="text-base font-bold text-zinc-900">
                Personal &amp; Academic Information
              </CardTitle>
              <p className="text-xs text-zinc-500">
                Update your full name, email address, mobile number, and degree targets.
              </p>
            </div>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Changes Saved!
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6">
          {error && (
            <div className="mb-5 p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Credentials Section */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-pink-600" /> Account &amp; Contact Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Full Name <span className="text-pink-600 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Chandan Ghanghav"
                      required
                      className="pl-9 text-xs sm:text-sm"
                    />
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Email Address <span className="text-pink-600 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      required
                      className="pl-9 text-xs sm:text-sm"
                    />
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Used for login and official updates.
                  </p>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Mobile Number <span className="text-pink-600 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="pl-9 text-xs sm:text-sm"
                    />
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Used for direct mobile sign-in.
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="pt-4 border-t border-pink-50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-pink-600" /> Academic Institution &amp; Degree
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    College / University
                  </label>
                  <div className="relative">
                    <Input
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. Stanford University, IIT Delhi"
                      className="pl-9 text-xs sm:text-sm"
                    />
                    <School className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Degree / Program
                  </label>
                  <div className="relative">
                    <Input
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science, BSC Physics"
                      className="pl-9 text-xs sm:text-sm"
                    />
                    <GraduationCap className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Branch / Major
                  </label>
                  <Input
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. Software Engineering"
                    className="text-xs sm:text-sm"
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
                    className="text-xs sm:text-sm"
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
                    className="text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Study Target Goals */}
            <div className="pt-4 border-t border-pink-50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-pink-600" /> Daily Targets &amp; Study Schedule
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="text-xs sm:text-sm"
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
                  <div className="relative">
                    <Input
                      value={preferredStudyHours}
                      onChange={(e) => setPreferredStudyHours(e.target.value)}
                      placeholder="e.g. Morning 6am-9am, Night 8pm-11pm"
                      className="pl-9 text-xs sm:text-sm"
                    />
                    <Clock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-pink-50">
              <Button
                type="submit"
                size="md"
                isLoading={isSaving}
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-sm shadow-pink-200"
              >
                <Save className="w-4 h-4 mr-1.5" /> Save Profile Details
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* CARD 2: DEDICATED PASSWORD & SECURITY MANAGEMENT */}
      <Card className="border-pink-100 bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-pink-50 flex flex-row items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold shadow-xs">
              <KeyRound className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-zinc-900">
                Security &amp; Password Management
              </CardTitle>
              <p className="text-xs text-zinc-500">
                Change your account password with enterprise 5-rule cryptographic security.
              </p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Password Changed Successfully!
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6">
          {passwordError && (
            <div className="mb-5 p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Current Password <span className="text-pink-600 font-bold">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  className="pl-9 pr-10 text-xs sm:text-sm"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                  tabIndex={-1}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                New Password <span className="text-pink-600 font-bold">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create a strong new password"
                  required
                  minLength={8}
                  className="pl-9 pr-10 text-xs sm:text-sm"
                />
                <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Confirm New Password <span className="text-pink-600 font-bold">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showConfirmNewPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-type new password"
                  required
                  minLength={8}
                  className="pl-9 pr-10 text-xs sm:text-sm"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                  tabIndex={-1}
                >
                  {showConfirmNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Strict Password Requirement Live Checklist */}
            <div className="p-3.5 rounded-xl bg-pink-50/50 border border-pink-100 text-xs space-y-1.5">
              <span className="font-bold text-zinc-700 block text-[11px] uppercase tracking-wider">
                Security Password Requirements:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600 font-semibold" : "text-zinc-400"}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Minimum 8 characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-600 font-semibold" : "text-zinc-400"}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>At least 1 uppercase letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasLowercase ? "text-emerald-600 font-semibold" : "text-zinc-400"}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>At least 1 lowercase letter (a-z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasTwoNumbers ? "text-emerald-600 font-semibold" : "text-zinc-400"}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>At least 2 numbers (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecialChar ? "text-emerald-600 font-semibold" : "text-zinc-400"}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>At least 1 special char (!@#$%)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${passwordsMatch ? "text-emerald-600 font-semibold" : "text-zinc-400"}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Passwords match</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="md"
                isLoading={isUpdatingPassword}
                disabled={!isNewPasswordValid || !passwordsMatch || !currentPassword}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 mr-1.5 text-pink-400" /> Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
