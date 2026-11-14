"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  subjects: { id: string; name: string; topics?: { id: string; name: string }[] }[];
  initialData?: {
    id: string;
    title: string;
    content: string;
    subjectId?: string | null;
    topicId?: string | null;
    tags?: string | null;
  } | null;
}

export function NoteModal({
  isOpen,
  onClose,
  onSaved,
  subjects,
  initialData,
}: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setSubjectId(initialData.subjectId || "");
      setTopicId(initialData.topicId || "");
      setTags(initialData.tags || "");
    } else {
      setTitle("");
      setContent("");
      setSubjectId(subjects[0]?.id || "");
      setTopicId("");
      setTags("");
    }
    setError(null);
  }, [initialData, subjects, isOpen]);

  const selectedSubject = subjects.find((s) => s.id === subjectId);
  const availableTopics = selectedSubject?.topics || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = initialData ? `/api/notes/${initialData.id}` : "/api/notes";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          subjectId: subjectId || null,
          topicId: topicId || null,
          tags: tags || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save note");

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save note");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Study Note" : "Create Study Note"}
      description="Write clean markdown notes, code snippets, formulas, and revision cheatsheets."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-3">
        {error && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Note Title <span className="text-rose-500">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Promises & Async/Await Deep Dive"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Subject
            </label>
            <select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
                setTopicId("");
              }}
              className="w-full h-10 px-3 text-xs font-medium bg-white rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">General Notes</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Topic (Optional)
            </label>
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              disabled={availableTopics.length === 0}
              className="w-full h-10 px-3 text-xs font-medium bg-white rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-zinc-50"
            >
              <option value="">All Topics / None</option>
              {availableTopics.map((top) => (
                <option key={top.id} value={top.id}>
                  {top.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Tags (comma separated)
          </label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. javascript, async, exam, cheatsheet"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Content (Supports Markdown) <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full p-3 text-xs font-mono rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="# Heading 1&#10;### Key Concepts&#10;- Point 1&#10;- Point 2&#10;&#10;```javascript&#10;console.log('code');&#10;```"
            required
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isLoading} className="bg-brand-500 hover:bg-brand-600 text-white">
            {initialData ? "Update Note" : "Save Note"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
