"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  PlusCircle,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ListTodo,
  Trash2,
  Edit,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TopicModal } from "@/components/topics/TopicModal";
import { RevisionModal } from "@/components/revisions/RevisionModal";
import { formatMinutes, formatDate } from "@/lib/utils";

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.id as string;

  const [subject, setSubject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [selectedTopicForRevision, setSelectedTopicForRevision] = useState<any>(null);

  const fetchSubject = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/subjects/${subjectId}`);
      if (res.ok) {
        const data = await res.json();
        setSubject(data);
      } else {
        router.push("/subjects");
      }
    } catch (err) {
      console.error("Failed to load subject", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (subjectId) fetchSubject();
  }, [subjectId]);

  const handleDeleteTopic = async (topicId: string, topicName: string) => {
    if (!confirm(`Are you sure you want to delete topic "${topicName}"?`)) return;
    try {
      const res = await fetch(`/api/topics/${topicId}`, { method: "DELETE" });
      if (res.ok) fetchSubject();
    } catch (err) {
      console.error("Failed to delete topic", err);
    }
  };

  if (isLoading || !subject) {
    return (
      <div className="p-8 text-center text-xs text-zinc-400">
        Loading subject details...
      </div>
    );
  }

  const topics = subject.topics || [];
  const notes = subject.notes || [];
  const tasks = subject.tasks || [];
  const sessions = subject.studySessions || [];

  return (
    <div className="space-y-6">
      <TopicModal
        isOpen={isTopicModalOpen}
        onClose={() => {
          setIsTopicModalOpen(false);
          setEditingTopic(null);
        }}
        onSaved={fetchSubject}
        subjects={[{ id: subject.id, name: subject.name }]}
        defaultSubjectId={subject.id}
        initialData={editingTopic}
      />

      {selectedTopicForRevision && (
        <RevisionModal
          isOpen={isRevisionModalOpen}
          onClose={() => {
            setIsRevisionModalOpen(false);
            setSelectedTopicForRevision(null);
          }}
          onSaved={fetchSubject}
          topics={[{ id: selectedTopicForRevision.id, name: selectedTopicForRevision.name, subject: { name: subject.name } }]}
          defaultTopicId={selectedTopicForRevision.id}
        />
      )}

      {/* Back button & Header */}
      <div className="space-y-2">
        <Link
          href="/subjects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Subjects
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shadow-pink-200"
              style={{ backgroundColor: subject.color || "#EC4899" }}
            >
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 tracking-tight">{subject.name}</h1>
              <p className="text-xs text-zinc-500">{subject.description || "No description provided."}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                setEditingTopic(null);
                setIsTopicModalOpen(true);
              }}
              className="bg-brand-500 hover:bg-brand-600 text-white shadow-sm"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" /> Add Topic
            </Button>
          </div>
        </div>
      </div>

      {/* Progress & Overview Card */}
      <Card className="border-pink-100 bg-white shadow-sm p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[11px] text-zinc-400 font-medium">Total Study Logged</span>
            <p className="text-xl font-bold text-brand-600 mt-1">
              {formatMinutes(subject.totalStudyMinutes)}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 font-medium">Target Hours</span>
            <p className="text-xl font-bold text-zinc-900 mt-1">{subject.targetHours}h</p>
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 font-medium">Topics Completed</span>
            <p className="text-xl font-bold text-zinc-900 mt-1">
              {subject.completedTopicsCount} / {subject.totalTopicsCount}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 font-medium">Study Sessions</span>
            <p className="text-xl font-bold text-zinc-900 mt-1">{sessions.length}</p>
          </div>
        </div>
      </Card>

      {/* Topics List */}
      <Card className="border-pink-100 bg-white shadow-sm">
        <CardHeader className="py-4 px-6 border-b border-pink-50 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-zinc-900">
            Syllabus Topics ({topics.length})
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingTopic(null);
              setIsTopicModalOpen(true);
            }}
            className="text-xs border-pink-200 text-brand-600 hover:bg-brand-50"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Topic
          </Button>
        </CardHeader>
        <CardContent className="p-5">
          {topics.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-400">
              No topics created yet for this subject. Click &ldquo;Add Topic&rdquo; to build your syllabus!
            </div>
          ) : (
            <div className="space-y-3">
              {topics.map((t: any) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-zinc-100 bg-white shadow-xs hover:border-pink-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900">{t.name}</h4>
                      <Badge
                        variant={
                          t.status === "COMPLETED"
                            ? "success"
                            : t.status === "IN_PROGRESS"
                            ? "pink"
                            : "default"
                        }
                      >
                        {t.status.replace("_", " ")}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {t.difficulty}
                      </Badge>
                    </div>
                    {t.description && (
                      <p className="text-xs text-zinc-500">{t.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Understanding Slider / Metric */}
                    <div className="w-32 space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-zinc-400">Mastery</span>
                        <span className={t.understanding < 50 ? "text-amber-600" : "text-brand-600"}>
                          {t.understanding}%
                        </span>
                      </div>
                      <Progress
                        value={t.understanding}
                        className="h-1.5"
                        indicatorColor={t.understanding < 50 ? "bg-amber-500" : "bg-brand-500"}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedTopicForRevision(t);
                          setIsRevisionModalOpen(true);
                        }}
                        className="p-1.5 text-xs text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg font-medium flex items-center gap-1"
                        title="Schedule Revision"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Revise</span>
                      </button>
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
