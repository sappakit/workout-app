import { ExerciseFieldKey } from "@/lib/workout/config";
import {
  WorkoutExerciseItem,
  WorkoutExerciseSet,
} from "@/types/workout/response/workout.types";
import { useMemo } from "react";
import { BaseWorkoutExerciseSection } from "./base/BaseWorkoutExerciseSection";
import {
  getWorkoutSetColumns,
  WorkoutSetColumn,
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
  exercise,
}: DisplayWorkoutExerciseSectionProps) {
  const columns = useMemo<WorkoutSetColumn[]>(() => {
    return getWorkoutSetColumns(exercise.exercise.exerciseType);
  }, [exercise.exercise.exerciseType]);

  const sets = useMemo<DisplayWorkoutExerciseSet[]>(() => {
    return exercise.sets.map((set) => ({
      ...set,
      clientId: String(set.id),
    }));
  }, [exercise.sets]);

  return (
    <BaseWorkoutExerciseSection
      mode="readonly"
      exerciseId={exercise.exercise.id}
      exerciseName={exercise.exercise.name}
      subtitle={`${exercise.sets.length} ${
        exercise.sets.length === 1 ? "set" : "sets"
      }`}
      imageUrl={exercise.exercise.imageUrl}
      sets={sets}
      restTime={exercise.restTime ?? 0}
      emptyTitle="No sets"
      emptyDescription="This exercise has no planned sets."
      renderSetHeader={() => (
        <WorkoutSetHeader columns={columns} trailingHeaderLabel="" />
      )}
      renderSetRow={(setItem) => (
        <WorkoutSetRow
          setNumber={setItem.setNumber}
          columns={columns}
          onDelete={undefined}
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
