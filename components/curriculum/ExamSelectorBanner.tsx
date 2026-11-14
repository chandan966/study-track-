"use client";

import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Layers,
  ChevronRight,
  Landmark,
  Cpu,
  GraduationCap,
  Code2,
  Building2,
  Scale,
} from "lucide-react";
import { ExamPresetModal } from "./ExamPresetModal";

interface ExamSelectorBannerProps {
  onCurriculumLoaded?: () => void;
}

export function ExamSelectorBanner({ onCurriculumLoaded }: ExamSelectorBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string>("SSC");

  const openPreset = (examId: string) => {
    setSelectedExamId(examId);
    setIsModalOpen(true);
  };

  const quickPills = [
    {
      id: "SSC",
      label: "SSC Exams",
      subtitle: "CGL, CHSL, MTS",
      icon: <Landmark className="w-3.5 h-3.5" />,
      color: "hover:border-pink-500 hover:bg-pink-50/70 text-pink-700",
      badge: "Govt Jobs",
    },
    {
      id: "GATE",
      label: "GATE CSE",
      subtitle: "CS & IT Syllabus",
      icon: <Cpu className="w-3.5 h-3.5" />,
      color: "hover:border-indigo-500 hover:bg-indigo-50/70 text-indigo-700",
      badge: "Engineering",
    },
    {
      id: "COLLEGE",
      label: "College B.Tech",
      subtitle: "Core Subjects",
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      color: "hover:border-purple-500 hover:bg-purple-50/70 text-purple-700",
      badge: "University",
    },
    {
      id: "WEBDEV",
      label: "Full-Stack Dev",
      subtitle: "React, Node, DB",
      icon: <Code2 className="w-3.5 h-3.5" />,
      color: "hover:border-emerald-500 hover:bg-emerald-50/70 text-emerald-700",
      badge: "Software",
    },
    {
      id: "BANKING",
      label: "Banking Exams",
      subtitle: "IBPS, SBI, RBI",
      icon: <Building2 className="w-3.5 h-3.5" />,
      color: "hover:border-amber-500 hover:bg-amber-50/70 text-amber-700",
      badge: "Finance",
    },
    {
      id: "UPSC",
      label: "UPSC Civil",
      subtitle: "Prelims & Mains GS",
      icon: <Scale className="w-3.5 h-3.5" />,
      color: "hover:border-rose-500 hover:bg-rose-50/70 text-rose-700",
      badge: "Civil Services",
    },
  ];

  return (
    <>
      <ExamPresetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialExamId={selectedExamId}
        onCurriculumLoaded={onCurriculumLoaded}
      />

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-pink-600 to-pink-500 p-0.5 shadow-lg shadow-pink-500/10">
        <div className="rounded-[23px] bg-white p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left Header */}
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-100 text-pink-700 border border-pink-200">
                  <Sparkles className="w-3 h-3 text-pink-600" />
                  Target Curriculum Selector
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  Instant Auto-Syllabus
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 tracking-tight">
                What are you studying for?
              </h2>

              <p className="text-xs text-zinc-500 leading-relaxed">
                Click your target exam to automatically populate all standard subjects, detailed topics with mastery tracking, and target hours directly into your StudyTrack account.
              </p>
            </div>

            {/* Right Action Button */}
            <button
              onClick={() => openPreset("SSC")}
              className="shrink-0 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-pink-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 group"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse All Syllabi</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Quick Exam Pills Grid */}
          <div className="mt-4 pt-4 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {quickPills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => openPreset(pill.id)}
                className={`group p-3 rounded-2xl border border-zinc-200/80 bg-white transition-all text-left flex flex-col justify-between h-20 shadow-2xs hover:shadow-sm ${pill.color}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 group-hover:text-pink-600 transition-colors">
                    {pill.icon}
                    {pill.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-pink-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] text-zinc-400 truncate">
                    {pill.subtitle}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600 group-hover:bg-pink-100 group-hover:text-pink-700 transition-colors">
                    {pill.badge}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
