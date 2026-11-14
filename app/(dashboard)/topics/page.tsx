"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookOpen, PlusCircle, Filter, RotateCcw, Edit, Trash2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TopicModal } from "@/components/topics/TopicModal";
import { RevisionModal } from "@/components/revisions/RevisionModal";
import { EmptyState } from "@/components/common/EmptyState";

function TopicsContent() {
  const searchParams = useSearchParams();
  const initialWeak = searchParams.get("weak") === "true";

  const [topics, setTopics] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [filterWeak, setFilterWeak] = useState<boolean>(initialWeak);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [selectedTopicForRevision, setSelectedTopicForRevision] = useState<any>(null);

  const fetchTopicsAndSubjects = async () => {
    setIsLoading(true);
    try {
      let url = "/api/topics?";
      if (selectedSubjectId) url += `subjectId=${selectedSubjectId}&`;
      if (filterWeak) url += `weak=true`;

      const [topRes, subRes] = await Promise.all([
        fetch(url),
        fetch("/api/subjects"),
      ]);

      if (topRes.ok) setTopics(await topRes.json());
      if (subRes.ok) setSubjects(await subRes.json());
    } catch (err) {
      console.error("Failed to load topics", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicsAndSubjects();
  }, [selectedSubjectId, filterWeak]);

  const handleDeleteTopic = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete topic "${name}"?`)) return;
    try {
      const res = await fetch(`/api/topics/${id}`, { method: "DELETE" });
      if (res.ok) fetchTopicsAndSubjects();
    } catch (err) {
      console.error("Failed to delete topic", err);
    }
  };

  return (
    <div className="space-y-6">
      <TopicModal
        isOpen={isTopicModalOpen}
        onClose={() => {
          setIsTopicModalOpen(false);
          setEditingTopic(null);
        }}
        onSaved={fetchTopicsAndSubjects}
        subjects={subjects}
        initialData={editingTopic}
      />

      {selectedTopicForRevision && (
        <RevisionModal
          isOpen={isRevisionModalOpen}
          onClose={() => {
            setIsRevisionModalOpen(false);
            setSelectedTopicForRevision(null);
          }}
          onSaved={fetchTopicsAndSubjects}
          topics={[selectedTopicForRevision]}
          defaultTopicId={selectedTopicForRevision.id}
        />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Topic &amp; Understanding Tracker
          </h1>
          <p className="text-xs text-zinc-500">
            Monitor mastery percentage (0–100%) and identify weak topics that require revision.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditingTopic(null);
            setIsTopicModalOpen(true);
          }}
          disabled={subjects.length === 0}
          className="bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-pink-200"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Add Topic
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="border-pink-100 bg-white shadow-xs">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterWeak(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !filterWeak
                  ? "bg-brand-500 text-white shadow-xs"
                  : "bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200"
              }`}
            >
              All Topics ({topics.length})
            </button>
            <button
              onClick={() => setFilterWeak(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterWeak
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-white text-amber-700 hover:bg-amber-50 border border-amber-200"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Weak Topics (&lt; 50%)
            </button>
          </div>

          {subjects.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="h-8 px-2.5 text-xs font-medium bg-white rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Topics List */}
      {topics.length === 0 && !isLoading ? (
        <EmptyState
          icon={BookOpen}
          title={filterWeak ? "No weak topics found!" : "No topics found"}
          description={
            filterWeak
              ? "All your recorded topics currently have ≥50% understanding! Excellent mastery."
              : "Create subjects and add topics to start tracking your detailed understanding."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((t) => (
            <Card
              key={t.id}
              className="border-pink-100 bg-white shadow-xs hover:border-pink-200 hover:shadow-sm transition-all"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: t.subject?.color || "#EC4899" }}
                      />
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        {t.subject?.name}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 mt-1">{t.name}</h3>
                    {t.description && (
                      <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{t.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTopic(t);
                        setIsTopicModalOpen(true);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(t.id, t.name)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-500">Understanding</span>
                    <span className={t.understanding < 50 ? "text-amber-600 font-bold" : "text-brand-600 font-bold"}>
                      {t.understanding}%
                    </span>
                  </div>
                  <Progress
                    value={t.understanding}
                    className="h-2"
                    indicatorColor={t.understanding < 50 ? "bg-amber-500" : "bg-brand-500"}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-pink-50 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant={
                        t.status === "COMPLETED"
                          ? "success"
                          : t.status === "IN_PROGRESS"
                          ? "pink"
                          : "default"
                      }
                      className="text-[10px]"
                    >
                      {t.status.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {t.difficulty}
                    </Badge>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTopicForRevision(t);
                      setIsRevisionModalOpen(true);
                    }}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Schedule Revision
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TopicsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-zinc-400">
          Loading topics...
        </div>
      }
    >
      <TopicsContent />
    </Suspense>
  );
}
