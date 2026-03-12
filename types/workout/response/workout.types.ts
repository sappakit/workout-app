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

export interface WorkoutExerciseItem {
  id: number;

  orderIndex: number;

  plannedSets: number | null;
  plannedRepsRange: string | null;
  plannedWeight: number | null;
  plannedRestTime: number | null;
  plannedDuration: number | null;
  plannedDistance: number | null;

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
