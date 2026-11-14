"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  GraduationCap,
  ArrowRight,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CaptchaWidget } from "@/components/auth/CaptchaWidget";
import { formatStudentId } from "@/lib/studentId";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success state showing generated 12-digit Student ID
  const [registeredData, setRegisteredData] = useState<{
    name: string;
    email: string;
    studentId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCaptchaError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Verify captcha
    if (!isCaptchaVerified) {
      setCaptchaError("Please complete the security verification challenge before registering.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Display the generated 12-digit Student ID card
      setRegisteredData({
        name: data.user.name,
        email: data.user.email,
        studentId: data.user.studentId,
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyId = () => {
    if (registeredData?.studentId) {
      navigator.clipboard.writeText(registeredData.studentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleProceedToDashboard = async () => {
    setIsLoggingIn(true);
    try {
      // Auto login with the registered credentials
      const loginRes = await signIn("credentials", {
        email: registeredData?.studentId || email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      router.push("/login");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-study-bg flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
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
          {registeredData ? "Account Successfully Created! 🎉" : "Create Your Student Account"}
        </h2>
        <p className="text-xs text-zinc-500">
          {registeredData
            ? "Your official 12-digit student ID has been generated."
            : "Start tracking study sessions, maintaining streaks, and acing goals."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-pink-100 bg-white shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-5">
            {/* SUCCESS MODAL / CARD SHOWING THE 12-DIGIT ID */}
            {registeredData ? (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50 via-white to-pink-50/40 border-2 border-pink-200 text-center space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full border border-pink-200 uppercase tracking-wider">
                      OFFICIAL CREDENTIAL ISSUED
                    </span>
                    <h3 className="text-sm font-extrabold text-zinc-900 mt-2">
                      Welcome, {registeredData.name}!
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Here is your official 12-digit StudyTrack student identification number:
                    </p>
                  </div>

                  {/* 12-Digit Student ID Display Card */}
                  <div className="p-4 rounded-xl bg-white border border-pink-200 shadow-sm space-y-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                      12-Digit Student ID / Roll No.
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-black font-mono tracking-wider text-pink-600 select-all">
                        {formatStudentId(registeredData.studentId)}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="p-2 rounded-lg border border-pink-200 hover:bg-pink-50 text-pink-600 transition-colors shadow-2xs"
                        title="Copy 12-digit Student ID"
                        aria-label="Copy 12-digit Student ID"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {copied && (
                      <p className="text-[11px] text-emerald-600 font-bold">
                        ✓ Copied to clipboard!
                      </p>
                    )}
                  </div>

                  {/* Dual Login Notice */}
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-left space-y-1">
                    <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Flexible Dual Login Supported</span>
                    </p>
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      You can log in anytime using <strong>either</strong> your Email Address (
                      <span className="underline">{registeredData.email}</span>) <strong>or</strong> your 12-Digit Student ID (
                      <span className="font-mono font-bold">{registeredData.studentId}</span>) along with your password!
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleProceedToDashboard}
                  disabled={isLoggingIn}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 shadow-md shadow-pink-200"
                >
                  {isLoggingIn ? "Entering Dashboard..." : "Proceed to Student Dashboard"}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            ) : (
              /* REGISTRATION FORM */
              <>
                {error && (
                  <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Chandan Ghanghav"
                        required
                        className="pl-9"
                      />
                      <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.com"
                        required
                        className="pl-9"
                      />
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        minLength={6}
                        className="pl-9"
                      />
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        required
                        minLength={6}
                        className="pl-9"
                      />
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* Anti-Bot Captcha Security Challenge */}
                  <CaptchaWidget
                    onVerifyChange={setIsCaptchaVerified}
                    error={captchaError}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isLoading}
                    className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-md shadow-pink-200 mt-2"
                  >
                    Create Account &amp; Get 12-Digit ID
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </form>

                <div className="pt-2 text-center text-xs text-zinc-500 border-t border-pink-50">
                  Already have an account?{" "}
                  <Link href="/login" className="font-bold text-brand-600 hover:text-brand-700">
                    Sign in here
                  </Link>
                </div>
              </>
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
