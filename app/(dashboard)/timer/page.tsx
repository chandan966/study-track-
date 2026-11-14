"use client";

import React, { useState, useEffect } from "react";
import { StudyTimer } from "@/components/timer/StudyTimer";
import { SubjectModal } from "@/components/subjects/SubjectModal";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen } from "lucide-react";

export default function TimerPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/subjects");
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
      }
    } catch (err) {
      console.error("Failed to load subjects for timer", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="space-y-6">
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSaved={fetchSubjects}
      />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Study Timer &amp; Focus Tracker
          </h1>
          <p className="text-xs text-zinc-500">
            Track deep focus sessions with stopwatch precision or Pomodoro intervals.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsSubjectModalOpen(true)}
          className="border-pink-200 text-brand-600 hover:bg-brand-50"
        >
          <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
          Add Subject
        </Button>
      </div>

      {/* Study Timer Component */}
      <StudyTimer subjects={subjects} onSessionSaved={fetchSubjects} />
    </div>
  );
}
