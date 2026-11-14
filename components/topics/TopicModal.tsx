"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  subjects: { id: string; name: string }[];
  defaultSubjectId?: string;
  initialData?: {
    id: string;
    name: string;
    description?: string;
    status: string;
    understanding: number;
    difficulty: string;
    revisionDate?: string | null;
    subjectId: string;
  } | null;
}

export function TopicModal({
  isOpen,
  onClose,
  onSaved,
  subjects,
  defaultSubjectId,
  initialData,
}: TopicModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState(defaultSubjectId || subjects[0]?.id || "");
  const [status, setStatus] = useState("NOT_STARTED");
  const [understanding, setUnderstanding] = useState(0);
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [revisionDate, setRevisionDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setSubjectId(initialData.subjectId);
      setStatus(initialData.status);
      setUnderstanding(initialData.understanding);
      setDifficulty(initialData.difficulty);
      setRevisionDate(
        initialData.revisionDate ? initialData.revisionDate.split("T")[0] : ""
      );
    } else {
      setName("");
      setDescription("");
      setSubjectId(defaultSubjectId || subjects[0]?.id || "");
      setStatus("NOT_STARTED");
      setUnderstanding(0);
      setDifficulty("MEDIUM");
      setRevisionDate("");
    }
    setError(null);
  }, [initialData, defaultSubjectId, subjects, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = initialData ? `/api/topics/${initialData.id}` : "/api/topics";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          subjectId,
          status,
          understanding: Number(understanding),
          difficulty,
          revisionDate: revisionDate ? new Date(revisionDate).toISOString() : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save topic");

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save topic");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Topic" : "Add Study Topic"}
      description="Track understanding, completion status, and spaced revision for this syllabus unit."
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-3">
        {error && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Subject <span className="text-rose-500">*</span>
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            disabled={Boolean(initialData)}
            className="w-full h-10 px-3 text-xs font-medium bg-white rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-zinc-50"
            required
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Topic Name <span className="text-rose-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Promises, Trigonometry Identities, Normalization"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Description
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key concepts or textbook reference"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-10 px-3 text-xs font-medium bg-white rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full h-10 px-3 text-xs font-medium bg-white rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-zinc-700">
              Understanding Level: <span className="text-brand-600 font-bold">{understanding}%</span>
            </label>
            <span className="text-[11px] text-zinc-400">
              {understanding < 50 ? "Weak (Needs Revision)" : understanding >= 80 ? "Mastered" : "Good"}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={understanding}
            onChange={(e) => setUnderstanding(Number(e.target.value))}
            className="w-full accent-pink-500 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Next Revision Date (Optional)
          </label>
          <Input
            type="date"
            value={revisionDate}
            onChange={(e) => setRevisionDate(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isLoading} className="bg-brand-500 hover:bg-brand-600 text-white">
            {initialData ? "Update Topic" : "Add Topic"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
