import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Timer,
  CalendarDays,
  BarChart3,
  BookOpen,
  ListTodo,
  FileText,
  Flame,
  ArrowRight,
  CheckCircle,
  Sparkles,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-study-bg text-zinc-900 flex flex-col selection:bg-pink-200">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-pink-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-black text-xl tracking-tight text-zinc-900">
              Study<span className="text-brand-500">Track</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">
              How It Works
            </a>
            <a href="#preview" className="hover:text-brand-600 transition-colors">
              Previews
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-zinc-700 hover:text-brand-600 font-semibold">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-sm shadow-pink-200">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            Next-Gen Study Productivity For Ambitious Students
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 leading-[1.1]">
            Study smarter. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 via-pink-600 to-brand-400">
              Track your progress.
            </span> <br />
            Reach your goals.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 font-medium leading-relaxed">
            Stop guessing how much you study. Track your hours, master complex syllabus topics, maintain daily study streaks, and boost your retention with structured spaced repetition.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button size="lg" className="bg-brand-500 hover:bg-brand-600 text-white text-base px-8 py-3 rounded-xl shadow-lg shadow-pink-200 font-bold group">
                Start Studying
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="border-pink-200 bg-white hover:bg-brand-50 text-zinc-800 text-base px-8 py-3 rounded-xl font-bold">
                Explore Features
              </Button>
            </a>
          </div>

          {/* Quick value props list */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-zinc-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-brand-500" /> Free Forever & Open Source
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-brand-500" /> Real Database Persistence
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-brand-500" /> Accurate Pomodoro & Stopwatch
            </span>
          </div>
        </div>
      </section>

      {/* 2. FEATURES GRID */}
      <section id="features" className="py-20 bg-white border-y border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold tracking-wider uppercase text-brand-600">
              Powerful Academic Toolkit
            </h2>
            <h3 className="text-3xl font-black text-zinc-900 tracking-tight">
              Everything you need to master your syllabus
            </h3>
            <p className="text-sm text-zinc-500">
              From continuous stopwatch tracking to subject analytics, StudyTrack turns daily study habits into academic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Timer,
                title: "Accurate Study Timer",
                desc: "High-precision stopwatch and Pomodoro with customizable 25/5 and 50/10 focus intervals.",
              },
              {
                icon: BookOpen,
                title: "Subject & Topic Architecture",
                desc: "Organize subjects, track syllabus topics, set target hours, and monitor completion percentages.",
              },
              {
                icon: FileText,
                title: "Study Notes System",
                desc: "Write formatted Markdown notes, code snippets, formula summaries, and attach them directly to topics.",
              },
              {
                icon: ListTodo,
                title: "Student Task Manager",
                desc: "Prioritize exam revisions, homework tasks, and homework assignments with due dates.",
              },
              {
                icon: CalendarDays,
                title: "Heatmap Study Calendar",
                desc: "Visual monthly calendar heatmap revealing daily study intensity, completed sessions, and tasks.",
              },
              {
                icon: RotateCcw,
                title: "Spaced Repetition Revisions",
                desc: "Schedule automated revision intervals (1d, 3d, 7d, 15d, 30d) so you never forget what you studied.",
              },
              {
                icon: BarChart3,
                title: "In-Depth Analytics",
                desc: "Comprehensive charts for daily hours, weekly consistency, subject distributions, and daily goal completion.",
              },
              {
                icon: Flame,
                title: "Study Streaks",
                desc: "Build consistency. Real streak calculations track consecutive active study days meeting your daily target.",
              },
              {
                icon: Trophy,
                title: "Academic Achievements",
                desc: "Unlock badges as you log study hours, complete subjects, and maintain daily discipline.",
              },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-2xl border border-zinc-100 bg-white hover:border-pink-200 hover:shadow-md transition-all space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-500">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-zinc-900">{feat.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-study-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold tracking-wider uppercase text-brand-600">
              Simple 4-Step Flow
            </h2>
            <h3 className="text-3xl font-black text-zinc-900 tracking-tight">
              How StudyTrack transforms your study routine
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Create Subjects",
                desc: "Add your curriculum: JavaScript, Mathematics, DBMS, or Operating Systems with target hours.",
              },
              {
                step: "02",
                title: "Start Focus Timer",
                desc: "Launch stopwatch or Pomodoro mode and immerse yourself into a distraction-free study session.",
              },
              {
                step: "03",
                title: "Log Takeaways",
                desc: "Record what you studied, what you learned, what you understood, and topics needing revision.",
              },
              {
                step: "04",
                title: "Watch Progress Grow",
                desc: "Review your calendar heatmap, maintain streaks, and observe understanding climb to 100%.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-white border border-pink-100 shadow-sm space-y-3"
              >
                <span className="text-2xl font-black text-brand-500 font-mono">{item.step}</span>
                <h4 className="text-base font-bold text-zinc-900">{item.title}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4, 5, 6. PREVIEWS SECTION */}
      <section id="preview" className="py-20 bg-white border-y border-pink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold tracking-wider uppercase text-brand-600">
              Live Product Previews
            </h2>
            <h3 className="text-3xl font-black text-zinc-900 tracking-tight">
              Built with precision for peak productivity
            </h3>
          </div>

          {/* Timer Mockup Preview */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-brand-50/50 to-white border border-pink-200 shadow-xl max-w-3xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-pink-200 text-xs font-bold text-brand-600">
              <Timer className="w-3.5 h-3.5 text-brand-500" /> Focus Timer & Pomodoro
            </span>
            <div className="font-mono text-6xl sm:text-7xl font-black text-zinc-900">
              01:25:00
            </div>
            <p className="text-xs text-zinc-500 font-medium">JavaScript • Promises & Async/Await</p>
            <div className="flex justify-center gap-3 pt-2">
              <span className="px-5 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-200">
                Pause Session
              </span>
              <span className="px-5 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-xs font-bold">
                Finish & Save
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-20 bg-gradient-to-tr from-brand-600 via-pink-600 to-brand-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to take control of your study journey?
          </h2>
          <p className="text-sm sm:text-base text-pink-100 max-w-xl mx-auto">
            Join thousands of ambitious students tracking their study hours, keeping streaks alive, and acing their exams.
          </p>
          <div className="pt-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-brand-600 hover:bg-pink-50 font-extrabold text-base px-8 py-3 rounded-xl shadow-xl">
                Start Studying Today — Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-white border-t border-pink-100 py-10 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-500 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-zinc-900">StudyTrack</span>
            <span className="text-zinc-400">© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-brand-600">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-brand-600">
              Create Account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
