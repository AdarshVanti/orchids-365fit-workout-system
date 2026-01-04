"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Dumbbell, Target, Heart, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserData, getTheme, setTheme, getHealthRisk } from "@/lib/storage";
import { UserData } from "@/lib/types";
import { WORKOUT_PLANS } from "@/lib/workout-data";

interface ProfileViewProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ProfileView({ onBack, onLogout }: ProfileViewProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setUserData(getUserData());
    const theme = getTheme();
    setIsDark(theme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    setTheme(newTheme);
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const plan = WORKOUT_PLANS.find((p) => p.id === userData.selectedPlan.planId);
  const healthRisk = userData.profile.bmi && userData.profile.whtr ? getHealthRisk(userData.profile.bmi, userData.profile.whtr) : null;

  const goalLabels: Record<string, string> = {
    muscle_gain: "Build Muscle",
    fat_loss: "Lose Fat",
    strength: "Gain Strength",
    endurance: "Improve Endurance",
    flexibility: "Flexibility",
    general_fitness: "General Fitness",
    sports_performance: "Sports Performance",
  };

  const conditionLabels: Record<string, string> = {
    knee_pain: "Knee Pain",
    back_pain: "Back Pain",
    shoulder_pain: "Shoulder Pain",
    asthma: "Asthma",
    heart_condition: "Heart Condition",
    diabetes: "Diabetes",
    gerd: "GERD",
    none: "None",
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-zinc-950" : "bg-zinc-100"} text-${isDark ? "white" : "zinc-900"} transition-colors`}>
      <header className={`sticky top-0 z-50 ${isDark ? "bg-zinc-950/90" : "bg-white/90"} backdrop-blur-xl border-b ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className={`${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"}`}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>Profile</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className={isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`p-6 rounded-2xl ${isDark ? "bg-zinc-900" : "bg-white"} border ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className={`text-lg font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>
                  {userData.profile.gender === "male" ? "Mr." : userData.profile.gender === "female" ? "Ms." : ""} Athlete
                </p>
                <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                  Member since {new Date(userData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div className={`p-3 rounded-lg ${isDark ? "bg-zinc-800/50" : "bg-zinc-100"}`}>
                <p className="text-lg font-bold text-emerald-500">{userData.profile.age}</p>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Age</p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? "bg-zinc-800/50" : "bg-zinc-100"}`}>
                <p className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{userData.profile.height}</p>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>cm</p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? "bg-zinc-800/50" : "bg-zinc-100"}`}>
                <p className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{userData.profile.weight}</p>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>kg</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className={`p-3 rounded-lg ${isDark ? "bg-zinc-800/50" : "bg-zinc-100"}`}>
                <p className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{userData.profile.bmi}</p>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>BMI</p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? "bg-zinc-800/50" : "bg-zinc-100"}`}>
                <p className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{userData.profile.waist || "-"}</p>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Waist</p>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? "bg-zinc-800/50" : "bg-zinc-100"}`}>
                <p className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{userData.profile.whtr || "-"}</p>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>WHtR</p>
              </div>
            </div>

            {healthRisk && (
              <div className={`mt-4 pt-4 border-t ${isDark ? "border-zinc-800" : "border-zinc-200"} flex justify-between items-center`}>
                <span className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Health Risk</span>
                <span className={`text-sm font-bold ${healthRisk.color}`}>{healthRisk.risk}</span>
              </div>
            )}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className={`p-6 rounded-2xl ${isDark ? "bg-zinc-900" : "bg-white"} border ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-5 h-5 text-emerald-500" />
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>Current Plan</h3>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? "bg-zinc-800/50" : "bg-zinc-100"}`}>
              <p className="font-semibold text-emerald-500">{plan?.name}</p>
              <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"} mt-1`}>{plan?.description}</p>
              <div className="flex gap-4 mt-3">
                <span className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                  {plan?.split}
                </span>
                <span className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                  {plan?.daysPerWeek} days/week
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className={`p-6 rounded-2xl ${isDark ? "bg-zinc-900" : "bg-white"} border ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-emerald-500" />
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>Goals</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {userData.profile.goals.map((goal) => (
                <span
                  key={goal}
                  className={`px-3 py-1 rounded-full text-sm ${isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}
                >
                  {goalLabels[goal] || goal}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {userData.profile.healthConditions.length > 0 &&
          !userData.profile.healthConditions.includes("none") && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className={`p-6 rounded-2xl ${isDark ? "bg-zinc-900" : "bg-white"} border ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <h3 className={`font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>Health Considerations</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userData.profile.healthConditions.map((condition) => (
                    <span
                      key={condition}
                      className={`px-3 py-1 rounded-full text-sm ${isDark ? "bg-rose-500/20 text-rose-400" : "bg-rose-100 text-rose-700"}`}
                    >
                      {conditionLabels[condition] || condition}
                    </span>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Button
            onClick={onLogout}
            variant="outline"
            className={`w-full ${isDark ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-300 text-red-600 hover:bg-red-50"}`}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout & Reset
          </Button>
        </motion.section>
      </main>
    </div>
  );
}
