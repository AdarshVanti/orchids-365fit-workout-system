"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Flame,
  Trophy,
  Clock,
  ChevronRight,
  CheckCircle2,
  Circle,
  Droplets,
  Moon,
  Utensils,
  Apple,
  Play,
  Calendar,
  BarChart3,
  User,
  Settings,
  Sun,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TodoList } from "./TodoList";
import { UserData, WorkoutDay, DailyHabits, WorkoutHistory } from "@/lib/types";
import { getUserData, getWorkoutHistory, getDailyProgress, saveDailyProgress, getTheme, setTheme } from "@/lib/storage";
import { generateWorkoutDay, WORKOUT_PLANS } from "@/lib/workout-data";

interface DashboardProps {
  onStartWorkout: (workout: WorkoutDay) => void;
  onViewProgress: () => void;
  onViewCalendar: () => void;
  onViewProfile: () => void;
  onLogout: () => void;
}

export function Dashboard({ onStartWorkout, onViewProgress, onViewCalendar, onViewProfile, onLogout }: DashboardProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [todayWorkout, setTodayWorkout] = useState<WorkoutDay | null>(null);
  const [history, setHistory] = useState<WorkoutHistory | null>(null);
  const [habits, setHabits] = useState<DailyHabits>({
    workout: false,
    sleep: false,
    protein: false,
    healthyEating: false,
    water: false,
  });
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const user = getUserData();
    if (user) {
      setUserData(user);
      const workout = generateWorkoutDay(user.selectedPlan.planId, user.selectedPlan.currentDay);
      setTodayWorkout(workout);
    }
    const workoutHistory = getWorkoutHistory();
    setHistory(workoutHistory);

    const today = new Date().toISOString().split("T")[0];
    const todayProgress = getDailyProgress(today);
    if (todayProgress) {
      setHabits(todayProgress.habits);
    }

    const theme = getTheme();
    setIsDark(theme === "dark");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    setTheme(newTheme);
  };

  const toggleHabit = (habit: keyof DailyHabits) => {
    const newHabits = { ...habits, [habit]: !habits[habit] };
    setHabits(newHabits);
    const today = new Date().toISOString().split("T")[0];
    const existing = getDailyProgress(today);
    const todos = getTodos();
    saveDailyProgress(today, {
      day: userData?.selectedPlan.currentDay || 1,
      planDay: todayWorkout?.split || "",
      completed: existing?.completed || false,
      exercises: existing?.exercises || [],
      habits: newHabits,
      todos: todos,
      duration: existing?.duration || 0,
    });
  };

  if (!userData || !todayWorkout) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const plan = WORKOUT_PLANS.find((p) => p.id === userData.selectedPlan.planId);
  const progressPercent = Math.round((userData.selectedPlan.currentDay / 365) * 100);
  const completedHabits = Object.values(habits).filter(Boolean).length;

  return (
    <div className={`min-h-screen ${isDark ? "bg-zinc-950" : "bg-zinc-100"} transition-colors`}>
      <header className={`sticky top-0 z-50 ${isDark ? "bg-zinc-950/90" : "bg-white/90"} backdrop-blur-xl border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>365FIT</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className={isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}>
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className={isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}>
                <nav className="mt-8 space-y-2">
                  <Button variant="ghost" className={`w-full justify-start ${isDark ? "text-white hover:bg-zinc-800" : "text-zinc-900 hover:bg-zinc-100"}`} onClick={onViewCalendar}>
                    <Calendar className="w-5 h-5 mr-3" /> Calendar
                  </Button>
                  <Button variant="ghost" className={`w-full justify-start ${isDark ? "text-white hover:bg-zinc-800" : "text-zinc-900 hover:bg-zinc-100"}`} onClick={onViewProgress}>
                    <BarChart3 className="w-5 h-5 mr-3" /> Progress
                  </Button>
                  <Button variant="ghost" className={`w-full justify-start ${isDark ? "text-white hover:bg-zinc-800" : "text-zinc-900 hover:bg-zinc-100"}`} onClick={onViewProfile}>
                    <User className="w-5 h-5 mr-3" /> Profile
                  </Button>
                  <Button variant="ghost" className={`w-full justify-start ${isDark ? "text-white hover:bg-zinc-800" : "text-zinc-900 hover:bg-zinc-100"}`}>
                    <Settings className="w-5 h-5 mr-3" /> Settings
                  </Button>
                  <div className="pt-4 border-t border-zinc-800">
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={onLogout}>
                      Logout
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`p-5 rounded-2xl ${isDark ? "bg-zinc-900" : "bg-white"} border ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>Day {userData.selectedPlan.currentDay} of 365</h2>
                <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>{plan?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-500 font-bold text-xl">{progressPercent}%</p>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Complete</p>
              </div>
            </div>
            <Progress value={progressPercent} className={`h-2 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-4 rounded-xl ${isDark ? "bg-zinc-900" : "bg-white"} border ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Streak</span>
              </div>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{history?.currentStreak || 0} days</p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? "bg-zinc-900" : "bg-white"} border ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Best Streak</span>
              </div>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{history?.longestStreak || 0} days</p>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className={`p-6 rounded-2xl ${isDark ? "bg-gradient-to-br from-emerald-900/50 to-teal-900/50" : "bg-gradient-to-br from-emerald-50 to-teal-50"} border ${isDark ? "border-emerald-800/50" : "border-emerald-200"}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className={`text-sm font-medium ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>TODAY&apos;S WORKOUT</p>
                <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"} mt-1`}>{todayWorkout.split} Day</h3>
                <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"} mt-1`}>{todayWorkout.targetMuscles.join(", ")}</p>
              </div>
              <div className={`px-3 py-1 rounded-full ${isDark ? "bg-emerald-500/20" : "bg-emerald-100"}`}>
                <span className={`text-sm font-medium ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>Week {todayWorkout.week}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${isDark ? "text-zinc-400" : "text-zinc-500"}`} />
                <span className={`text-sm ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>{todayWorkout.estimatedDuration.total}</span>
              </div>
              <div className="flex items-center gap-2">
                <Dumbbell className={`w-4 h-4 ${isDark ? "text-zinc-400" : "text-zinc-500"}`} />
                <span className={`text-sm ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>{todayWorkout.mainWorkout.length} exercises</span>
              </div>
            </div>

            <Button
              onClick={() => onStartWorkout(todayWorkout)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white h-12 text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Workout
            </Button>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className={`p-5 rounded-2xl ${isDark ? "bg-zinc-900" : "bg-white"} border ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>Daily Habits</h3>
              <span className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>{completedHabits}/5 complete</span>
            </div>

            <div className="space-y-3">
              {[
                { key: "workout" as const, label: "Complete Workout", icon: Dumbbell, color: "emerald" },
                { key: "sleep" as const, label: "8+ Hours Sleep", icon: Moon, color: "indigo" },
                { key: "protein" as const, label: "Hit Protein Goal", icon: Utensils, color: "rose" },
                { key: "healthyEating" as const, label: "Eat Healthy", icon: Apple, color: "green" },
                { key: "water" as const, label: "Drink 3L Water", icon: Droplets, color: "blue" },
              ].map((habit) => (
                <label
                  key={habit.key}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    habits[habit.key]
                      ? isDark
                        ? "bg-zinc-800 border-emerald-500/50"
                        : "bg-emerald-50 border-emerald-300"
                      : isDark
                      ? "bg-zinc-800/50 border-zinc-700"
                      : "bg-zinc-50 border-zinc-200"
                  } border`}
                >
                  <Checkbox
                    checked={habits[habit.key]}
                    onCheckedChange={() => toggleHabit(habit.key)}
                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <habit.icon className={`w-5 h-5 ${habits[habit.key] ? "text-emerald-500" : isDark ? "text-zinc-500" : "text-zinc-400"}`} />
                  <span className={`flex-1 ${habits[habit.key] ? (isDark ? "text-white" : "text-zinc-900") : isDark ? "text-zinc-400" : "text-zinc-500"}`}>{habit.label}</span>
                  {habits[habit.key] ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className={`w-5 h-5 ${isDark ? "text-zinc-600" : "text-zinc-300"}`} />
                  )}
                </label>
              ))}
            </div>
          </div>
        </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className={`p-5 rounded-2xl ${isDark ? "bg-zinc-900" : "bg-white"} border ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
              <TodoList />
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className={`p-5 rounded-2xl ${isDark ? "bg-zinc-900" : "bg-white"} border ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-zinc-900"} mb-4`}>Quick Tips</h3>
              <div className="space-y-3">
                <div className={`p-3 rounded-xl ${isDark ? "bg-zinc-800/50" : "bg-zinc-50"}`}>
                  <p className={`text-sm ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>{todayWorkout.tips.motivation}</p>
                </div>
                <div className={`p-3 rounded-xl ${isDark ? "bg-emerald-500/10" : "bg-emerald-50"} border ${isDark ? "border-emerald-500/20" : "border-emerald-200"}`}>
                  <p className={`text-sm ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>{todayWorkout.tips.nutrition}</p>
                </div>
              </div>
            </div>
          </motion.section>
      </main>

      <nav className={`fixed bottom-0 left-0 right-0 ${isDark ? "bg-zinc-900/95" : "bg-white/95"} backdrop-blur-xl border-t ${isDark ? "border-zinc-800" : "border-zinc-200"} pb-safe`}>
        <div className="max-w-lg mx-auto px-6 py-3 flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-emerald-500">
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs">Workout</span>
          </button>
          <button onClick={onViewCalendar} className={`flex flex-col items-center gap-1 ${isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"}`}>
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Calendar</span>
          </button>
          <button onClick={onViewProgress} className={`flex flex-col items-center gap-1 ${isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"}`}>
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Progress</span>
          </button>
          <button onClick={onViewProfile} className={`flex flex-col items-center gap-1 ${isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"}`}>
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>

      <div className="h-20" />
    </div>
  );
}
