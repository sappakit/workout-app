export interface UpdateWorkoutExercisePayload {
  id: number | null;
  orderIndex: number;
  plannedSets: number | null;
  plannedRepsRange: string | null;
  plannedWeight: number | null;
  plannedRestTime: number | null;
  plannedDuration: number | null;
  plannedDistance: number | null;
  exerciseId: number;
}

export interface UpdateWorkoutPayload {
  name: string;
  workoutFocusTypeId: number | null;
  targetMuscles: number[];
  duration: number;
  workoutExercises: UpdateWorkoutExercisePayload[];
}
