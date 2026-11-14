"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DailyGoalCard } from "@/components/dashboard/DailyGoalCard";
import { StatCards } from "@/components/dashboard/StatCards";
import { RecentSessions } from "@/components/dashboard/RecentSessions";
import { WeakTopicsCard } from "@/components/dashboard/WeakTopicsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SubjectModal } from "@/components/subjects/SubjectModal";
import { TaskModal } from "@/components/tasks/TaskModal";
import { NoteModal } from "@/components/notes/NoteModal";
import { EmptyState } from "@/components/common/EmptyState";
import { BookOpen, Sparkles, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal controls for quick actions
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, subsRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/subjects"),
      ]);

      if (dashRes.ok) {
        const dashJson = await dashRes.json();
        setData(dashJson);
      }
      if (subsRes.ok) {
        const subsJson = await subsRes.json();
        setSubjects(subsJson);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = data?.stats;
  const recentSessions = data?.recentSessions || [];
  const weakTopics = data?.weakTopics || [];
  const dueRevisions = data?.dueRevisions || [];

  return (
    <div className="space-y-6">
      {/* Quick Action Modals */}
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSaved={fetchDashboardData}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaved={fetchDashboardData}
        subjects={subjects}
      />
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSaved={fetchDashboardData}
        subjects={subjects}
      />

      {/* 1. Daily Goal Hero Card */}
      <DailyGoalCard
        userName={data?.user?.name || session?.user?.name || "Student"}
        todayDate={data?.todayDate || "Today"}
        todayStudyMinutes={stats?.todayStudyMinutes || 0}
        todayStudyFormatted={stats?.todayStudyFormatted || "0m"}
        dailyGoalMinutes={stats?.dailyGoalMinutes || 360}
        dailyGoalFormatted={stats?.dailyGoalFormatted || "6h"}
        goalPercentage={stats?.goalPercentage || 0}
        isGoalCompleted={Boolean(stats?.isGoalCompleted)}
        currentStreak={stats?.currentStreak || 0}
      />

      {/* 2. Key Metrics Row */}
      <StatCards
        todayStudyFormatted={stats?.todayStudyFormatted || "0m"}
        dailyGoalFormatted={stats?.dailyGoalFormatted || "6h"}
        currentStreak={stats?.currentStreak || 0}
        sessionsToday={stats?.sessionsToday || 0}
        completedTasksTodayCount={stats?.completedTasksTodayCount || 0}
        pendingTasksCount={stats?.pendingTasksCount || 0}
      />

      {/* 3. Quick Actions Bar */}
      <QuickActions
        onOpenSubjectModal={() => setIsSubjectModalOpen(true)}
        onOpenTaskModal={() => setIsTaskModalOpen(true)}
        onOpenNoteModal={() => setIsNoteModalOpen(true)}
      />

      {/* 4. Due Revisions Alert Banner if any */}
      {dueRevisions.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-pink-50 border border-amber-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900">
                Spaced Revision Due Today ({dueRevisions.length})
              </h4>
              <p className="text-[11px] text-zinc-500">
                Topics like &quot;{dueRevisions[0]?.topic?.name}&quot; are scheduled for recall today.
              </p>
            </div>
          </div>
          <Link
            href="/revisions"
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* 5. Main Dashboard Split: Recent Sessions & Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSessions sessions={recentSessions} />
        <WeakTopicsCard topics={weakTopics} />
      </div>

      {/* 6. First-Time Empty State if zero sessions ever logged */}
      {!isLoading && stats?.totalSessionsOverall === 0 && (
        <EmptyState
          icon={BookOpen}
          title="Start your first study session"
          description="You haven't recorded any study sessions yet. Choose a subject and start the timer to begin building your study streak!"
          actionLabel="Start Studying Now"
          onAction={() => (window.location.href = "/timer")}
        />
      )}
    </div>
  );
}
