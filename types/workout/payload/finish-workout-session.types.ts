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
  startedAt: string | null;
  completedAt: string | null;
  isSkipped: boolean;
  sets: FinishWorkoutSessionSetPayload[];
}

export interface FinishWorkoutSessionPayload {
  endedAt: string | null;
  totalDuration: number | null;
  caloriesBurned: number | null;
  sessionExercises: FinishWorkoutSessionExercisePayload[];
}
