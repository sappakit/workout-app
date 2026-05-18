import { WorkoutSetValue } from "../response/workout.types";

export interface UpdateWorkoutExerciseSetPayload extends WorkoutSetValue {
  id: number | null;
  setNumber: number;
}

export interface UpdateWorkoutExercisePayload {
  id: number | null;
  orderIndex: number;
  restTime: number | null;
  exerciseId: number;
  sets: UpdateWorkoutExerciseSetPayload[];
}

export interface UpdateWorkoutPayload {
  name: string;
  workoutFocusTypeId: number | null;
  targetMuscles: number[];
  duration: number;
  workoutExercises: UpdateWorkoutExercisePayload[];
}
