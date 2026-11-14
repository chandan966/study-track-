"use client";

import React, { useState, useEffect } from "react";
import { ListTodo, PlusCircle, CheckCircle2, Circle, Calendar, AlertCircle, Edit, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskModal } from "@/components/tasks/TaskModal";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate } from "@/lib/utils";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const fetchTasksAndSubjects = async () => {
    setIsLoading(true);
    try {
      let url = "/api/tasks";
      if (statusFilter !== "ALL") url += `?status=${statusFilter}`;

      const [taskRes, subRes] = await Promise.all([
        fetch(url),
        fetch("/api/subjects"),
      ]);

      if (taskRes.ok) setTasks(await taskRes.json());
      if (subRes.ok) setSubjects(await subRes.json());
    } catch (err) {
      console.error("Failed to load tasks", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksAndSubjects();
  }, [statusFilter]);

  const toggleTaskStatus = async (task: any) => {
    const nextStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) fetchTasksAndSubjects();
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const handleDeleteTask = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete task "${title}"?`)) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (res.ok) fetchTasksAndSubjects();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSaved={fetchTasksAndSubjects}
        subjects={subjects}
        initialData={editingTask}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Study Tasks &amp; Homework Planner
          </h1>
          <p className="text-xs text-zinc-500">
            Keep track of assignments, practice problem sheets, and revision targets.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-pink-200"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Add Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-pink-100 shadow-xs">
        {[
          { id: "ALL", label: "All Tasks" },
          { id: "PENDING", label: "Pending" },
          { id: "COMPLETED", label: "Completed" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === tab.id
                ? "bg-brand-500 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-pink-50/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {tasks.length === 0 && !isLoading ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks found"
          description="You're all caught up! Add a new task to organize your upcoming study work."
          actionLabel="Create Task"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const isDone = task.status === "COMPLETED";

            return (
              <Card
                key={task.id}
                className={`border transition-all ${
                  isDone
                    ? "bg-zinc-50/70 border-zinc-200 opacity-70"
                    : "bg-white border-pink-100 shadow-xs hover:border-pink-300"
                }`}
              >
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className="mt-0.5 text-zinc-400 hover:text-brand-500 transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          className={`text-sm font-bold ${
                            isDone ? "line-through text-zinc-400" : "text-zinc-900"
                          }`}
                        >
                          {task.title}
                        </h4>

                        {task.subject && (
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-2xs"
                            style={{ backgroundColor: task.subject.color || "#EC4899" }}
                          >
                            {task.subject.name}
                          </span>
                        )}

                        <Badge
                          variant={
                            task.priority === "HIGH"
                              ? "danger"
                              : task.priority === "LOW"
                              ? "secondary"
                              : "warning"
                          }
                          className="text-[10px]"
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      {task.description && (
                        <p className="text-xs text-zinc-500">{task.description}</p>
                      )}

                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400 pt-0.5">
                          <Calendar className="w-3 h-3 text-brand-400" />
                          <span>Due {formatDate(task.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id, task.title)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
