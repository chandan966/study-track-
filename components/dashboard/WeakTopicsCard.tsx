import React from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WeakTopicsCardProps {
  topics: any[];
}

export function WeakTopicsCard({ topics }: WeakTopicsCardProps) {
  return (
    <Card className="border-pink-100 bg-white shadow-sm">
      <CardHeader className="py-4 px-5 border-b border-pink-50 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          Weak Topics Needing Revision (&lt; 50%)
        </CardTitle>
        <Link
          href="/topics?weak=true"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        {topics.length === 0 ? (
          <div className="text-center py-6 text-xs text-zinc-400">
            🎉 Great job! No weak topics detected. All topics have ≥50% understanding.
          </div>
        ) : (
          <div className="space-y-3">
            {topics.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-xl border border-pink-100 bg-white shadow-2xs hover:border-pink-200 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: t.subject?.color || "#EC4899" }}
                    />
                    <span className="text-xs font-bold text-zinc-900">{t.name}</span>
                    <span className="text-[10px] text-zinc-400">({t.subject?.name})</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-600">{t.understanding}%</span>
                </div>
                <Progress value={t.understanding} className="h-1.5 bg-amber-100/60" indicatorColor="bg-amber-500" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
