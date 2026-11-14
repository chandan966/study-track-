import React from "react";
import Link from "next/link";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatMinutes } from "@/lib/utils";

interface RecentSessionsProps {
  sessions: any[];
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  return (
    <Card className="border-pink-100 bg-white shadow-sm">
      <CardHeader className="py-4 px-5 border-b border-pink-50 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-500" />
          Recent Study Sessions
        </CardTitle>
        <Link
          href="/timeline"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          View Timeline <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        {sessions.length === 0 ? (
          <div className="text-center py-6 text-xs text-zinc-400">
            No study sessions recorded yet. Start your first session!
          </div>
        ) : (
          <div className="space-y-2.5">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 bg-zinc-50/50 hover:bg-brand-50/30 hover:border-pink-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-10 rounded-full"
                    style={{ backgroundColor: sess.subject.color || "#EC4899" }}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">{sess.subject.name}</h4>
                    <p className="text-[11px] text-zinc-500 font-medium">
                      {sess.topic?.name || "General Topic Study"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-brand-600 font-mono">
                    {formatMinutes(sess.durationMinutes)}
                  </span>
                  <p className="text-[10px] text-zinc-400 uppercase">{sess.mode}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
