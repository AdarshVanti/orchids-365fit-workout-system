"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Check, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserData, getDailyProgressAll } from "@/lib/storage";
import { DailyProgress, UserData } from "@/lib/types";

interface CalendarViewProps {
  onBack: () => void;
}

export function CalendarView({ onBack }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userData, setUserData] = useState<UserData | null>(null);
  const [progressData, setProgressData] = useState<Record<string, DailyProgress>>({});

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    setUserData(getUserData());
    setProgressData(getDailyProgressAll());
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDateKey = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${month}-${dayStr}`;
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const startDate = userData?.selectedPlan.startDate
    ? new Date(userData.selectedPlan.startDate)
    : null;

  const isPlanDay = (day: number) => {
    if (!startDate) return false;
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate >= startDate && checkDate <= today;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Calendar</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="text-zinc-400 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="text-zinc-400 hover:text-white">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-xs text-zinc-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="aspect-square" />;
              }

              const dateKey = getDateKey(day);
              const progress = progressData[dateKey];
              const completed = progress?.completed;
              const inPlan = isPlanDay(day);
              const isTodayDate = isToday(day);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`aspect-square rounded-lg flex items-center justify-center relative cursor-pointer transition-all hover:scale-105 ${
                      selectedDate === dateKey
                        ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-zinc-950"
                        : ""
                    } ${
                      isTodayDate
                        ? "bg-emerald-500 text-white"
                        : completed
                        ? "bg-emerald-500/20 text-emerald-500"
                        : inPlan && !completed
                        ? "bg-red-500/20 text-red-400"
                        : "bg-zinc-800/50 text-zinc-400"
                    }`}
                  >
                    <span className="text-sm font-medium">{day}</span>
                    {completed && !isTodayDate && (
                      <Check className="absolute bottom-1 w-3 h-3 text-emerald-500" />
                    )}
                    {inPlan && !completed && !isTodayDate && (
                      <X className="absolute bottom-1 w-3 h-3 text-red-400" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedDate && (
              <motion.div
                key={selectedDate}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-500" />
                    Summary: {new Date(selectedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                </div>

                {progressData[selectedDate] ? (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-zinc-400 font-medium">WORKOUT</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${progressData[selectedDate].completed ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                          {progressData[selectedDate].completed ? "COMPLETED" : "MISSED"}
                        </span>
                      </div>
                      <p className="text-white font-medium">{progressData[selectedDate].planDay || "Rest Day"}</p>
                      {progressData[selectedDate].duration > 0 && (
                        <p className="text-xs text-zinc-500 mt-1">Duration: {progressData[selectedDate].duration} mins</p>
                      )}
                    </div>

                      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                        <span className="text-sm text-zinc-400 font-medium block mb-2">HABITS & TASKS</span>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {Object.entries(progressData[selectedDate].habits).map(([key, val]) => (
                            <div key={key} className="flex items-center gap-2 text-xs">
                              <div className={`w-2 h-2 rounded-full ${val ? "bg-emerald-500" : "bg-zinc-700"}`} />
                              <span className={val ? "text-zinc-200" : "text-zinc-500 capitalize"}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </div>
                          ))}
                        </div>
                        {progressData[selectedDate].todos && progressData[selectedDate].todos!.length > 0 && (
                          <div className="border-t border-zinc-800 pt-3 space-y-2">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Routine Items</span>
                            {progressData[selectedDate].todos!.map((todo, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <Check className={`w-3 h-3 ${todo.completed ? "text-emerald-500" : "text-zinc-700"}`} />
                                <span className={todo.completed ? "text-zinc-300 line-through" : "text-zinc-500"}>{todo.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-xl border border-dashed border-zinc-800">
                    <p className="text-sm text-zinc-500">No activity logged for this date.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>


        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50" />
            <span className="text-sm text-zinc-400">Completed Workout</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/50" />
            <span className="text-sm text-zinc-400">Missed Workout</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-emerald-500" />
            <span className="text-sm text-zinc-400">Today</span>
          </div>
        </div>

        {userData && (
          <div className="mt-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <h3 className="font-semibold mb-2">Plan Progress</h3>
            <p className="text-sm text-zinc-400">
              Started: {new Date(userData.selectedPlan.startDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-zinc-400">
              Current Day: {userData.selectedPlan.currentDay} of 365
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
