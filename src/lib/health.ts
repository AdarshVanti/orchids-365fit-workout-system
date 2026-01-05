import { DailyProgress, Vitals, SleepData, LongevityMetrics } from "./types";

export function generateMockVitals(): Vitals {
  return {
    heartRate: Math.floor(Math.random() * (160 - 60 + 1)) + 60,
    restingHR: Math.floor(Math.random() * (65 - 45 + 1)) + 45,
    hrv: Math.floor(Math.random() * (120 - 40 + 1)) + 40,
    respiratoryRate: Math.floor(Math.random() * (20 - 12 + 1)) + 12,
    bloodOxygen: Math.floor(Math.random() * (100 - 95 + 1)) + 95,
    skinTemp: 36.5 + Math.random() * 0.5,
    bloodPressure: {
      systolic: Math.floor(Math.random() * (130 - 110 + 1)) + 110,
      diastolic: Math.floor(Math.random() * (85 - 70 + 1)) + 70,
    }
  };
}

export function generateMockSleep(): SleepData {
  return {
    score: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
    performance: Math.floor(Math.random() * (100 - 70 + 1)) + 70,
    debt: Math.random() * 2,
    consistency: Math.floor(Math.random() * (100 - 80 + 1)) + 80,
    stages: {
      light: 4 * 60,
      deep: 1.5 * 60,
      rem: 2 * 60,
      awake: 0.5 * 60,
    },
    duration: 8 * 60,
    efficiency: Math.floor(Math.random() * (100 - 85 + 1)) + 85,
  };
}

export function generateMockLongevity(age: number): LongevityMetrics {
  return {
    physiologicalAge: age - (Math.random() * 5),
    paceOfAging: 0.8 + Math.random() * 0.4,
    vo2Max: Math.floor(Math.random() * (60 - 35 + 1)) + 35,
    biomarkers: {
      glucose: 90 + Math.random() * 10,
      cholesterol: 180 + Math.random() * 20,
      hba1c: 5.1 + Math.random() * 0.5,
      hscrp: 0.5 + Math.random() * 1.0,
    }
  };
}

export function calculateRecovery(vitals: Vitals, sleep: SleepData): number {
  // Simple heuristic for recovery based on HRV, RHR, and Sleep
  const hrvFactor = Math.min(vitals.hrv / 100, 1);
  const rhrFactor = Math.max(0, 1 - (vitals.restingHR - 45) / 30);
  const sleepFactor = sleep.score / 100;
  
  return Math.round((hrvFactor * 0.4 + rhrFactor * 0.3 + sleepFactor * 0.3) * 100);
}

export function calculateStrain(duration: number, avgHR: number, maxHR: number): number {
  // Simple strain calculation 0-21
  const hrIntensity = (avgHR - 60) / (maxHR - 60);
  const durationFactor = Math.min(duration / 120, 1);
  return Math.min(Math.round(hrIntensity * 15 + durationFactor * 6 * 10) / 10, 21);
}

export function getStressLevel(hr: number, hrv: number): number {
  // 0-3 scale
  if (hrv > 80 && hr < 70) return Math.random() * 0.5; // Low
  if (hrv < 40 || hr > 100) return 2 + Math.random(); // High
  return 1 + Math.random(); // Moderate
}
