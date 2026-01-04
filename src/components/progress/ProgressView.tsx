"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Dumbbell, Flame, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getUserData, getWorkoutHistory, getDailyProgressAll, getBodyMetrics } from "@/lib/storage";
import { UserData, WorkoutHistory, DailyProgress, BodyMetric } from "@/lib/types";

interface ProgressViewProps {
  onBack: () => void;
}

export function ProgressView({ onBack }: ProgressViewProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [history, setHistory] = useState<WorkoutHistory | null>(null);
  const [progressData, setProgressData] = useState<Record<string, DailyProgress>>({});
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);

  useEffect(() => {
    setUserData(getUserData());
    setHistory(getWorkoutHistory());
    setProgressData(getDailyProgressAll());
    setMetrics(getBodyMetrics());
  }, []);

  if (!userData || !history) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const completedWorkouts = Object.values(progressData).filter((p) => p.completed).length;
  const totalDays = userData.selectedPlan.currentDay;
  const completionRate = totalDays > 0 ? Math.round((completedWorkouts / totalDays) * 100) : 0;
  const progressPercent = Math.round((userData.selectedPlan.currentDay / 365) * 100);

  const weeklyData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateKey = date.toISOString().split("T")[0];
    return progressData[dateKey]?.completed || false;
  });

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Progress</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 rounded-2xl border border-emerald-800/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-emerald-500" />
              <h2 className="text-lg font-semibold">365 Day Journey</h2>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400">Day {userData.selectedPlan.currentDay} of 365</span>
              <span className="text-emerald-500 font-semibold">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-3 bg-zinc-800" />
            <p className="text-sm text-zinc-400 mt-4">
              {365 - userData.selectedPlan.currentDay} days remaining
            </p>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-zinc-400">Workouts</span>
              </div>
              <p className="text-3xl font-bold">{history.totalWorkouts}</p>
              <p className="text-xs text-zinc-500">completed</p>
            </div>
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-zinc-400">Current Streak</span>
              </div>
              <p className="text-3xl font-bold">{history.currentStreak}</p>
              <p className="text-xs text-zinc-500">days</p>
            </div>
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-zinc-400">Best Streak</span>
              </div>
              <p className="text-3xl font-bold">{history.longestStreak}</p>
              <p className="text-xs text-zinc-500">days</p>
            </div>
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-zinc-400">Completion</span>
              </div>
              <p className="text-3xl font-bold">{completionRate}%</p>
              <p className="text-xs text-zinc-500">rate</p>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h3 className="font-semibold mb-4">This Week</h3>
            <div className="flex justify-between">
              {weekDays.map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      weeklyData[i]
                        ? "bg-emerald-500"
                        : "bg-zinc-800"
                    }`}
                  >
                    {weeklyData[i] && <Dumbbell className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-xs text-zinc-500">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h3 className="font-semibold mb-4">Body Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-zinc-800/50">
                <p className="text-sm text-zinc-400">Height</p>
                <p className="text-xl font-bold">{userData.profile.height} cm</p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-800/50">
                <p className="text-sm text-zinc-400">Weight</p>
                <p className="text-xl font-bold">{userData.profile.weight} kg</p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-800/50">
                <p className="text-sm text-zinc-400">BMI</p>
                <p className="text-xl font-bold">{userData.profile.bmi}</p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-800/50">
                <p className="text-sm text-zinc-400">Age</p>
                <p className="text-xl font-bold">{userData.profile.age}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {history.totalVolume > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Total Volume Lifted</h3>
              <p className="text-4xl font-bold text-emerald-500">
                {history.totalVolume.toLocaleString()} kg
              </p>
              <p className="text-sm text-zinc-400 mt-1">Keep pushing!</p>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
