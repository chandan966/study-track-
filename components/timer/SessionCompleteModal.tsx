"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMinutes } from "@/lib/utils";
import confetti from "canvas-confetti";

interface SessionCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: {
    subjectId: string;
    subjectName: string;
    topicId?: string;
    topicName?: string;
    durationMinutes: number;
    durationSeconds: number;
    startTime: Date;
    endTime: Date;
    mode: "NORMAL" | "POMODORO";
  } | null;
  onSaved: () => void;
}

export function SessionCompleteModal({
  isOpen,
  onClose,
  sessionData,
  onSaved,
}: SessionCompleteModalProps) {
  const [whatStudied, setWhatStudied] = useState("");
  const [whatLearned, setWhatLearned] = useState("");
  const [whatUnderstood, setWhatUnderstood] = useState("");
  const [whatNotUnderstood, setWhatNotUnderstood] = useState("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [personalNotes, setPersonalNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!sessionData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: sessionData.subjectId,
          topicId: sessionData.topicId || null,
          mode: sessionData.mode,
          durationMinutes: Math.max(1, sessionData.durationMinutes),
          durationSeconds: sessionData.durationSeconds,
          startTime: sessionData.startTime.toISOString(),
          endTime: sessionData.endTime.toISOString(),
          whatStudied,
          whatLearned,
          whatUnderstood,
          whatNotUnderstood,
          difficulty,
          personalNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save study session");
      }

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#EC4899", "#F472B6", "#DB2777", "#FCE7F3"],
      });

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save session");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🎉 Study Session Completed!"
      description={`Great work! You focused for ${formatMinutes(sessionData.durationMinutes)} on ${sessionData.subjectName}. Record your key takeaways below.`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-3">
        {error && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 p-3 bg-brand-50/60 rounded-xl border border-pink-100 text-xs">
          <div>
            <span className="text-zinc-400 font-medium">Subject:</span>
            <p className="font-semibold text-zinc-900">{sessionData.subjectName}</p>
          </div>
          <div>
            <span className="text-zinc-400 font-medium">Topic:</span>
            <p className="font-semibold text-zinc-900">{sessionData.topicName || "General Topic"}</p>
          </div>
          <div>
            <span className="text-zinc-400 font-medium">Duration:</span>
            <p className="font-semibold text-brand-600">{formatMinutes(sessionData.durationMinutes)}</p>
          </div>
          <div>
            <span className="text-zinc-400 font-medium">Mode:</span>
            <p className="font-semibold text-zinc-900">{sessionData.mode}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            What did you study?
          </label>
          <Input
            value={whatStudied}
            onChange={(e) => setWhatStudied(e.target.value)}
            placeholder="e.g. Chapter 4: Array methods & callbacks"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            What did you learn?
          </label>
          <Input
            value={whatLearned}
            onChange={(e) => setWhatLearned(e.target.value)}
            placeholder="e.g. Learned how Array.reduce accumulates values into a single result"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              What did you understand?
            </label>
            <textarea
              className="w-full text-xs p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[70px]"
              value={whatUnderstood}
              onChange={(e) => setWhatUnderstood(e.target.value)}
              placeholder="Concepts that clicked well..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              What did you not understand?
            </label>
            <textarea
              className="w-full text-xs p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[70px]"
              value={whatNotUnderstood}
              onChange={(e) => setWhatNotUnderstood(e.target.value)}
              placeholder="Doubts to revise or ask teacher..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Session Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["EASY", "MEDIUM", "HARD"] as const).map((diff) => (
              <button
                type="button"
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                  difficulty === diff
                    ? "bg-brand-500 text-white border-brand-500 shadow-sm"
                    : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                {diff === "EASY" ? "😊 Easy" : diff === "MEDIUM" ? "🤔 Medium" : "🔥 Hard"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Personal Notes & Reminders
          </label>
          <textarea
            className="w-full text-xs p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[60px]"
            value={personalNotes}
            onChange={(e) => setPersonalNotes(e.target.value)}
            placeholder="Quick notes, reference page numbers, formula hints..."
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-zinc-400">
            📊 Download your Daily PDF Report Card from the dashboard anytime.
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isLoading} className="bg-brand-500 hover:bg-brand-600 text-white font-bold">
              Save Session to Database
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
