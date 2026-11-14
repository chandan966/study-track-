"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  subjects: { id: string; name: string }[];
  initialData?: {
    id: string;
    title: string;
    description?: string | null;
    subjectId?: string | null;
    dueDate?: string | null;
    priority: "HIGH" | "MEDIUM" | "LOW";
    status: "PENDING" | "COMPLETED";
  } | null;
}

export function TaskModal({
  isOpen,
  onClose,
  onSaved,
  subjects,
  initialData,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setSubjectId(initialData.subjectId || "");
      setDueDate(initialData.dueDate ? initialData.dueDate.split("T")[0] : "");
      setPriority(initialData.priority || "MEDIUM");
    } else {
      setTitle("");
      setDescription("");
      setSubjectId("");
      setDueDate("");
      setPriority("MEDIUM");
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = initialData ? `/api/tasks/${initialData.id}` : "/api/tasks";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          subjectId: subjectId || null,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          priority,
          status: initialData ? initialData.status : "PENDING",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save task");

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Task" : "Create New Study Task"}
      description="Plan revision, assignments, and problem-solving targets."
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-3">
        {error && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Solve 10 Trigonometry exercises"
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
            placeholder="Reference notes, chapters, formulas"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Subject (Optional)
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full h-10 px-3 text-xs font-medium bg-white rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">General Task</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full h-10 px-3 text-xs font-medium bg-white rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Due Date (Optional)
          </label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isLoading} className="bg-brand-500 hover:bg-brand-600 text-white">
            {initialData ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
