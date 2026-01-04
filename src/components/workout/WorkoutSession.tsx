"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Info,
  AlertTriangle,
  Repeat,
  Plus,
  Minus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { WorkoutDay, Exercise, ExerciseSet, ExerciseProgress } from "@/lib/types";
import { getUserData, saveDailyProgress, getDailyProgress, saveWorkoutHistory, getWorkoutHistory, saveUserData } from "@/lib/storage";

interface WorkoutSessionProps {
  workout: WorkoutDay;
  onComplete: () => void;
  onBack: () => void;
}

type Phase = "warmup" | "workout" | "cooldown" | "complete";

export function WorkoutSession({ workout, onComplete, onBack }: WorkoutSessionProps) {
  const [phase, setPhase] = useState<Phase>("warmup");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>([]);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [currentReps, setCurrentReps] = useState(0);

  const currentExercise = workout.mainWorkout[currentExerciseIndex];
  const totalSets = currentExercise?.sets || 4;
  const targetReps = parseInt(currentExercise?.reps.split("-")[1] || currentExercise?.reps || "10");
  const restDuration = parseInt(currentExercise?.rest || "90");

  useEffect(() => {
    const progress: ExerciseProgress[] = workout.mainWorkout.map((ex) => ({
      name: ex.name,
      completed: false,
      sets: Array(ex.sets).fill({ weight: 0, reps: 0, completed: false }),
    }));
    setExerciseProgress(progress);
  }, [workout]);

  useEffect(() => {
    if (currentExercise) {
      setCurrentReps(targetReps);
    }
  }, [currentExerciseIndex, currentExercise, targetReps]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused && phase !== "complete") {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, phase]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTime > 0 && !isPaused) {
      interval = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTime, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const completeSet = useCallback(() => {
    const newProgress = [...exerciseProgress];
    if (newProgress[currentExerciseIndex]) {
      newProgress[currentExerciseIndex].sets[currentSetIndex] = {
        weight: currentWeight,
        reps: currentReps,
        completed: true,
      };
      setExerciseProgress(newProgress);
    }

    if (currentSetIndex < totalSets - 1) {
      setCurrentSetIndex((prev) => prev + 1);
      setIsResting(true);
      setRestTime(restDuration);
    } else {
      const updated = [...newProgress];
      updated[currentExerciseIndex].completed = true;
      setExerciseProgress(updated);

      if (currentExerciseIndex < workout.mainWorkout.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSetIndex(0);
        setCurrentWeight(0);
      } else {
        setPhase("cooldown");
      }
    }
  }, [currentExerciseIndex, currentSetIndex, totalSets, restDuration, currentWeight, currentReps, exerciseProgress, workout.mainWorkout.length]);

  const skipRest = () => {
    setIsResting(false);
    setRestTime(0);
  };

  const completeWorkout = () => {
    const today = new Date().toISOString().split("T")[0];
    const existing = getDailyProgress(today);

    saveDailyProgress(today, {
      day: workout.day,
      planDay: workout.split,
      completed: true,
      completedAt: new Date().toISOString(),
      exercises: exerciseProgress,
      habits: existing?.habits || {
        workout: true,
        sleep: false,
        protein: false,
        healthyEating: false,
        water: false,
      },
      duration: Math.round(elapsedTime / 60),
    });

    const history = getWorkoutHistory();
    saveWorkoutHistory({
      ...history,
      totalWorkouts: history.totalWorkouts + 1,
      currentStreak: history.currentStreak + 1,
      longestStreak: Math.max(history.longestStreak, history.currentStreak + 1),
    });

    const userData = getUserData();
    if (userData) {
      saveUserData({
        ...userData,
        selectedPlan: {
          ...userData.selectedPlan,
          currentDay: Math.min(userData.selectedPlan.currentDay + 1, 365),
        },
      });
    }

    setPhase("complete");
  };

  if (phase === "warmup") {
    return (
      <WarmupPhase
        workout={workout}
        onComplete={() => setPhase("workout")}
        onBack={onBack}
        elapsedTime={elapsedTime}
      />
    );
  }

  if (phase === "cooldown") {
    return (
      <CooldownPhase
        workout={workout}
        onComplete={completeWorkout}
        elapsedTime={elapsedTime}
      />
    );
  }

  if (phase === "complete") {
    return (
      <CompletionScreen
        workout={workout}
        elapsedTime={elapsedTime}
        exerciseProgress={exerciseProgress}
        onFinish={onComplete}
      />
    );
  }

  const exerciseProgressPercent = Math.round(
    ((currentExerciseIndex * totalSets + currentSetIndex) /
      (workout.mainWorkout.length * totalSets)) *
      100
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={onBack} className="text-zinc-400 hover:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <p className="text-sm text-zinc-400">{workout.split} Day</p>
              <p className="text-xs text-emerald-500">{formatTime(elapsedTime)} elapsed</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPaused(!isPaused)}
              className="text-zinc-400 hover:text-white"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </Button>
          </div>
          <Progress value={exerciseProgressPercent} className="h-1.5 bg-zinc-800" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {isResting ? (
            <motion.div
              key="rest"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-zinc-800 flex items-center justify-center">
                <span className="text-5xl font-bold text-emerald-500">{restTime}</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Rest Time</h2>
              <p className="text-zinc-400 mb-8">
                Next: Set {currentSetIndex + 1} of {totalSets}
              </p>
              <Button
                onClick={skipRest}
                variant="outline"
                className="border-zinc-700 text-white hover:bg-zinc-800"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip Rest
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="exercise"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-zinc-400">
                  Exercise {currentExerciseIndex + 1}/{workout.mainWorkout.length}
                </span>
                <span className="text-sm text-emerald-500">
                  Set {currentSetIndex + 1}/{totalSets}
                </span>
              </div>

                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mb-6">
                  <h2 className="text-2xl font-bold mb-2">{currentExercise.name}</h2>
                  <p className="text-zinc-400 text-sm mb-4">
                    {currentExercise.primaryMuscle}
                    {currentExercise.secondaryMuscles?.length
                      ? ` • ${currentExercise.secondaryMuscles.join(", ")}`
                      : ""}
                  </p>

                  {currentExercise.images && currentExercise.images.length > 0 && (
                    <ExerciseImageGallery images={currentExercise.images} name={currentExercise.name} />
                  )}

                  <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Repeat className="w-4 h-4" />
                    <span>{currentExercise.reps} reps</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Clock className="w-4 h-4" />
                    <span>{currentExercise.rest} rest</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Weight (kg)</label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 border-zinc-700"
                        onClick={() => setCurrentWeight(Math.max(0, currentWeight - 2.5))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={currentWeight}
                        onChange={(e) => setCurrentWeight(Number(e.target.value))}
                        className="text-center bg-zinc-800 border-zinc-700 text-white h-10"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 border-zinc-700"
                        onClick={() => setCurrentWeight(currentWeight + 2.5)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Reps</label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 border-zinc-700"
                        onClick={() => setCurrentReps(Math.max(0, currentReps - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={currentReps}
                        onChange={(e) => setCurrentReps(Number(e.target.value))}
                        className="text-center bg-zinc-800 border-zinc-700 text-white h-10"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 border-zinc-700"
                        onClick={() => setCurrentReps(currentReps + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={completeSet}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white h-12 text-lg font-semibold"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Complete Set
                </Button>
              </div>

              <div className="mb-4">
                <p className="text-xs text-zinc-500 mb-2">Completed Sets</p>
                <div className="flex gap-2">
                  {Array.from({ length: totalSets }).map((_, i) => {
                    const setData = exerciseProgress[currentExerciseIndex]?.sets[i];
                    return (
                      <div
                        key={i}
                        className={`flex-1 p-2 rounded-lg text-center text-xs ${
                          setData?.completed
                            ? "bg-emerald-500/20 border border-emerald-500/50"
                            : i === currentSetIndex
                            ? "bg-zinc-800 border border-zinc-700"
                            : "bg-zinc-900 border border-zinc-800"
                        }`}
                      >
                        {setData?.completed ? (
                          <div>
                            <p className="text-emerald-500 font-semibold">{setData.weight}kg</p>
                            <p className="text-zinc-400">{setData.reps} reps</p>
                          </div>
                        ) : (
                          <p className="text-zinc-500">Set {i + 1}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm text-zinc-300">Exercise Details</span>
                </div>
                {showDetails ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 mt-3 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-500 mb-2">Instructions</h4>
                        <ul className="space-y-1">
                          {currentExercise.instructions.map((inst, i) => (
                            <li key={i} className="text-sm text-zinc-400">
                              {i + 1}. {inst}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-emerald-500 mb-2">Form Tips</h4>
                        <ul className="space-y-1">
                          {currentExercise.formTips.map((tip, i) => (
                            <li key={i} className="text-sm text-zinc-400">
                              • {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-amber-500 mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          Common Mistakes
                        </h4>
                        <ul className="space-y-1">
                          {currentExercise.commonMistakes.map((mistake, i) => (
                            <li key={i} className="text-sm text-zinc-400">
                              • {mistake}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    );
  }

function ExerciseImageGallery({ images, name }: { images: string[]; name: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <ImageIcon className="w-4 h-4 text-emerald-500" />
        <span className="text-xs text-zinc-400">Form Guide</span>
        <span className="text-xs text-zinc-500">({currentIndex + 1}/{images.length})</span>
      </div>
      <div className="relative">
        <div 
          className={`relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800 cursor-pointer transition-all ${isExpanded ? 'aspect-video' : 'aspect-[16/9]'}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <img
            src={images[currentIndex]}
            alt={`${name} - Step ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-emerald-500 w-4' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`flex-1 aspect-video rounded-lg overflow-hidden border-2 transition-all ${
              idx === currentIndex ? 'border-emerald-500' : 'border-zinc-800'
            }`}
          >
            <img src={img} alt={`${name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function WarmupPhase({
  workout,
  onComplete,
  onBack,
  elapsedTime,
}: {
  workout: WorkoutDay;
  onComplete: () => void;
  onBack: () => void;
  elapsedTime: number;
}) {
  const [completedWarmups, setCompletedWarmups] = useState<boolean[]>(
    new Array(workout.warmup.exercises.length).fill(false)
  );

  const toggleWarmup = (index: number) => {
    const newCompleted = [...completedWarmups];
    newCompleted[index] = !newCompleted[index];
    setCompletedWarmups(newCompleted);
  };

  const allCompleted = completedWarmups.every(Boolean);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={onBack} className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <p className="text-sm text-emerald-500">Warm-up</p>
            <p className="text-xs text-zinc-400">{formatTime(elapsedTime)}</p>
          </div>
          <div className="w-6" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Let&apos;s Warm Up</h2>
          <p className="text-zinc-400">{workout.warmup.duration}</p>
        </div>

        <div className="space-y-3 mb-8">
          {workout.warmup.exercises.map((exercise, i) => (
            <button
              key={i}
              onClick={() => toggleWarmup(i)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                completedWarmups[i]
                  ? "bg-emerald-500/20 border-emerald-500"
                  : "bg-zinc-900 border-zinc-800"
              } border`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{exercise.name}</p>
                  <p className="text-sm text-zinc-400">
                    {exercise.duration || `${exercise.sets} x ${exercise.reps}`}
                  </p>
                </div>
                {completedWarmups[i] && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              </div>
            </button>
          ))}
        </div>

        <Button
          onClick={onComplete}
          disabled={!allCompleted}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white h-12 text-lg font-semibold disabled:opacity-50"
        >
          Start Workout
        </Button>
      </main>
    </div>
  );
}

function CooldownPhase({
  workout,
  onComplete,
  elapsedTime,
}: {
  workout: WorkoutDay;
  onComplete: () => void;
  elapsedTime: number;
}) {
  const [completedCooldowns, setCompletedCooldowns] = useState<boolean[]>(
    new Array(workout.cooldown.exercises.length).fill(false)
  );

  const toggleCooldown = (index: number) => {
    const newCompleted = [...completedCooldowns];
    newCompleted[index] = !newCompleted[index];
    setCompletedCooldowns(newCompleted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-lg mx-auto px-4 py-4 text-center">
          <p className="text-sm text-emerald-500">Cool Down</p>
          <p className="text-xs text-zinc-400">{formatTime(elapsedTime)}</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Great Work!</h2>
          <p className="text-zinc-400">Time to cool down and stretch</p>
        </div>

        <div className="space-y-3 mb-8">
          {workout.cooldown.exercises.map((exercise, i) => (
            <button
              key={i}
              onClick={() => toggleCooldown(i)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                completedCooldowns[i]
                  ? "bg-emerald-500/20 border-emerald-500"
                  : "bg-zinc-900 border-zinc-800"
              } border`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{exercise.name}</p>
                  <p className="text-sm text-zinc-400">{exercise.duration}</p>
                </div>
                {completedCooldowns[i] && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              </div>
            </button>
          ))}
        </div>

        <Button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white h-12 text-lg font-semibold"
        >
          Complete Workout
        </Button>
      </main>
    </div>
  );
}

function CompletionScreen({
  workout,
  elapsedTime,
  exerciseProgress,
  onFinish,
}: {
  workout: WorkoutDay;
  elapsedTime: number;
  exerciseProgress: ExerciseProgress[];
  onFinish: () => void;
}) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalVolume = exerciseProgress.reduce((acc, ex) => {
    return (
      acc +
      ex.sets.reduce((setAcc, set) => {
        return setAcc + (set.weight || 0) * (set.reps || 0);
      }, 0)
    );
  }, 0);

  const completedSets = exerciseProgress.reduce((acc, ex) => {
    return acc + ex.sets.filter((s) => s.completed).length;
  }, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"
        >
          <Check className="w-12 h-12 text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-2">Workout Complete!</h1>
        <p className="text-zinc-400 mb-8">Day {workout.day} crushed!</p>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-500">{formatTime(elapsedTime)}</p>
              <p className="text-xs text-zinc-400">Duration</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-500">{completedSets}</p>
              <p className="text-xs text-zinc-400">Sets</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-500">{totalVolume.toLocaleString()}</p>
              <p className="text-xs text-zinc-400">Volume (kg)</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 rounded-xl p-4 mb-8 text-left">
          <p className="text-emerald-400 text-sm">{workout.tips.recovery}</p>
        </div>

        <Button
          onClick={onFinish}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white h-12 text-lg font-semibold"
        >
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
