import { UserData, DailyProgress, WorkoutHistory, BodyMetric, OnboardingData } from "./types";

const STORAGE_KEYS = {
  USER_DATA: "365fit_user_data",
  DAILY_PROGRESS: "365fit_daily_progress",
  WORKOUT_HISTORY: "365fit_workout_history",
  BODY_METRICS: "365fit_body_metrics",
  ONBOARDING: "365fit_onboarding",
  THEME: "365fit_theme",
};

export function saveUserData(data: UserData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
  }
}

export function getUserData(): UserData | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (data) {
      const parsed = JSON.parse(data);
      if (!parsed.todos) parsed.todos = [];
      return parsed;
    }
  }
  return null;
}

export function saveApiKeys(keys: ApiKeys): void {
  const userData = getUserData();
  if (userData) {
    userData.profile.apiKeys = keys;
    saveUserData(userData);
  }
}

export function getApiKeys(): ApiKeys | undefined {
  const userData = getUserData();
  return userData?.profile.apiKeys;
}

export function saveTodos(todos: TodoItem[]): void {
  const userData = getUserData();
  if (userData) {
    userData.todos = todos;
    saveUserData(userData);
  }
}

export function getTodos(): TodoItem[] {
  const userData = getUserData();
  return userData?.todos || [];
}

export function saveDailyProgress(date: string, progress: DailyProgress): void {
  if (typeof window !== "undefined") {
    const allProgress = getDailyProgressAll();
    allProgress[date] = progress;
    localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(allProgress));
  }
}

export function getDailyProgress(date: string): DailyProgress | null {
  if (typeof window !== "undefined") {
    const allProgress = getDailyProgressAll();
    return allProgress[date] || null;
  }
  return null;
}

export function getDailyProgressAll(): Record<string, DailyProgress> {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
    return data ? JSON.parse(data) : {};
  }
  return {};
}

export function saveWorkoutHistory(history: WorkoutHistory): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
  }
}

export function getWorkoutHistory(): WorkoutHistory {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
    return data
      ? JSON.parse(data)
      : {
          totalWorkouts: 0,
          totalMissed: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalVolume: 0,
          favoriteExercises: [],
          personalRecords: {},
        };
  }
  return {
    totalWorkouts: 0,
    totalMissed: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalVolume: 0,
    favoriteExercises: [],
    personalRecords: {},
  };
}

export function saveBodyMetrics(metrics: BodyMetric[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BODY_METRICS, JSON.stringify(metrics));
  }
}

export function getBodyMetrics(): BodyMetric[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.BODY_METRICS);
    return data ? JSON.parse(data) : [];
  }
  return [];
}

export function saveOnboardingData(data: OnboardingData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(data));
  }
}

export function getOnboardingData(): OnboardingData | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function clearOnboardingData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING);
  }
}

export function getTheme(): "light" | "dark" {
  if (typeof window !== "undefined") {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return theme === "dark" ? "dark" : "light";
  }
  return "light";
}

export function setTheme(theme: "light" | "dark"): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
}

export function clearAllData(): void {
  if (typeof window !== "undefined") {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}

export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function calculateWHtR(waist: number, height: number): number {
  return Math.round((waist / height) * 100) / 100;
}

export function getHealthRisk(bmi: number, whtr: number): { risk: string; color: string } {
  if (whtr > 0.6) return { risk: "HIGH", color: "text-red-500" };
  if (whtr > 0.5) return { risk: "MODERATE", color: "text-amber-500" };
  if (bmi >= 30) return { risk: "HIGH", color: "text-red-500" };
  if (bmi >= 25) return { risk: "MODERATE", color: "text-amber-500" };
  return { risk: "HEALTHY", color: "text-emerald-500" };
}

export function calculateCurrentDay(startDate: string): number {
  const start = new Date(startDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(diffDays + 1, 365);
}
