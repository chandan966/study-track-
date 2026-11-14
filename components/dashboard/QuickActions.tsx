import React from "react";
import Link from "next/link";
import { Timer, PlusCircle, BookPlus, FilePlus, Layers } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface QuickActionsProps {
  onOpenTaskModal: () => void;
  onOpenNoteModal: () => void;
  onOpenSubjectModal: () => void;
  onOpenTopicModal: () => void;
}

export function QuickActions({
  onOpenTaskModal,
  onOpenNoteModal,
  onOpenSubjectModal,
  onOpenTopicModal,
}: QuickActionsProps) {
  return (
    <Card className="border-pink-100 bg-white shadow-sm">
      <CardHeader className="py-4 px-5 border-b border-pink-50">
        <CardTitle className="text-sm font-bold text-zinc-900">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Link
            href="/timer"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-pink-200 bg-brand-50 hover:bg-brand-100 text-brand-700 transition-colors text-center group"
          >
            <Timer className="w-5 h-5 mb-1.5 text-brand-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Start Studying</span>
          </Link>

          <button
            type="button"
            onClick={onOpenSubjectModal}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-pink-50/50 hover:border-pink-200 text-zinc-800 transition-colors text-center group"
          >
            <BookPlus className="w-5 h-5 mb-1.5 text-brand-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Add Subject</span>
          </button>

          <button
            type="button"
            onClick={onOpenTopicModal}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-pink-50/50 hover:border-pink-200 text-zinc-800 transition-colors text-center group"
          >
            <Layers className="w-5 h-5 mb-1.5 text-brand-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Add Topic</span>
          </button>

          <button
            type="button"
            onClick={onOpenTaskModal}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-pink-50/50 hover:border-pink-200 text-zinc-800 transition-colors text-center group"
          >
            <PlusCircle className="w-5 h-5 mb-1.5 text-brand-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Add Task</span>
          </button>

          <button
            type="button"
            onClick={onOpenNoteModal}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-pink-50/50 hover:border-pink-200 text-zinc-800 transition-colors text-center group"
          >
            <FilePlus className="w-5 h-5 mb-1.5 text-brand-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Add Note</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
