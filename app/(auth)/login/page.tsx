"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { GraduationCap, ArrowRight, Lock, UserCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CaptchaWidget } from "@/components/auth/CaptchaWidget";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCaptchaError(null);

    // Enforce captcha verification
    if (!isCaptchaVerified) {
      setCaptchaError("Please complete the security verification challenge before logging in.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: identifier.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during login");
    } finally {
      setIsLoading(false);
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
          Welcome back, Scholar!
        </h2>
        <p className="text-xs text-zinc-500">
          Enter your Email Address or 12-Digit Student ID to access your dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-pink-100 bg-white shadow-xl rounded-2xl">
          <CardContent className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email or 12-Digit Student ID */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Email Address or 12-Digit Student ID
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="student@example.com or 202611140001"
                    required
                    className="pl-9 text-xs sm:text-sm"
                  />
                  <UserCheck className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  You can sign in with your registered email or official 12-digit student ID.
                </p>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-zinc-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
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
                Sign In to StudyTrack
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-zinc-500 border-t border-pink-50">
              Don&apos;t have an account yet?{" "}
              <Link href="/register" className="font-bold text-brand-600 hover:text-brand-700">
                Register now
              </Link>
            </div>
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
