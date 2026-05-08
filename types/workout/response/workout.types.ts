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

interface PlannedWorkoutExerciseConfig {
  plannedSets: number | null;
  plannedRepsRange: string | null;
  plannedWeight: number | null;
  plannedRestTime: number | null;
  plannedDuration: number | null;
  plannedDistance: number | null;
}

export interface WorkoutExerciseItem extends PlannedWorkoutExerciseConfig {
  id: number | null;
  orderIndex: number;
  exercise: Exercise;
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
  description: string;
  duration: number;

  workoutExercises: WorkoutExerciseItem[];
  muscles: WorkoutMuscleItem[];
  workoutFocusType: WorkoutFocusType;
}

export interface WorkoutSchedule {
  id: number;
  scheduledDate: string; // ISO string from backend
  status: WorkoutScheduleStatus;
  workout: WorkoutResponse;
}

export interface WorkoutSessionExerciseSet {
  id: number;
  setNumber: number;
  reps: number | null;
  weight: number | null;
  distance: number | null;
  duration: number | null; // seconds
  performedAt: string | null;
  completedAt: string | null;
}

export interface WorkoutSessionExercise extends PlannedWorkoutExerciseConfig {
  id: number;
  orderIndex: number;
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
  workout: WorkoutResponse;
  sessionExercises: WorkoutSessionExercise[];
}

export interface WorkoutCurrent {
  mode: WorkoutCurrentMode;
  session: WorkoutSession | null;
  schedule: WorkoutSchedule | null;
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
