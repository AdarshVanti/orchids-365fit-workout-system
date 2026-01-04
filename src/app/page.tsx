"use client";

import { useState, useEffect } from "react";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { WorkoutSession } from "@/components/workout/WorkoutSession";
import { CalendarView } from "@/components/progress/CalendarView";
import { ProgressView } from "@/components/progress/ProgressView";
import { ProfileView } from "@/components/progress/ProfileView";
import { AIChat } from "@/components/ui/AIChat";
import { NotificationCenter } from "@/components/ui/NotificationCenter";
import { getUserData, clearAllData, getTheme, setTheme } from "@/lib/storage";
import { WorkoutDay } from "@/lib/types";

type Screen = "loading" | "onboarding" | "dashboard" | "workout" | "calendar" | "progress" | "profile";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutDay | null>(null);

  useEffect(() => {
    const theme = getTheme();
    document.documentElement.classList.toggle("dark", theme === "dark");

    const userData = getUserData();
    if (userData) {
      setScreen("dashboard");
    } else {
      setScreen("onboarding");
    }
  }, []);

  const handleOnboardingComplete = () => {
    setScreen("dashboard");
  };

  const handleStartWorkout = (workout: WorkoutDay) => {
    setCurrentWorkout(workout);
    setScreen("workout");
  };

  const handleWorkoutComplete = () => {
    setCurrentWorkout(null);
    setScreen("dashboard");
  };

  const handleLogout = () => {
    clearAllData();
    setScreen("onboarding");
  };

  if (screen === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (screen === "onboarding") {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  if (screen === "workout" && currentWorkout) {
    return (
      <>
        <WorkoutSession
          workout={currentWorkout}
          onComplete={handleWorkoutComplete}
          onBack={() => setScreen("dashboard")}
        />
        <AIChat context={`User is doing a ${currentWorkout.split} workout targeting ${currentWorkout.targetMuscles.join(", ")}`} />
        <NotificationCenter />
      </>
    );
  }

  if (screen === "calendar") {
    return (
      <>
        <CalendarView onBack={() => setScreen("dashboard")} />
        <AIChat />
        <NotificationCenter />
      </>
    );
  }

  if (screen === "progress") {
    return (
      <>
        <ProgressView onBack={() => setScreen("dashboard")} />
        <AIChat />
        <NotificationCenter />
      </>
    );
  }

  if (screen === "profile") {
    return (
      <>
        <ProfileView onBack={() => setScreen("dashboard")} onLogout={handleLogout} />
        <AIChat />
        <NotificationCenter />
      </>
    );
  }

  return (
    <>
      <Dashboard
        onStartWorkout={handleStartWorkout}
        onViewProgress={() => setScreen("progress")}
        onViewCalendar={() => setScreen("calendar")}
        onViewProfile={() => setScreen("profile")}
        onLogout={handleLogout}
      />
      <AIChat />
      <NotificationCenter />
    </>
  );
}
