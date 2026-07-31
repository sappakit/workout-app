import { Exercise } from "../response/exercise.types";
import {
  WorkoutExerciseItem,
  WorkoutExerciseSet,
} from "../response/workout.types";

export interface WorkoutExerciseSetModel extends Omit<
  WorkoutExerciseSet,
  "id"
> {
  id: number | null;
  clientId: string;
}

export interface WorkoutExerciseItemModel extends Omit<
  WorkoutExerciseItem,
  "id" | "exercise" | "sets"
> {
  id: number | null;
  clientId: string;
  exercise: Exercise;
  sets: WorkoutExerciseSetModel[];
}
