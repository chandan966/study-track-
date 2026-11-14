"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: {
    id: string;
    name: string;
    description?: string;
    color: string;
    targetHours: number;
  } | null;
}

const PRESET_COLORS = [
  "#EC4899", // Primary Pink
  "#DB2777", // Dark Pink
  "#F472B6", // Medium Pink
  "#BE185D", // Deep Magenta
  "#9D174D", // Berry Pink
  "#F9A8D4", // Soft Pink
];

export function SubjectModal({
  isOpen,
  onClose,
  onSaved,
  initialData,
}: SubjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#EC4899");
  const [targetHours, setTargetHours] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setColor(initialData.color || "#EC4899");
      setTargetHours(initialData.targetHours || 50);
    } else {
      setName("");
      setDescription("");
      setColor("#EC4899");
      setTargetHours(50);
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = initialData ? `/api/subjects/${initialData.id}` : "/api/subjects";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          color,
          targetHours: Number(targetHours),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save subject");

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save subject");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Subject" : "Create New Subject"}
      description="Organize your study goals by subjects like JavaScript, DBMS, or Mathematics."
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-3">
        {error && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Subject Name <span className="text-rose-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. JavaScript, Mathematics, Operating Systems"
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
            placeholder="Brief syllabus overview or notes"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Target Study Hours
          </label>
          <Input
            type="number"
            min={1}
            max={500}
            value={targetHours}
            onChange={(e) => setTargetHours(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Subject Color Theme
          </label>
          <div className="flex items-center gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c ? "scale-125 ring-2 ring-zinc-400 ring-offset-2" : "hover:scale-110"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isLoading} className="bg-brand-500 hover:bg-brand-600 text-white">
            {initialData ? "Update Subject" : "Create Subject"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
