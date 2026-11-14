"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Landmark,
  Cpu,
  GraduationCap,
  Code2,
  Building2,
  Scale,
} from "lucide-react";
import { EXAM_PRESETS, ExamTemplate } from "@/lib/curriculumTemplates";

interface ExamPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCurriculumLoaded?: () => void;
  initialExamId?: string;
}

export function ExamPresetModal({
  isOpen,
  onClose,
  onCurriculumLoaded,
  initialExamId = "SSC",
}: ExamPresetModalProps) {
  const [selectedExamId, setSelectedExamId] = useState<string>(initialExamId);
  const [clearExisting, setClearExisting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPreset: ExamTemplate =
    EXAM_PRESETS.find((p) => p.id === selectedExamId) || EXAM_PRESETS[0];

  const totalTopics = currentPreset.subjects.reduce(
    (sum, s) => sum + s.topics.length,
    0
  );
  const totalHours = currentPreset.subjects.reduce(
    (sum, s) => sum + s.targetHours,
    0
  );

  const getExamIcon = (id: string) => {
    switch (id) {
      case "SSC":
        return <Landmark className="w-5 h-5" />;
      case "GATE":
        return <Cpu className="w-5 h-5" />;
      case "COLLEGE":
        return <GraduationCap className="w-5 h-5" />;
      case "WEBDEV":
        return <Code2 className="w-5 h-5" />;
      case "BANKING":
        return <Building2 className="w-5 h-5" />;
      case "UPSC":
        return <Scale className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const handleApplyPreset = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/curriculum/preset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: selectedExamId,
          clearExisting,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load exam curriculum");
      }

      setSuccessMessage(
        `Successfully loaded ${data.subjectsAdded} subjects and ${data.topicsAdded} official syllabus topics for ${data.preset}!`
      );

      setTimeout(() => {
        if (onCurriculumLoaded) onCurriculumLoaded();
        onClose();
      }, 1400);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong loading curriculum");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-pink-100 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-gradient-to-r from-pink-50/80 via-white to-pink-50/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-pink-500/25">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900">
                  Target Exam &amp; Curriculum Library
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-100 text-pink-700 border border-pink-200">
                  Auto-Populate
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Choose your exam to automatically load all official subjects, detailed topics, and target study hours into your account.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Exam Selection Pills/Grid */}
          <div>
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2.5 block">
              1. Select What You Are Studying For
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {EXAM_PRESETS.map((preset) => {
                const isSelected = preset.id === selectedExamId;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedExamId(preset.id);
                      setSuccessMessage(null);
                      setErrorMessage(null);
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between h-24 ${
                      isSelected
                        ? "border-pink-500 bg-pink-50/60 shadow-xs shadow-pink-500/10 ring-2 ring-pink-500/30"
                        : "border-zinc-200 hover:border-pink-300 hover:bg-zinc-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? "bg-pink-600 text-white"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {getExamIcon(preset.id)}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-pink-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 leading-tight">
                        {preset.id}
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate">
                        {preset.badge}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Preset Highlight Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 via-white to-pink-50/30 border border-pink-200/80 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${currentPreset.badgeColor}`}>
                    {currentPreset.badge}
                  </span>
                  <h3 className="text-base font-bold text-zinc-900">
                    {currentPreset.title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-600">
                  {currentPreset.subtitle}
                </p>
              </div>

              {/* Stat Pills */}
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-white border border-pink-200 text-center shadow-2xs">
                  <span className="text-[10px] text-zinc-400 block font-medium">Subjects</span>
                  <span className="text-xs font-bold text-pink-600">{currentPreset.subjects.length}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-white border border-pink-200 text-center shadow-2xs">
                  <span className="text-[10px] text-zinc-400 block font-medium">Topics</span>
                  <span className="text-xs font-bold text-pink-600">{totalTopics}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-white border border-pink-200 text-center shadow-2xs">
                  <span className="text-[10px] text-zinc-400 block font-medium">Target</span>
                  <span className="text-xs font-bold text-pink-600">{totalHours} hrs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Syllabus Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-pink-500" />
                2. Preview Included Subjects &amp; Topics
              </label>
              <span className="text-[11px] text-zinc-400">
                Clicking apply will create these in your database
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {currentPreset.subjects.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-xs hover:border-pink-300 transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-md shadow-2xs shrink-0"
                        style={{ backgroundColor: sub.color }}
                      />
                      <h4 className="text-xs font-bold text-zinc-900">
                        {sub.name}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {sub.targetHours}h goal
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-500 line-clamp-1">
                    {sub.description}
                  </p>

                  <div className="space-y-1.5 pt-1 border-t border-zinc-100">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Included Topics ({sub.topics.length}):
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {sub.topics.map((top, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-zinc-50 text-zinc-700 border border-zinc-200/70"
                        >
                          {top.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Merge vs Fresh Replacement Option */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
            <input
              type="checkbox"
              id="clearExisting"
              checked={clearExisting}
              onChange={(e) => setClearExisting(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-pink-600 rounded-md border-zinc-300 focus:ring-pink-500"
            />
            <label htmlFor="clearExisting" className="text-xs text-zinc-600 cursor-pointer">
              <span className="font-semibold text-zinc-900 block">
                Clear existing subjects and topics before loading
              </span>
              Check this if you want a clean slate matching only this exam syllabus. Otherwise, these subjects and topics will be added alongside your existing ones.
            </label>
          </div>

          {/* Feedback Banners */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-700 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Ready to study: {currentPreset.subjects.length} subjects &bull; {totalTopics} topics</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyPreset}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-pink-500/25 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading Syllabus...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Load {currentPreset.id} Syllabus Automatically</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
