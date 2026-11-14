"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, PlusCircle, CheckCircle2, Circle, Calendar, AlertCircle, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RevisionModal } from "@/components/revisions/RevisionModal";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate } from "@/lib/utils";
import { isToday, isPast, parseISO } from "date-fns";

export default function RevisionsPage() {
  const [revisions, setRevisions] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRevisions = async () => {
    setIsLoading(true);
    try {
      const [revRes, topRes] = await Promise.all([
        fetch("/api/revisions"),
        fetch("/api/topics"),
      ]);
      if (revRes.ok) setRevisions(await revRes.json());
      if (topRes.ok) setTopics(await topRes.json());
    } catch (err) {
      console.error("Failed to load revisions", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, []);

  const toggleRevision = async (rev: any) => {
    try {
      const res = await fetch(`/api/revisions/${rev.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !rev.isCompleted }),
      });
      if (res.ok) fetchRevisions();
    } catch (err) {
      console.error("Failed to toggle revision", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this revision schedule?")) return;
    try {
      const res = await fetch(`/api/revisions/${id}`, { method: "DELETE" });
      if (res.ok) fetchRevisions();
    } catch (err) {
      console.error("Failed to delete revision", err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <RevisionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchRevisions}
        topics={topics}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Spaced Repetition &amp; Topic Revisions
          </h1>
          <p className="text-xs text-zinc-500">
            Scientifically timed intervals to ensure maximum long-term memory retention.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          disabled={topics.length === 0}
          className="bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-pink-200"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Schedule Revision
        </Button>
      </div>

      {/* Revisions List */}
      {revisions.length === 0 && !isLoading ? (
        <EmptyState
          icon={RotateCcw}
          title="No revisions scheduled yet"
          description="Schedule your first spaced revision (1 day, 3 days, 1 week) to permanently master challenging concepts."
          actionLabel="Schedule First Revision"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {revisions.map((rev) => {
            const scheduledDate = parseISO(rev.scheduledFor);
            const dueToday = isToday(scheduledDate);
            const overdue = !rev.isCompleted && isPast(scheduledDate) && !dueToday;

            return (
              <Card
                key={rev.id}
                className={`border transition-all ${
                  rev.isCompleted
                    ? "bg-zinc-50/70 border-zinc-200 opacity-60"
                    : dueToday
                    ? "bg-brand-50/40 border-brand-300 shadow-sm ring-1 ring-brand-200"
                    : overdue
                    ? "bg-rose-50/30 border-rose-200"
                    : "bg-white border-pink-100 shadow-xs"
                }`}
              >
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleRevision(rev)}
                      className="mt-0.5 text-zinc-400 hover:text-brand-500 transition-colors"
                    >
                      {rev.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-2xs"
                          style={{ backgroundColor: rev.topic.subject.color || "#EC4899" }}
                        >
                          {rev.topic.subject.name}
                        </span>

                        <h4
                          className={`text-sm font-bold ${
                            rev.isCompleted ? "line-through text-zinc-400" : "text-zinc-900"
                          }`}
                        >
                          {rev.topic.name}
                        </h4>

                        {dueToday && (
                          <Badge variant="pink" className="text-[10px] font-bold animate-pulse">
                            Due Today
                          </Badge>
                        )}
                        {overdue && (
                          <Badge variant="danger" className="text-[10px]">
                            Overdue
                          </Badge>
                        )}
                      </div>

                      {rev.notes && (
                        <p className="text-xs text-zinc-500 italic">&ldquo;{rev.notes}&rdquo;</p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-brand-400" />
                          Scheduled for {formatDate(rev.scheduledFor)}
                        </span>
                        <span>• Interval: {rev.intervalDays} days</span>
                        {rev.completedAt && (
                          <span>• Completed on {formatDate(rev.completedAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
