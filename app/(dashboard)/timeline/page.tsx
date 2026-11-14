"use client";

import React, { useState, useEffect } from "react";
import { StudyTimeline } from "@/components/timeline/StudyTimeline";

export default function TimelinePage() {
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/subjects")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSubjects(data))
      .catch((err) => console.error("Failed to load subjects", err));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Chronological Study Timeline
        </h1>
        <p className="text-xs text-zinc-500">
          Review your exact study history, timestamps, key takeaways, and difficulty notes.
        </p>
      </div>

      <StudyTimeline subjects={subjects} />
    </div>
  );
}
