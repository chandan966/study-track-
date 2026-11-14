"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Square, RotateCcw, Volume2, VolumeX, Sparkles, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionCompleteModal } from "./SessionCompleteModal";
import { formatSecondsToTimer } from "@/lib/utils";

interface Subject {
  id: string;
  name: string;
  color: string;
  topics?: { id: string; name: string }[];
}

interface StudyTimerProps {
  subjects: Subject[];
  onSessionSaved?: () => void;
}

export function StudyTimer({ subjects, onSessionSaved }: StudyTimerProps) {
  // Timer Mode: Normal or Pomodoro
  const [mode, setMode] = useState<"NORMAL" | "POMODORO">("NORMAL");
  const [pomoPreset, setPomoPreset] = useState<"25_5" | "50_10" | "custom">("25_5");
  const [pomoPhase, setPomoPhase] = useState<"STUDY" | "BREAK">("STUDY");
  const [pomoCustomStudy, setPomoCustomStudy] = useState(30); // in minutes
  const [pomoCustomBreak, setPomoCustomBreak] = useState(5);
  const [pomoSessionCount, setPomoSessionCount] = useState(1);

  // Subject and Topic Selection
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || "");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");

  // Timer State
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Timestamp references to guarantee timestamp-level accuracy
  const startTimeRef = useRef<number | null>(null);
  const accumulatedRef = useRef<number>(0);
  const sessionStartDateTimeRef = useRef<Date | null>(null);

  // Completion Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completedSessionData, setCompletedSessionData] = useState<any>(null);

  // Audio tone generation for session finish using Web Audio API
  const playChime = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn("Audio Context not allowed without interaction", e);
    }
  }, [soundEnabled]);

  // Target duration for Pomodoro phase
  const getPomoTargetSeconds = () => {
    if (mode === "NORMAL") return 0;
    if (pomoPhase === "STUDY") {
      if (pomoPreset === "25_5") return 25 * 60;
      if (pomoPreset === "50_10") return 50 * 60;
      return pomoCustomStudy * 60;
    } else {
      if (pomoPreset === "25_5") return 5 * 60;
      if (pomoPreset === "50_10") return 10 * 60;
      return pomoCustomBreak * 60;
    }
  };

  // Timer Tick loop using timestamps
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
      if (!sessionStartDateTimeRef.current) {
        sessionStartDateTimeRef.current = new Date();
      }

      interval = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - (startTimeRef.current || now)) / 1000);
        const currentElapsed = accumulatedRef.current + delta;
        setElapsedSeconds(currentElapsed);

        // Check if Pomodoro target reached
        if (mode === "POMODORO") {
          const target = getPomoTargetSeconds();
          if (currentElapsed >= target) {
            playChime();
            if (pomoPhase === "STUDY") {
              // Switch to break
              setPomoPhase("BREAK");
              accumulatedRef.current = 0;
              startTimeRef.current = Date.now();
              setElapsedSeconds(0);
            } else {
              // Break finished, ready for next session
              setPomoPhase("STUDY");
              setPomoSessionCount((c) => c + 1);
              accumulatedRef.current = 0;
              startTimeRef.current = null;
              setIsRunning(false);
              setElapsedSeconds(0);
            }
          }
        }
      }, 500);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode, pomoPhase, pomoPreset, pomoCustomStudy, pomoCustomBreak, playChime]);

  const handleStart = () => {
    if (!selectedSubjectId) {
      alert("Please select a subject before starting your study timer.");
      return;
    }
    startTimeRef.current = Date.now();
    if (!sessionStartDateTimeRef.current) {
      sessionStartDateTimeRef.current = new Date();
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    if (startTimeRef.current) {
      accumulatedRef.current += Math.floor((Date.now() - startTimeRef.current) / 1000);
      startTimeRef.current = null;
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    startTimeRef.current = null;
    accumulatedRef.current = 0;
    sessionStartDateTimeRef.current = null;
    setElapsedSeconds(0);
  };

  const handleFinish = () => {
    handlePause();
    const totalDurationSeconds = elapsedSeconds;
    const totalDurationMinutes = Math.max(1, Math.round(totalDurationSeconds / 60));

    const currentSub = subjects.find((s) => s.id === selectedSubjectId);
    const currentTopic = currentSub?.topics?.find((t) => t.id === selectedTopicId);

    setCompletedSessionData({
      subjectId: selectedSubjectId,
      subjectName: currentSub?.name || "Subject",
      topicId: selectedTopicId || undefined,
      topicName: currentTopic?.name || undefined,
      durationMinutes: totalDurationMinutes,
      durationSeconds: totalDurationSeconds,
      startTime: sessionStartDateTimeRef.current || new Date(),
      endTime: new Date(),
      mode,
    });

    playChime();
    setIsModalOpen(true);
  };

  const handleSessionSaved = () => {
    handleReset();
    if (onSessionSaved) onSessionSaved();
  };

  // Selected subject's available topics
  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);
  const availableTopics = currentSubject?.topics || [];

  // Display timer calculations
  const displaySeconds =
    mode === "POMODORO"
      ? Math.max(0, getPomoTargetSeconds() - elapsedSeconds)
      : elapsedSeconds;

  const pomoTarget = getPomoTargetSeconds();
  const progressPercent =
    mode === "POMODORO" && pomoTarget > 0
      ? Math.min(100, Math.round((elapsedSeconds / pomoTarget) * 100))
      : 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Session Complete Modal */}
      <SessionCompleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sessionData={completedSessionData}
        onSaved={handleSessionSaved}
      />

      {/* Mode & Subject Configuration Bar */}
      <Card className="border-pink-100 shadow-sm bg-white">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-pink-50">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-brand-50/70 p-1 rounded-xl border border-pink-100">
              <button
                type="button"
                onClick={() => {
                  if (isRunning) handlePause();
                  setMode("NORMAL");
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === "NORMAL"
                    ? "bg-white text-brand-600 shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Normal Stopwatch
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isRunning) handlePause();
                  setMode("POMODORO");
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === "POMODORO"
                    ? "bg-white text-brand-600 shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Pomodoro Focus
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:bg-brand-50 border border-zinc-200"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-brand-500" />
                  <span>Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Sound Muted</span>
                </>
              )}
            </button>
          </div>

          {/* Pomodoro Presets */}
          {mode === "POMODORO" && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-brand-50/50 rounded-xl border border-pink-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-700">Intervals:</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setPomoPreset("25_5");
                      handleReset();
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
                      pomoPreset === "25_5"
                        ? "bg-brand-500 text-white border-brand-500 shadow-xs"
                        : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    25 / 5 min
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPomoPreset("50_10");
                      handleReset();
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
                      pomoPreset === "50_10"
                        ? "bg-brand-500 text-white border-brand-500 shadow-xs"
                        : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    50 / 10 min
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-white text-brand-600 border border-pink-200">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  {pomoPhase === "STUDY" ? "Focus Interval" : "Rest & Recharge"} (Cycle #{pomoSessionCount})
                </span>
              </div>
            </div>
          )}

          {/* Subject & Topic Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Target Subject <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value);
                  setSelectedTopicId("");
                }}
                disabled={isRunning}
                className="w-full h-10 px-3 text-xs font-medium bg-white rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-zinc-50"
              >
                {subjects.length === 0 && <option value="">No subjects created yet</option>}
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Topic (Optional)
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                disabled={isRunning || availableTopics.length === 0}
                className="w-full h-10 px-3 text-xs font-medium bg-white rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-zinc-50"
              >
                <option value="">General Subject Study</option>
                {availableTopics.map((top) => (
                  <option key={top.id} value={top.id}>
                    {top.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Timer Display Card */}
      <Card className="border-pink-100 shadow-md bg-gradient-to-b from-white to-pink-50/30 overflow-hidden">
        <CardContent className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
          {/* Active Subject Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6 shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-brand-500" />
            <span>{currentSubject ? currentSubject.name : "Select Subject"}</span>
            {selectedTopicId && (
              <>
                <span className="text-zinc-300">•</span>
                <span className="text-zinc-600">
                  {availableTopics.find((t) => t.id === selectedTopicId)?.name}
                </span>
              </>
            )}
          </div>

          {/* Big Digital Timer Display */}
          <div className="relative my-4">
            <div className="font-mono text-6xl sm:text-8xl font-black tracking-tight text-zinc-900 select-none">
              {formatSecondsToTimer(displaySeconds)}
            </div>
            {mode === "POMODORO" && (
              <p className="mt-2 text-xs font-semibold tracking-wider uppercase text-brand-600">
                {pomoPhase === "STUDY" ? "Focus Time Remaining" : "Break Time Remaining"}
              </p>
            )}
          </div>

          {/* Controls: Start, Pause, Resume, Reset, Finish */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {!isRunning ? (
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-brand-500 hover:bg-brand-600 text-white px-8 text-base shadow-md shadow-pink-200"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                {elapsedSeconds > 0 ? "Resume Study" : "Start Studying"}
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                size="lg"
                variant="outline"
                className="border-brand-200 text-brand-600 hover:bg-brand-50 px-8 text-base"
              >
                <Pause className="w-5 h-5 mr-2 fill-current" />
                Pause
              </Button>
            )}

            {elapsedSeconds > 0 && (
              <>
                <Button
                  onClick={handleFinish}
                  size="lg"
                  className="bg-brand-600 hover:bg-brand-700 text-white px-6 text-sm shadow-sm"
                >
                  <Square className="w-4 h-4 mr-2 fill-current" />
                  Finish & Save
                </Button>

                <Button
                  onClick={handleReset}
                  size="lg"
                  variant="ghost"
                  className="text-zinc-400 hover:text-zinc-700 text-sm"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  Reset
                </Button>
              </>
            )}
          </div>

          {/* Tips footer */}
          <p className="mt-8 text-xs text-zinc-400 max-w-sm">
            💡 The timer continuously tracks real timestamps. When finished, you can record what you learned, what you understood, and any personal takeaways.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
