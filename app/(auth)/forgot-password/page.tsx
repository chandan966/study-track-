"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  ArrowLeft,
  Lock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CaptchaWidget } from "@/components/auth/CaptchaWidget";
import { formatStudentId } from "@/lib/studentId";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step state: 1 = Scan ID, 2 = Enter New Password, 3 = Success
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 inputs
  const [identifier, setIdentifier] = useState("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Verified student info
  const [verifiedStudent, setVerifiedStudent] = useState<{
    name: string;
    studentId: string;
    maskedEmail: string;
  } | null>(null);

  // Step 2 inputs
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Real-time password requirement checks
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasTwoNumbers = (newPassword.match(/\d/g) || []).length >= 2;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-=+~`[\]\\;/]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isPasswordValid =
    hasMinLength && hasUppercase && hasLowercase && hasTwoNumbers && hasSpecialChar;

  // Handle Step 1: Scan and verify 12-digit student ID
  const handleVerifyId = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);
    setCaptchaError(null);

    const cleanId = identifier.replace(/\s+/g, "").trim();
    if (!cleanId) {
      setVerifyError("Please enter your 12-digit Student ID or registered Email.");
      return;
    }

    if (!isCaptchaVerified) {
      setCaptchaError("Please complete the security verification challenge before continuing.");
      return;
    }

    setIsVerifying(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_id",
          identifier: cleanId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No student account found with this ID.");
      }

      setVerifiedStudent({
        name: data.name,
        studentId: data.studentId,
        maskedEmail: data.maskedEmail,
      });

      // Move to Step 2
      setStep(2);
    } catch (err: any) {
      setVerifyError(err.message || "Failed to verify Student ID.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Step 2: Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (!isPasswordValid) {
      setResetError("Please ensure your password meets all 5 security requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("New passwords do not match. Please re-enter.");
      return;
    }

    setIsResetting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset_password",
          identifier: verifiedStudent?.studentId || identifier,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      // Move to Step 3: Success
      setStep(3);
    } catch (err: any) {
      setResetError(err.message || "An unexpected error occurred while resetting password.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-study-bg flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-pink-200 transition-transform group-hover:scale-105">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="font-black text-2xl tracking-tight text-zinc-900">
            Study<span className="text-brand-500">Track</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
          {step === 1 && "Recover Student Account"}
          {step === 2 && "Create New Secure Password"}
          {step === 3 && "Password Successfully Reset! 🎉"}
        </h2>
        <p className="text-xs text-zinc-500">
          {step === 1 && "Enter your 12-digit Student ID to verify and reset your credentials."}
          {step === 2 && `Setting up new password for ${verifiedStudent?.name || "Student"}.`}
          {step === 3 && "Your password has been updated in the database. You can now log in."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-pink-100 bg-white shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-5">
            {/* ======================================================== */}
            {/* STEP 1: SCAN 12-DIGIT STUDENT ID                         */}
            {/* ======================================================== */}
            {step === 1 && (
              <form onSubmit={handleVerifyId} className="space-y-4">
                {verifyError && (
                  <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{verifyError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Enter Your 12-Digit Student ID (or Email)
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. 202611140001 or 2026 8492 0153"
                      required
                      className="pl-9 font-mono text-xs sm:text-sm"
                    />
                    <UserCheck className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Enter the 12-digit number provided upon registration or printed on your report card.
                  </p>
                </div>

                {/* Anti-Bot Captcha Security Challenge */}
                <CaptchaWidget
                  onVerifyChange={setIsCaptchaVerified}
                  error={captchaError}
                />

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isVerifying}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-md shadow-pink-200 mt-2"
                >
                  <KeyRound className="w-4 h-4 mr-1.5" />
                  Scan &amp; Verify Student ID
                </Button>

                <div className="pt-2 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-brand-600"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* STEP 2: SET NEW PASSWORD WITH SECURITY CHECKLIST         */}
            {/* ======================================================== */}
            {step === 2 && verifiedStudent && (
              <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in duration-300">
                {resetError && (
                  <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{resetError}</span>
                  </div>
                )}

                {/* Verified Student Identification Badge */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-pink-50 via-white to-pink-50 border border-pink-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-pink-700 bg-pink-100 px-2 py-0.5 rounded border border-pink-200">
                      ✓ LEDGER VERIFIED
                    </span>
                    <span className="text-[10px] font-mono font-bold text-pink-600">
                      ID: {formatStudentId(verifiedStudent.studentId)}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 mt-1">
                    Candidate: {verifiedStudent.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Linked Email: <span className="font-mono text-zinc-700">{verifiedStudent.maskedEmail}</span>
                  </p>
                </div>

                {/* New Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new strong password"
                      required
                      className="pl-9 pr-10"
                    />
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Real-time Checklist */}
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5 text-[11px]">
                  <p className="font-bold text-zinc-700 text-[10px] uppercase tracking-wider">
                    Password Requirements:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <div className={`flex items-center gap-1.5 font-medium ${hasMinLength ? "text-emerald-600 font-bold" : "text-zinc-400"}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLength ? "text-emerald-500" : "text-zinc-300"}`} />
                      <span>At least 8 characters</span>
                    </div>

                    <div className={`flex items-center gap-1.5 font-medium ${hasUppercase ? "text-emerald-600 font-bold" : "text-zinc-400"}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${hasUppercase ? "text-emerald-500" : "text-zinc-300"}`} />
                      <span>1+ Uppercase (A-Z)</span>
                    </div>

                    <div className={`flex items-center gap-1.5 font-medium ${hasLowercase ? "text-emerald-600 font-bold" : "text-zinc-400"}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${hasLowercase ? "text-emerald-500" : "text-zinc-300"}`} />
                      <span>Lowercase letters</span>
                    </div>

                    <div className={`flex items-center gap-1.5 font-medium ${hasTwoNumbers ? "text-emerald-600 font-bold" : "text-zinc-400"}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${hasTwoNumbers ? "text-emerald-500" : "text-zinc-300"}`} />
                      <span>At least 2 numbers (0-9)</span>
                    </div>

                    <div className={`flex items-center gap-1.5 font-medium sm:col-span-2 ${hasSpecialChar ? "text-emerald-600 font-bold" : "text-zinc-400"}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${hasSpecialChar ? "text-emerald-500" : "text-zinc-300"}`} />
                      <span>1+ Special symbol (!@#$%^&*)</span>
                    </div>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      className="pl-9 pr-10"
                    />
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="text-[10px] text-rose-600 font-semibold mt-1">
                      Passwords do not match.
                    </p>
                  )}
                  {passwordsMatch && (
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                      ✓ Passwords match perfectly.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isResetting}
                  disabled={!isPasswordValid || !passwordsMatch}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-md shadow-pink-200 mt-2 disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4 mr-1.5" />
                  Save New Password &amp; Update Account
                </Button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-brand-600"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Use different Student ID
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* STEP 3: SUCCESS CONFIRMATION                             */}
            {/* ======================================================== */}
            {step === 3 && (
              <div className="text-center space-y-4 py-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                    PASSWORD UPDATED
                  </span>
                  <h3 className="text-base font-extrabold text-zinc-900 mt-2">
                    Security Credentials Reset!
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto leading-relaxed">
                    Your account has been secured with your new password. You can now log in immediately using either your <strong>12-digit Student ID</strong> or your registered email.
                  </p>
                </div>

                {verifiedStudent && (
                  <div className="p-3 rounded-xl bg-pink-50/60 border border-pink-100 text-xs font-mono text-pink-700">
                    Student ID: <strong>{formatStudentId(verifiedStudent.studentId)}</strong>
                  </div>
                )}

                <Button
                  onClick={() => router.push("/login")}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 shadow-md shadow-pink-200"
                >
                  Proceed to Sign In
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legal & Policy Navigation */}
        <div className="mt-8 text-center text-[11px] text-zinc-400 space-x-3">
          <Link href="/" className="hover:text-pink-600 transition-colors">Home</Link>
          <span>•</span>
          <Link href="/about" className="hover:text-pink-600 transition-colors">About</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-pink-600 transition-colors">Privacy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-pink-600 transition-colors">Terms</Link>
          <span>•</span>
          <Link href="/disclaimer" className="hover:text-pink-600 transition-colors">Disclaimer</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-pink-600 transition-colors">Contact</Link>
        </div>
      </div>
    </div>
  );
}
