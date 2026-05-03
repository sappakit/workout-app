interface FinishWorkoutSessionSetPayload {
  id: number | null;
  setNumber: number;
  reps: number | null;
  weight: number | null;
  distance: number | null;
  duration: number | null;
  performedAt: string | null;
  completedAt: string | null;
}

interface FinishWorkoutSessionExercisePayload {
  id: number | null;
  exerciseId: number;
  orderIndex: number;
  completedAt: string | null;
  sets: FinishWorkoutSessionSetPayload[];
}

export interface FinishWorkoutSessionPayload {
  endedAt: string;
  totalDuration: number | null;
  totalPausedDuration: number;
  caloriesBurned: number | null;
  sessionExercises: FinishWorkoutSessionExercisePayload[];
}
