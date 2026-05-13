import {
  WorkoutSession,
  WorkoutSessionExercise,
  WorkoutSessionExerciseSet,
} from "../response/workout.types";

export interface WorkoutSessionExerciseSetModel extends Omit<
  WorkoutSessionExerciseSet,
  "id"
> {
  id: number | null;
  clientId: string;
}

export interface WorkoutSessionExerciseModel extends Omit<
  WorkoutSessionExercise,
  "id" | "sets"
> {
  id: number | null;
  clientId: string;
  sets: WorkoutSessionExerciseSetModel[];
}

export interface WorkoutSessionModel extends Omit<
  WorkoutSession,
  "sessionExercises"
> {
  sessionExercises: WorkoutSessionExerciseModel[];
}
