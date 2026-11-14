"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Award, Clock, Flame, Crown, Zap, Sparkles, Layers, CheckCircle, Target, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
  award: Award,
  clock: Clock,
  flame: Flame,
  crown: Crown,
  zap: Zap,
  sparkles: Sparkles,
  layers: Layers,
  "check-circle": CheckCircle,
  target: Target,
};

export function AchievementGrid() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/achievements");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load achievements", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const achievements = data?.achievements || [];
  const totalUnlocked = data?.totalUnlocked || 0;
  const totalAvailable = data?.totalAvailable || 9;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <Card className="border-pink-100 bg-gradient-to-r from-brand-50/80 via-white to-pink-50/50 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-md shadow-pink-200">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Academic & Study Badges</h2>
              <p className="text-xs text-zinc-500">
                Unlock badges automatically as you study, maintain streaks, and complete topics.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-brand-600">
              {totalUnlocked} / {totalAvailable}
            </span>
            <p className="text-xs text-zinc-400 font-medium">Badges Unlocked</p>
          </div>
        </div>
      </Card>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach: any) => {
          const Icon = ICON_MAP[ach.icon] || Trophy;
          const isUnlocked = ach.isUnlocked;

          return (
            <Card
              key={ach.id}
              className={`border transition-all ${
                isUnlocked
                  ? "bg-white border-pink-200 shadow-sm hover:border-brand-300"
                  : "bg-zinc-50/70 border-zinc-200 opacity-75"
              }`}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${
                      isUnlocked
                        ? "bg-brand-500 text-white shadow-md shadow-pink-200"
                        : "bg-zinc-200 text-zinc-400"
                    }`}
                  >
                    {isUnlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                  </div>

                  {isUnlocked ? (
                    <Badge variant="pink" className="gap-1 font-semibold text-[10px]">
                      <Sparkles className="w-3 h-3" /> Unlocked
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-zinc-400">
                      In Progress
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-zinc-900">{ach.title}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{ach.description}</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Target: {ach.targetValue}</span>
                    <span className="font-semibold text-zinc-700">
                      {isUnlocked ? "100%" : `${ach.progressPercent}%`}
                    </span>
                  </div>
                  <Progress
                    value={ach.progressPercent}
                    className="h-1.5"
                    indicatorColor={isUnlocked ? "bg-brand-500" : "bg-zinc-400"}
                  />
                </div>

                {isUnlocked && ach.unlockedAt && (
                  <p className="text-[10px] text-zinc-400 pt-1">
                    Unlocked on {formatDate(ach.unlockedAt)}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
