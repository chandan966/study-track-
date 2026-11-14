"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  topics: { id: string; name: string; subject: { name: string } }[];
  defaultTopicId?: string;
}

export function RevisionModal({
  isOpen,
  onClose,
  onSaved,
  topics,
  defaultTopicId,
}: RevisionModalProps) {
  const [topicId, setTopicId] = useState(defaultTopicId || topics[0]?.id || "");
  const [intervalOption, setIntervalOption] = useState<number>(1);
  const [customDate, setCustomDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/revisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId,
          intervalDays: intervalOption,
          scheduledFor: customDate ? new Date(customDate).toISOString() : undefined,
          notes: notes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to schedule revision");

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to schedule revision");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📅 Schedule Spaced Repetition Revision"
      description="Spaced repetition prevents the forgetting curve and solidifies your mastery."
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-3">
        {error && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Topic to Revise <span className="text-rose-500">*</span>
          </label>
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="w-full h-10 px-3 text-xs font-medium bg-white rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.subject.name} - {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-2">
            Revision Interval
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { days: 1, label: "Tomorrow (1d)" },
              { days: 3, label: "In 3 Days" },
              { days: 7, label: "In 1 Week (7d)" },
              { days: 15, label: "In 15 Days" },
              { days: 30, label: "In 1 Month (30d)" },
              { days: 0, label: "Custom Date" },
            ].map((opt) => (
              <button
                type="button"
                key={opt.days}
                onClick={() => setIntervalOption(opt.days)}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  intervalOption === opt.days
                    ? "bg-brand-500 text-white border-brand-500 shadow-xs"
                    : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {intervalOption === 0 && (
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Select Custom Date
            </label>
            <Input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Revision Notes / Key Checklist
          </label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Test edge cases, recall formulas without looking"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isLoading} className="bg-brand-500 hover:bg-brand-600 text-white">
            Schedule Revision
          </Button>
        </div>
      </form>
    </Modal>
  );
}
