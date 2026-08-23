import { Exercise } from "../response/exercise.types";
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
  "id" | "exercise" | "sets"
> {
  id: number | null;
  clientId: string;

  exercise: Exercise;
  sets: WorkoutSessionExerciseSetModel[];
}

export interface WorkoutSessionModel extends Omit<
  WorkoutSession,
  "sessionExercises"
> {
  sessionExercises: WorkoutSessionExerciseModel[];
}
