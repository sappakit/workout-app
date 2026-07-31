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

  // References the original workout-plan set; null if added during the session.
  workoutExerciseSetId: number | null;
}

export interface WorkoutSessionExerciseModel extends Omit<
  WorkoutSessionExercise,
  "id" | "exercise" | "sets"
> {
  id: number | null;
  clientId: string;

  // References the original workout-plan exercise; null if added during the session.
  workoutExerciseId: number | null;

  exercise: Exercise;
  sets: WorkoutSessionExerciseSetModel[];
}

export interface WorkoutSessionModel extends Omit<
  WorkoutSession,
  "sessionExercises"
> {
  sessionExercises: WorkoutSessionExerciseModel[];
}
