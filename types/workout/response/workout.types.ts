import { Exercise } from "./exercise.types";
import { Muscle } from "./shared.types";

export enum WorkoutScheduleStatus {
  PLANNED = "planned",
  SKIPPED = "skipped",
  COMPLETED = "completed",
}

export enum WorkoutSessionStatus {
  ACTIVE = "active",
  PAUSED = "paused",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum WorkoutCurrentMode {
  IN_PROGRESS = "in_progress",
  SCHEDULED = "scheduled",
  REST_DAY = "rest_day",
}

export enum WorkoutProgressOverviewType {
  WEEKLY = "weekly",
  YEARLY = "yearly",
  ALL_TIME = "all_time",
}

export interface WorkoutSetValue {
  reps: number | null;
  weight: number | null;
  distance: number | null;
  duration: number | null; // seconds
}

export interface WorkoutExerciseSet extends WorkoutSetValue {
  id: number | null;
  setNumber: number;
}

export interface WorkoutExerciseItem {
  id: number | null;
  orderIndex: number;
  restTime: number | null; // seconds
  exercise: Exercise;
  sets: WorkoutExerciseSet[];
}

export interface WorkoutMuscleItem {
  id: number;
  muscle: Muscle;
}

export interface WorkoutFocusType {
  id: number;
  code: string;
  name: string;
}

export interface WorkoutResponse {
  id: number;
  name: string;
  imageUrl: string | null;
  description: string | null;
  duration: number | null;

  workoutExercises: WorkoutExerciseItem[];
  muscles: WorkoutMuscleItem[];
  workoutFocusType: WorkoutFocusType | null;
}

export interface WorkoutSchedule {
  id: number;
  scheduledDate: string; // ISO string from backend
  status: WorkoutScheduleStatus;
  workout: WorkoutResponse;
}

export interface WorkoutSessionExerciseSet extends WorkoutSetValue {
  id: number | null;
  workoutExerciseSetId?: number | null;
  setNumber: number;
  performedAt: string | null;
  completedAt: string | null;
}

export interface WorkoutSessionExercise {
  id: number | null;
  workoutExerciseId?: number | null;
  orderIndex: number;
  restTime: number | null; // seconds
  completedAt: string | null;
  exercise: Exercise;
  sets: WorkoutSessionExerciseSet[];
}

export interface WorkoutSession {
  id: number;
  status: WorkoutSessionStatus;
  startedAt: string | null;
  pausedAt: string | null;
  endedAt: string | null;
  totalPausedDuration: number;
  totalDuration: number | null;
  caloriesBurned: number | null;
  workout: WorkoutResponse | null;
  sessionExercises: WorkoutSessionExercise[];
}

export interface WorkoutSetPerformance {
  setNumber: number;
  weight: number | null;
  reps: number | null;
  distance: number | null;
  duration: number | null;
}

export interface ExercisePerformanceSummary {
  previousSets: WorkoutSetPerformance[];
  bestSets: WorkoutSetPerformance[];
}

export interface WorkoutCurrent {
  mode: WorkoutCurrentMode;
  session: WorkoutSession | null;
  schedule: WorkoutSchedule | null;
  performanceByExerciseId: Record<string, ExercisePerformanceSummary>;
}

export interface WorkoutProgressSummary {
  workoutsCompleted: number;
  totalVolumeKg: number;
  completedSets: number;
  totalDurationSeconds: number;
}

export interface WorkoutProgressVolumeTrendItem {
  label: string;
  volumeKg: number;
}

export interface WorkoutProgressBestPerformance {
  exerciseName: string;
  bestWeightKg: number;
  bestSetVolumeKg: number;
  bestSetLabel: string;
}

export interface WorkoutProgressOverview {
  type: WorkoutProgressOverviewType;
  startDate: string;
  endDate: string;
  summary: WorkoutProgressSummary;
  volumeTrend: WorkoutProgressVolumeTrendItem[];
  bestPerformances: WorkoutProgressBestPerformance[];
}
