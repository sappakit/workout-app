import type { ExerciseFieldKey } from "@/lib/workout/config";
import { getExercisePrimaryImageUrl } from "@/lib/workout/utils";
import {
  requireWorkoutExercise,
  requireWorkoutExerciseSets,
} from "@/lib/workout/utils/response-guards.utils";
import type {
  WorkoutExerciseItem,
  WorkoutExerciseSet,
} from "@/types/workout/response/workout.types";
import { useMemo } from "react";
import { BaseWorkoutExerciseSection } from "./base/BaseWorkoutExerciseSection";
import {
  getWorkoutSetColumns,
  type WorkoutSetColumn,
  WorkoutSetHeader,
  WorkoutSetRow,
  WorkoutSetValueText,
} from "./base/WorkoutSetTable";

interface DisplayWorkoutExerciseSectionProps {
  exercise: WorkoutExerciseItem;
}

type DisplayWorkoutExerciseSet = WorkoutExerciseSet & {
  clientId: string;
};

export function DisplayWorkoutExerciseSection({
  exercise: workoutExercise,
}: DisplayWorkoutExerciseSectionProps) {
  const exercise = requireWorkoutExercise(workoutExercise);
  const workoutExerciseSets = requireWorkoutExerciseSets(workoutExercise);

  const trackingTypeCode = exercise.trackingType?.code;
  const imageUrl = getExercisePrimaryImageUrl(exercise);

  const columns = useMemo<WorkoutSetColumn[]>(() => {
    return getWorkoutSetColumns(trackingTypeCode);
  }, [trackingTypeCode]);

  const sets = useMemo<DisplayWorkoutExerciseSet[]>(() => {
    return workoutExerciseSets.map((set) => ({
      ...set,
      clientId: String(set.id),
    }));
  }, [workoutExerciseSets]);

  return (
    <BaseWorkoutExerciseSection
      mode="readonly"
      exerciseId={exercise.id}
      exerciseName={exercise.name}
      subtitle={`${sets.length} ${sets.length === 1 ? "set" : "sets"}`}
      imageUrl={imageUrl}
      sets={sets}
      restTime={workoutExercise.restTime ?? 0}
      emptyTitle="No sets"
      emptyDescription="This exercise has no planned sets."
      renderSetHeader={() => <WorkoutSetHeader columns={columns} />}
      renderSetRow={(setItem) => (
        <WorkoutSetRow
          setNumber={setItem.setNumber}
          columns={columns}
          renderInput={(column) => {
            const value = getWorkoutExerciseSetValue(setItem, column.key);

            return <WorkoutSetValueText value={value} />;
          }}
        />
      )}
    />
  );
}

function getWorkoutExerciseSetValue(
  set: WorkoutExerciseSet,
  field: ExerciseFieldKey,
): number | null {
  return set[field] ?? null;
}
