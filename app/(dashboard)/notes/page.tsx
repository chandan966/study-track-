"use client";

import React, { useState, useEffect } from "react";
import { FileText, PlusCircle, Search, Tag, Edit, Trash2, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NoteModal } from "@/components/notes/NoteModal";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate } from "@/lib/utils";

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);

  const fetchNotesAndSubjects = async () => {
    setIsLoading(true);
    try {
      let url = "/api/notes?";
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (selectedSubjectId) url += `subjectId=${selectedSubjectId}`;

      const [notesRes, subRes] = await Promise.all([
        fetch(url),
        fetch("/api/subjects"),
      ]);

      if (notesRes.ok) setNotes(await notesRes.json());
      if (subRes.ok) setSubjects(await subRes.json());
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotesAndSubjects();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedSubjectId]);

  const handleDeleteNote = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete note "${title}"?`)) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (res.ok) fetchNotesAndSubjects();
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  return (
    <div className="space-y-6">
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        onSaved={fetchNotesAndSubjects}
        subjects={subjects}
        initialData={editingNote}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Study Notes &amp; Cheatsheets
          </h1>
          <p className="text-xs text-zinc-500">
            Write markdown notes, code summaries, and key formula references.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditingNote(null);
            setIsModalOpen(true);
          }}
          className="bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-pink-200"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Create Note
        </Button>
      </div>

      {/* Search & Subject Filter Bar */}
      <Card className="border-pink-100 bg-white shadow-xs">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search note titles, content, tags..."
              className="pl-9 h-10 text-xs"
            />
          </div>

          {subjects.length > 0 && (
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="h-10 px-3 text-xs font-medium bg-white rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
        </CardContent>
      </Card>

      {/* Notes Grid */}
      {notes.length === 0 && !isLoading ? (
        <EmptyState
          icon={FileText}
          title="No notes found"
          description={
            search
              ? "No study notes matched your search query. Try another keyword."
              : "Capture summaries, code blocks, and formula sheets for your subjects."
          }
          actionLabel="Create First Note"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {notes.map((note) => (
            <Card
              key={note.id}
              className="border-pink-100 bg-white shadow-xs hover:border-pink-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <CardHeader className="p-5 pb-3 border-b border-pink-50">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {note.subject && (
                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block mb-1">
                        {note.subject.name}
                      </span>
                    )}
                    <CardTitle className="text-sm font-bold text-zinc-900 line-clamp-1">
                      {note.title}
                    </CardTitle>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingNote(note);
                        setIsModalOpen(true);
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id, note.title)}
                      className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-3 space-y-3 flex-1">
                <p className="text-xs text-zinc-600 line-clamp-4 font-mono bg-zinc-50/50 p-2.5 rounded-lg border border-zinc-100 whitespace-pre-wrap">
                  {note.content}
                </p>

                {note.tags && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {note.tags.split(",").map((t: string) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-50 text-[10px] font-medium text-brand-700"
                      >
                        <Tag className="w-2.5 h-2.5" /> {t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>

              <div className="p-5 pt-0 text-[11px] text-zinc-400 border-t border-pink-50 flex items-center justify-between">
                <span>Updated {formatDate(note.updatedAt)}</span>
                {note.topic && (
                  <span className="text-zinc-500 font-medium truncate max-w-[120px]">
                    {note.topic.name}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
