"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, PlusCircle, MoreVertical, Clock, CheckCircle2, ArrowRight, Edit, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SubjectModal } from "@/components/subjects/SubjectModal";
import { EmptyState } from "@/components/common/EmptyState";
import { formatMinutes } from "@/lib/utils";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/subjects");
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
      }
    } catch (err) {
      console.error("Failed to load subjects", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleDeleteSubject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? All associated topics, notes, and sessions will be deleted.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/subjects/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchSubjects();
      }
    } catch (err) {
      console.error("Failed to delete subject", err);
    }
  };

  return (
    <div className="space-y-6">
      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSubject(null);
        }}
        onSaved={fetchSubjects}
        initialData={editingSubject}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Subjects &amp; Curriculum
          </h1>
          <p className="text-xs text-zinc-500">
            Manage your courses, allocate study hours, and monitor syllabus coverage.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditingSubject(null);
            setIsModalOpen(true);
          }}
          className="bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-pink-200"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Create Subject
        </Button>
      </div>

      {/* Subjects Grid */}
      {subjects.length === 0 && !isLoading ? (
        <EmptyState
          icon={BookOpen}
          title="Create your first subject"
          description="You haven't added any subjects yet. Add subjects like JavaScript, DBMS, or Mathematics to structure your study journey."
          actionLabel="Create First Subject"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((sub) => {
            const targetMinutes = sub.targetHours * 60;
            const progressPercent = Math.min(
              100,
              Math.round((sub.totalStudyMinutes / targetMinutes) * 100)
            );

            return (
              <Card
                key={sub.id}
                className="border-pink-100 bg-white shadow-sm hover:border-pink-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <CardHeader className="p-5 pb-3 border-b border-pink-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: sub.color || "#EC4899" }}
                      />
                      <CardTitle className="text-base font-bold text-zinc-900">
                        {sub.name}
                      </CardTitle>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingSubject(sub);
                          setIsModalOpen(true);
                        }}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                        title="Edit Subject"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(sub.id, sub.name)}
                        className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {sub.description && (
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{sub.description}</p>
                  )}
                </CardHeader>

                <CardContent className="p-5 pt-4 space-y-4 flex-1">
                  {/* Progress vs Target Hours */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-600">Progress</span>
                      <span className="text-brand-600">
                        {formatMinutes(sub.totalStudyMinutes)} / {sub.targetHours}h ({progressPercent}%)
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-pink-50 text-xs">
                    <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                      <span className="text-[10px] text-zinc-400 font-medium">Topics Done</span>
                      <p className="font-bold text-zinc-800">
                        {sub.completedTopics} / {sub.totalTopics}
                      </p>
                    </div>

                    <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                      <span className="text-[10px] text-zinc-400 font-medium">Sessions</span>
                      <p className="font-bold text-zinc-800">{sub.sessionsCount}</p>
                    </div>
                  </div>
                </CardContent>

                {/* Footer Action */}
                <div className="p-4 pt-0">
                  <Link
                    href={`/subjects/${sub.id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Manage Syllabus &amp; Topics <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
