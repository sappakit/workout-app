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
  UNASSIGNED = "unassigned",
}

export enum WorkoutProgressOverviewType {
  WEEKLY = "weekly",
  YEARLY = "yearly",
  ALL_TIME = "all_time",
}

export enum WorkoutWeeklyPlanDayType {
  WORKOUT = "workout",
  REST = "rest",
  UNASSIGNED = "unassigned",
}

export interface WorkoutSetValue {
  reps: number | null;
  weight: number | null;
  distance: number | null;
  duration: number | null;
}

export interface WorkoutExerciseSet extends WorkoutSetValue {
  id: number;
  setNumber: number;
}

export interface WorkoutExerciseItem {
  id: number;
  orderIndex: number;
  restTime: number | null;

  exercise?: Exercise;
  sets?: WorkoutExerciseSet[];
}

export interface WorkoutMuscleItem {
  id: number;
  muscle?: Muscle;
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

  workoutExercises?: WorkoutExerciseItem[];
  muscles?: WorkoutMuscleItem[];
  workoutFocusType?: WorkoutFocusType | null;
}

export interface WorkoutSchedule {
  id: number;
  scheduledDate: string; // ISO string from backend
  status: WorkoutScheduleStatus;

  workout?: WorkoutResponse;
}

export interface WorkoutSessionExerciseSet extends WorkoutSetValue {
  id: number;
  setNumber: number;
  performedAt: string | null;
  completedAt: string | null;
}

export interface WorkoutSessionExercise {
  id: number;
  orderIndex: number;
  restTime: number | null;
  completedAt: string | null;

  exercise?: Exercise;
  sets?: WorkoutSessionExerciseSet[];
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

  workout?: WorkoutResponse | null;
  sessionExercises?: WorkoutSessionExercise[];
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
  hasCompletedWorkoutToday: boolean;
}

export interface WorkoutProgressSummary {
  workoutsCompleted: number;
  totalVolumeKg: number;
  completedSets: number;
  totalReps: number;
  totalDurationSeconds: number;
}

export interface WorkoutProgressVolumeTrendItem {
  label: string;
  volumeKg: number;
}

export interface WorkoutProgressBestPerformance {
  exerciseId: number;
  exerciseName: string;
  exerciseImageUrl: string | null;

  bestWeightKg: number;
  bestSetVolumeKg: number;
  bestSetLabel: string;

  completedAt: string | null;
  setCompletedAt: string | null;
}

export interface WorkoutProgressOverview {
  type: WorkoutProgressOverviewType;
  startDate: string;
  endDate: string;

  summary: WorkoutProgressSummary;
  volumeTrend: WorkoutProgressVolumeTrendItem[];
  bestPerformances: WorkoutProgressBestPerformance[];
}

export interface WorkoutTodayOverview {
  todayPlanType: WorkoutWeeklyPlanDayType;
  schedule: WorkoutSchedule | null;
  hasCompletedWorkoutToday: boolean;
}

export interface WorkoutWeeklyPlanDay {
  id: number | null;
  dayOfWeek: number;
  dayType: WorkoutWeeklyPlanDayType;

  workout: WorkoutResponse | null;
}

export interface WorkoutWeeklyPlan {
  days: WorkoutWeeklyPlanDay[];
}
