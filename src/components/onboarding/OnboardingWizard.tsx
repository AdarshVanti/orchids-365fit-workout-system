"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, ChevronRight, ChevronLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  OnboardingData,
  Gender,
  ExperienceLevel,
  Location,
  Goal,
  ActivityLevel,
  Diet,
  HealthCondition,
  HomeEquipment,
} from "@/lib/types";
import {
  saveOnboardingData,
  getOnboardingData,
  clearOnboardingData,
  saveUserData,
    calculateBMI,
    getBMICategory,
    calculateWHtR,
    getHealthRisk,
  } from "@/lib/storage";
  import { getPlanForUser, WORKOUT_PLANS } from "@/lib/workout-data";
  
  interface OnboardingWizardProps {
    onComplete: () => void;
  }
  
  const TOTAL_STEPS = 8;
  
  export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
    const [data, setData] = useState<OnboardingData>({ step: 1 });
    const [direction, setDirection] = useState(1);
  
    useEffect(() => {
      const saved = getOnboardingData();
      if (saved) {
        setData(saved);
      }
    }, []);
  
    useEffect(() => {
      saveOnboardingData(data);
    }, [data]);
  
    const updateData = (updates: Partial<OnboardingData>) => {
      setData((prev) => ({ ...prev, ...updates }));
    };
  
    const nextStep = () => {
      setDirection(1);
      updateData({ step: Math.min(data.step + 1, TOTAL_STEPS) });
    };
  
    const prevStep = () => {
      setDirection(-1);
      updateData({ step: Math.max(data.step - 1, 1) });
    };
  
    const completeOnboarding = () => {
      const plan = getPlanForUser(
        data.location || "gym",
        data.experience || "beginner",
        data.goals || ["muscle_gain"]
      );
  
      const bmi = calculateBMI(data.weight || 70, data.height || 170);
      const whtr = data.waist && data.height ? calculateWHtR(data.waist, data.height) : undefined;
  
      saveUserData({
        userId: `user_${Date.now()}`,
        email: "",
        profile: {
          height: data.height || 170,
          weight: data.weight || 70,
          age: data.age || 25,
          gender: data.gender || "male",
          bmi,
          waist: data.waist,
          whtr,
          experience: data.experience || "beginner",
          location: data.location || "gym",
          homeEquipment: data.homeEquipment || [],
          goals: data.goals || ["muscle_gain"],
          lifestyle: {
            playsSports: data.playsSports || false,
            sport: data.sport,
            activityLevel: data.activityLevel || "moderate",
            workingHours: data.workingHours || 8,
            sleepHours: data.sleepHours || 7,
          },
          diet: data.diet || "non_vegetarian",
          healthConditions: data.healthConditions || [],
        },
        selectedPlan: {
          planId: plan.id,
          startDate: new Date().toISOString().split("T")[0],
          currentDay: 1,
        },
        createdAt: new Date().toISOString(),
        lastSync: new Date().toISOString(),
      });
  
      clearOnboardingData();
      onComplete();
    };
  
  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const renderStep = () => {
    switch (data.step) {
      case 1:
        return <WelcomeStep />;
      case 2:
        return <BasicInfoStep data={data} updateData={updateData} />;
      case 3:
        return <ExperienceStep data={data} updateData={updateData} />;
      case 4:
        return <LocationStep data={data} updateData={updateData} />;
      case 5:
        return <GoalsStep data={data} updateData={updateData} />;
      case 6:
        return <LifestyleStep data={data} updateData={updateData} />;
      case 7:
        return <HealthStep data={data} updateData={updateData} />;
      case 8:
        return <PlanReadyStep data={data} />;
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (data.step) {
      case 2:
        return data.height && data.weight && data.age && data.gender;
      case 3:
        return data.experience;
      case 4:
        return data.location;
      case 5:
        return data.goals && data.goals.length > 0;
      case 6:
        return data.activityLevel && data.diet;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">365FIT</span>
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                i < data.step
                  ? "bg-emerald-500"
                  : i === data.step - 1
                  ? "bg-emerald-500"
                  : "bg-zinc-700"
              }`}
            />
          ))}
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-800 p-8 shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={data.step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t border-zinc-800">
            {data.step > 1 ? (
              <Button
                variant="ghost"
                onClick={prevStep}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {data.step < TOTAL_STEPS ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={completeOnboarding}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                Start My Journey
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Step {data.step} of {TOTAL_STEPS}
        </p>
      </div>
    </div>
  );
}

function WelcomeStep() {
  return (
    <div className="text-center py-4">
      <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center">
        <Dumbbell className="w-10 h-10 text-emerald-500" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Welcome to 365FIT</h2>
      <p className="text-zinc-400 mb-6">
        Let&apos;s build your perfect 365-day workout plan. This will take about 2-3 minutes.
      </p>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-xl bg-zinc-800/50">
          <p className="text-2xl font-bold text-emerald-500">365</p>
          <p className="text-xs text-zinc-500">Days of Workouts</p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-800/50">
          <p className="text-2xl font-bold text-emerald-500">200+</p>
          <p className="text-xs text-zinc-500">Exercises</p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-800/50">
          <p className="text-2xl font-bold text-emerald-500">AI</p>
          <p className="text-xs text-zinc-500">Personalized</p>
        </div>
      </div>
    </div>
  );
}

function BasicInfoStep({
    data,
    updateData,
  }: {
    data: OnboardingData;
    updateData: (u: Partial<OnboardingData>) => void;
  }) {
    const bmi = data.height && data.weight ? calculateBMI(data.weight, data.height) : null;
    const whtr = data.waist && data.height ? calculateWHtR(data.waist, data.height) : null;
    const healthRisk = bmi && whtr ? getHealthRisk(bmi, whtr) : null;
  
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Tell us about yourself</h2>
  
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-400 text-sm">Height (cm)</Label>
              <Input
                type="number"
                value={data.height || ""}
                onChange={(e) => updateData({ height: Number(e.target.value) })}
                placeholder="175"
                className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <Label className="text-zinc-400 text-sm">Weight (kg)</Label>
              <Input
                type="number"
                value={data.weight || ""}
                onChange={(e) => updateData({ weight: Number(e.target.value) })}
                placeholder="70"
                className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>
  
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-400 text-sm">Age</Label>
              <Input
                type="number"
                value={data.age || ""}
                onChange={(e) => updateData({ age: Number(e.target.value) })}
                placeholder="28"
                className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Label className="text-zinc-400 text-sm">Waist (cm)</Label>
                <div className="group relative">
                  <div className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-500 cursor-help">i</div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    Measure at your belly button level. Important for tracking abdominal fat.
                  </div>
                </div>
              </div>
              <Input
                type="number"
                value={data.waist || ""}
                onChange={(e) => updateData({ waist: Number(e.target.value) })}
                placeholder="85"
                className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>
  
          <div>
            <Label className="text-zinc-400 text-sm mb-3 block">Gender</Label>
            <RadioGroup
              value={data.gender}
              onValueChange={(v) => updateData({ gender: v as Gender })}
              className="flex gap-4"
            >
              {(["male", "female", "other"] as Gender[]).map((g) => (
                <label
                  key={g}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${
                    data.gender === g
                      ? "bg-emerald-500/20 border-emerald-500"
                      : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
                  } border`}
                >
                  <RadioGroupItem value={g} className="sr-only" />
                  <span className="text-sm text-white capitalize">{g}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
  
          {(bmi || whtr) && (
            <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 space-y-3">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Health Metrics</p>
              <div className="grid grid-cols-2 gap-4">
                {bmi && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-zinc-400 text-xs">BMI</span>
                      <span className="text-white text-sm font-semibold">{bmi}</span>
                    </div>
                    <p className="text-zinc-500 text-[10px]">{getBMICategory(bmi)}</p>
                  </div>
                )}
                {whtr && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-zinc-400 text-xs">WHtR</span>
                      <span className="text-white text-sm font-semibold">{whtr}</span>
                    </div>
                    <p className="text-zinc-500 text-[10px]">Waist-to-Height</p>
                  </div>
                )}
              </div>
              {healthRisk && (
                <div className="pt-2 border-t border-zinc-700 flex justify-between items-center">
                  <span className="text-zinc-400 text-xs">Overall Health Risk</span>
                  <span className={`text-sm font-bold ${healthRisk.color}`}>{healthRisk.risk}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
  
function ExperienceStep({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (u: Partial<OnboardingData>) => void;
}) {
  const levels: { value: ExperienceLevel; label: string; desc: string; color: string }[] = [
    { value: "beginner", label: "Beginner", desc: "New to training or < 1 year", color: "emerald" },
    { value: "intermediate", label: "Intermediate", desc: "1-3 years consistent training", color: "amber" },
    { value: "advanced", label: "Advanced", desc: "3+ years serious training", color: "rose" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">What&apos;s your experience level?</h2>
      <div className="space-y-3">
        {levels.map((level) => (
          <button
            key={level.value}
            onClick={() => updateData({ experience: level.value })}
            className={`w-full p-4 rounded-xl text-left transition-all ${
              data.experience === level.value
                ? `bg-${level.color}-500/20 border-${level.color}-500`
                : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
            } border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{level.label}</p>
                <p className="text-sm text-zinc-400">{level.desc}</p>
              </div>
              {data.experience === level.value && (
                <Check className="w-5 h-5 text-emerald-500" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function LocationStep({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (u: Partial<OnboardingData>) => void;
}) {
  const equipment: { value: HomeEquipment; label: string }[] = [
    { value: "bodyweight", label: "Bodyweight Only" },
    { value: "dumbbells", label: "Dumbbells" },
    { value: "resistance_bands", label: "Resistance Bands" },
    { value: "pull_up_bar", label: "Pull-up Bar" },
    { value: "bench", label: "Bench" },
    { value: "barbell", label: "Barbell & Weights" },
  ];

  const toggleEquipment = (eq: HomeEquipment) => {
    const current = data.homeEquipment || [];
    const updated = current.includes(eq)
      ? current.filter((e) => e !== eq)
      : [...current, eq];
    updateData({ homeEquipment: updated });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Where will you train?</h2>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {(["gym", "home"] as Location[]).map((loc) => (
          <button
            key={loc}
            onClick={() => updateData({ location: loc })}
            className={`p-6 rounded-xl text-center transition-all ${
              data.location === loc
                ? "bg-emerald-500/20 border-emerald-500"
                : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
            } border`}
          >
            <span className="text-3xl mb-2 block">{loc === "gym" ? "🏋️" : "🏠"}</span>
            <p className="font-semibold text-white capitalize">{loc}</p>
            <p className="text-xs text-zinc-400">
              {loc === "gym" ? "Full equipment" : "Home workout"}
            </p>
          </button>
        ))}
      </div>

      {data.location === "home" && (
        <div>
          <Label className="text-zinc-400 text-sm mb-3 block">Available Equipment</Label>
          <div className="grid grid-cols-2 gap-2">
            {equipment.map((eq) => (
              <label
                key={eq.value}
                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                  data.homeEquipment?.includes(eq.value)
                    ? "bg-emerald-500/20 border-emerald-500"
                    : "bg-zinc-800 border-zinc-700"
                } border`}
              >
                <Checkbox
                  checked={data.homeEquipment?.includes(eq.value)}
                  onCheckedChange={() => toggleEquipment(eq.value)}
                />
                <span className="text-sm text-white">{eq.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GoalsStep({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (u: Partial<OnboardingData>) => void;
}) {
  const goals: { value: Goal; label: string; emoji: string }[] = [
    { value: "muscle_gain", label: "Build Muscle", emoji: "💪" },
    { value: "fat_loss", label: "Lose Fat", emoji: "🔥" },
    { value: "strength", label: "Gain Strength", emoji: "⚡" },
    { value: "endurance", label: "Improve Endurance", emoji: "🏃" },
    { value: "flexibility", label: "Flexibility", emoji: "🧘" },
    { value: "general_fitness", label: "General Fitness", emoji: "🎯" },
    { value: "sports_performance", label: "Sports Performance", emoji: "⚽" },
  ];

  const toggleGoal = (goal: Goal) => {
    const current = data.goals || [];
    const updated = current.includes(goal)
      ? current.filter((g) => g !== goal)
      : [...current, goal];
    updateData({ goals: updated });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">What are your goals?</h2>
      <p className="text-zinc-400 text-sm mb-6">Select all that apply</p>

      <div className="grid grid-cols-2 gap-2">
        {goals.map((goal) => (
          <label
            key={goal.value}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              data.goals?.includes(goal.value)
                ? "bg-emerald-500/20 border-emerald-500"
                : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
            } border`}
          >
            <Checkbox
              checked={data.goals?.includes(goal.value)}
              onCheckedChange={() => toggleGoal(goal.value)}
            />
            <span className="mr-1">{goal.emoji}</span>
            <span className="text-sm text-white">{goal.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function LifestyleStep({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (u: Partial<OnboardingData>) => void;
}) {
  const activityLevels: { value: ActivityLevel; label: string; desc: string }[] = [
    { value: "sedentary", label: "Sedentary", desc: "Desk job, little movement" },
    { value: "moderate", label: "Moderate", desc: "Some walking, on feet sometimes" },
    { value: "very_active", label: "Very Active", desc: "Physical job, always moving" },
  ];

  const diets: { value: Diet; label: string }[] = [
    { value: "non_vegetarian", label: "Non-Vegetarian" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Lifestyle & Activity</h2>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Checkbox
              checked={data.playsSports}
              onCheckedChange={(v) => updateData({ playsSports: Boolean(v) })}
            />
            <Label className="text-white">I play sports regularly</Label>
          </div>
          {data.playsSports && (
            <Input
              value={data.sport || ""}
              onChange={(e) => updateData({ sport: e.target.value })}
              placeholder="Which sport?"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          )}
        </div>

        <div>
          <Label className="text-zinc-400 text-sm mb-3 block">Daily Activity Level</Label>
          <div className="space-y-2">
            {activityLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => updateData({ activityLevel: level.value })}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  data.activityLevel === level.value
                    ? "bg-emerald-500/20 border-emerald-500"
                    : "bg-zinc-800 border-zinc-700"
                } border`}
              >
                <p className="text-sm text-white">{level.label}</p>
                <p className="text-xs text-zinc-500">{level.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-zinc-400 text-sm">Work hours/day</Label>
            <Input
              type="number"
              value={data.workingHours || ""}
              onChange={(e) => updateData({ workingHours: Number(e.target.value) })}
              placeholder="8"
              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div>
            <Label className="text-zinc-400 text-sm">Sleep hours/night</Label>
            <Input
              type="number"
              value={data.sleepHours || ""}
              onChange={(e) => updateData({ sleepHours: Number(e.target.value) })}
              placeholder="7"
              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>

        <div>
          <Label className="text-zinc-400 text-sm mb-3 block">Diet Preference</Label>
          <RadioGroup
            value={data.diet}
            onValueChange={(v) => updateData({ diet: v as Diet })}
            className="flex gap-2"
          >
            {diets.map((d) => (
              <label
                key={d.value}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer text-sm transition-all ${
                  data.diet === d.value
                    ? "bg-emerald-500/20 border-emerald-500"
                    : "bg-zinc-800 border-zinc-700"
                } border`}
              >
                <RadioGroupItem value={d.value} className="sr-only" />
                <span className="text-white">{d.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}

function HealthStep({
  data,
  updateData,
}: {
  data: OnboardingData;
  updateData: (u: Partial<OnboardingData>) => void;
}) {
  const conditions: { value: HealthCondition; label: string }[] = [
    { value: "knee_pain", label: "Knee Pain" },
    { value: "back_pain", label: "Back Pain" },
    { value: "shoulder_pain", label: "Shoulder Pain" },
    { value: "asthma", label: "Asthma" },
    { value: "heart_condition", label: "Heart Condition" },
    { value: "diabetes", label: "Diabetes" },
    { value: "gerd", label: "GERD / Acid Reflux" },
    { value: "none", label: "None of the above" },
  ];

  const toggleCondition = (condition: HealthCondition) => {
    let current = data.healthConditions || [];
    if (condition === "none") {
      updateData({ healthConditions: ["none"] });
    } else {
      current = current.filter((c) => c !== "none");
      const updated = current.includes(condition)
        ? current.filter((c) => c !== condition)
        : [...current, condition];
      updateData({ healthConditions: updated });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">Health Considerations</h2>
      <p className="text-zinc-400 text-sm mb-6">
        Optional but helps us customize safer workouts
      </p>

      <div className="grid grid-cols-2 gap-2">
        {conditions.map((c) => (
          <label
            key={c.value}
            className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
              data.healthConditions?.includes(c.value)
                ? "bg-emerald-500/20 border-emerald-500"
                : "bg-zinc-800 border-zinc-700"
            } border`}
          >
            <Checkbox
              checked={data.healthConditions?.includes(c.value)}
              onCheckedChange={() => toggleCondition(c.value)}
            />
            <span className="text-sm text-white">{c.label}</span>
          </label>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
        <p className="text-amber-400 text-sm">
          We&apos;ll automatically adjust exercises based on your health conditions to keep you safe.
        </p>
      </div>
    </div>
  );
}

function PlanReadyStep({ data }: { data: OnboardingData }) {
  const plan = getPlanForUser(
    data.location || "gym",
    data.experience || "beginner",
    data.goals || ["muscle_gain"]
  );

  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 364);

  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <Check className="w-8 h-8 text-emerald-500" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Your Plan is Ready!</h2>
      <p className="text-zinc-400 mb-6">
        We&apos;ve created a personalized 365-day workout plan just for you.
      </p>

      <div className="bg-zinc-800/50 rounded-xl p-6 text-left mb-6">
        <h3 className="text-lg font-semibold text-emerald-500 mb-4">{plan.name}</h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-zinc-400">Split</span>
            <span className="text-white">{plan.split}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Days/Week</span>
            <span className="text-white">{plan.daysPerWeek}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Total Days</span>
            <span className="text-white">{plan.totalDays}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Start Date</span>
            <span className="text-white">{today.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">End Date</span>
            <span className="text-white">{endDate.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <p className="text-zinc-500 text-sm">
        Your journey to a stronger you starts now. Let&apos;s go!
      </p>
    </div>
  );
}
