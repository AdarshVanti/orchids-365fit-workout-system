export type Gender = "male" | "female" | "other";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type Location = "gym" | "home";
export type Goal = "muscle_gain" | "fat_loss" | "strength" | "endurance" | "flexibility" | "general_fitness" | "sports_performance";
export type ActivityLevel = "sedentary" | "moderate" | "very_active";
export type Diet = "vegetarian" | "vegan" | "non_vegetarian";
export type HealthCondition = "knee_pain" | "back_pain" | "shoulder_pain" | "asthma" | "heart_condition" | "diabetes" | "gerd" | "none";
export type HomeEquipment = "bodyweight" | "dumbbells" | "resistance_bands" | "pull_up_bar" | "bench" | "barbell";

export interface ApiKeys {
  openai?: string;
  gemini?: string;
  claude?: string;
  grok?: string;
  llama?: string;
}

export type TodoCategory = "medicine" | "supplement" | "book" | "task" | "other";

export interface TodoItem {
  id: string;
  text: string;
  category: TodoCategory;
  completed: boolean;
  recurring: boolean;
  reminderTime?: string;
}

export interface UserProfile {
  height: number;
  weight: number;
  age: number;
  gender: Gender;
  bmi: number;
  waist?: number;
  whtr?: number;
  experience: ExperienceLevel;
  location: Location;
  homeEquipment: HomeEquipment[];
  goals: Goal[];
  lifestyle: {
    playsSports: boolean;
    sport?: string;
    activityLevel: ActivityLevel;
    workingHours: number;
    sleepHours: number;
  };
  diet: Diet;
  healthConditions: HealthCondition[];
  apiKeys?: ApiKeys;
}

export interface SelectedPlan {
  planId: string;
  startDate: string;
  currentDay: number;
}

export interface UserData {
  userId: string;
  email: string;
  profile: UserProfile;
  selectedPlan: SelectedPlan;
  createdAt: string;
  lastSync: string;
  todos: TodoItem[];
}

export interface ExerciseSet {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface ExerciseProgress {
  name: string;
  completed: boolean;
  sets: ExerciseSet[];
}

export interface DailyHabits {
  workout: boolean;
  sleep: boolean;
  protein: boolean;
  healthyEating: boolean;
  water: boolean;
}

export interface Vitals {
  heartRate: number;
  restingHR: number;
  hrv: number;
  respiratoryRate: number;
  bloodOxygen: number;
  skinTemp: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
}

export interface SleepData {
  score: number;
  performance: number;
  debt: number;
  consistency: number;
  stages: {
    light: number;
    deep: number;
    rem: number;
    awake: number;
  };
  duration: number;
  efficiency: number;
}

export interface LongevityMetrics {
  physiologicalAge: number;
  paceOfAging: number;
  vo2Max: number;
  biomarkers: {
    glucose?: number;
    cholesterol?: number;
    hba1c?: number;
    hscrp?: number;
  };
}

export interface JournalEntry {
  id: string;
  category: string;
  value: string | number | boolean;
  timestamp: string;
}

export interface DailyProgress {
  day: number;
  planDay: string;
  completed: boolean;
  completedAt?: string;
  exercises: ExerciseProgress[];
  habits: DailyHabits;
  todos?: TodoItem[];
  duration: number;
  notes?: string;
  recovery?: number;
  sleep?: SleepData;
  strain?: number;
  stress?: number;
  vitals?: Vitals;
  longevity?: LongevityMetrics;
  journal?: JournalEntry[];
}

export interface WarmupExercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
  instructions: string;
}

export interface ExerciseAlternative {
  name: string;
  equipment?: string[];
  reason: string;
  adjustment?: string;
  note?: string;
}

export interface Exercise {
  order: number;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  intensity: string;
  equipment: string[];
  primaryMuscle: string;
  secondaryMuscles?: string[];
  type?: string;
  instructions: string[];
  formTips: string[];
  commonMistakes: string[];
  alternatives: {
    beginner?: ExerciseAlternative;
    home?: ExerciseAlternative;
    injury_shoulder?: ExerciseAlternative;
    injury_back?: ExerciseAlternative;
    injury_knee?: ExerciseAlternative;
  };
  progressionNotes?: {
    [key: string]: string;
  };
  videoId?: string;
  imageId?: string;
  images?: string[];
}

export interface CooldownExercise {
  name: string;
  duration: string;
  instructions: string;
}

export interface CardioSession {
  optional: boolean;
  type: string;
  duration: string;
  timing: string;
  options: string[];
  intensityLevel: string;
  note: string;
}

export interface WorkoutTips {
  motivation: string;
  nutrition: string;
  hydration: string;
  recovery: string;
  mindset: string;
  nextDay: string;
}

export interface SafetyNote {
  condition: string;
  note?: string;
  warning?: string;
  modification?: string;
}

export interface WorkoutDay {
  day: number;
  planId: string;
  phase: string;
  week: number;
  split: string;
  targetMuscles: string[];
  warmup: {
    duration: string;
    exercises: WarmupExercise[];
  };
  mainWorkout: Exercise[];
  cooldown: {
    duration: string;
    exercises: CooldownExercise[];
  };
  cardio?: CardioSession;
  tips: WorkoutTips;
  safetyNotes: SafetyNote[];
  estimatedDuration: {
    warmup: number;
    workout: number;
    cooldown: number;
    total: string;
  };
  difficultyRating: number;
  caloriesBurned: string;
  equipmentNeeded: string[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  location: Location;
  experience: ExperienceLevel;
  goal: Goal;
  split: string;
  daysPerWeek: number;
  totalDays: number;
  phases: {
    name: string;
    startDay: number;
    endDay: number;
    focus: string;
  }[];
}

export interface WorkoutHistory {
  totalWorkouts: number;
  totalMissed: number;
  currentStreak: number;
  longestStreak: number;
  totalVolume: number;
  favoriteExercises: string[];
  personalRecords: {
    [exercise: string]: {
      weight: number;
      date: string;
    };
  };
}

export interface BodyMetric {
  date: string;
  weight: number;
  bodyFat?: number;
  bmi: number;
  measurements?: {
    chest?: number;
    waist?: number;
    arms?: number;
    thighs?: number;
  };
}

export interface OnboardingData {
  step: number;
  height?: number;
  weight?: number;
  age?: number;
  gender?: Gender;
  waist?: number;
  experience?: ExperienceLevel;
  location?: Location;
  homeEquipment?: HomeEquipment[];
  goals?: Goal[];
  playsSports?: boolean;
  sport?: string;
  activityLevel?: ActivityLevel;
  workingHours?: number;
  sleepHours?: number;
  diet?: Diet;
  healthConditions?: HealthCondition[];
}
