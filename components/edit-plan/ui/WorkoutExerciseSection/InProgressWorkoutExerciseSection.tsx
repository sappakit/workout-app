import { getExerciseProgressText } from "@/components/workout-in-progress/model/helpers";
import { ExerciseFieldKey } from "@/lib/workout/config";
import {
  WorkoutSessionExerciseModel,
  WorkoutSessionExerciseSetModel,
} from "@/types/workout/model/workout.types";
import { useMemo } from "react";
import { BaseWorkoutExerciseSection } from "./base/BaseWorkoutExerciseSection";
import {
  getWorkoutSetColumns,
  WorkoutSetColumn,
  WorkoutSetDoneCheckbox,
  WorkoutSetHeader,
  WorkoutSetInput,
  WorkoutSetRow,
} from "./base/WorkoutSetTable";

interface InProgressWorkoutExerciseSectionProps {
  exercise: WorkoutSessionExerciseModel;
  onAddSet: () => void;
  onDeleteExercise: () => void;
  onReplaceExercise: () => void;
  onDeleteSet: (setClientId: string) => void;
  onToggleSetCompleted: (setClientId: string) => void;
  onChangeSetValue: (
    setClientId: string,
    field: ExerciseFieldKey,
    value: number | null,
  ) => void;
  onChangeRestTime: (value: number) => void;
}

export function InProgressWorkoutExerciseSection({
  exercise,
  onAddSet,
  onDeleteExercise,
  onReplaceExercise,
  onDeleteSet,
  onToggleSetCompleted,
  onChangeSetValue,
  onChangeRestTime,
}: InProgressWorkoutExerciseSectionProps) {
  const columns = useMemo<WorkoutSetColumn[]>(() => {
    return getWorkoutSetColumns(exercise.exercise.exerciseType);
  }, [exercise.exercise.exerciseType]);

  return (
    <BaseWorkoutExerciseSection
      exerciseName={exercise.exercise.name}
      subtitle={getExerciseProgressText(exercise)}
      sets={exercise.sets}
      restTime={exercise.restTime ?? 0}
      onChangeRestTime={onChangeRestTime}
      onAddSet={onAddSet}
      onDeleteExercise={onDeleteExercise}
      onReplaceExercise={onReplaceExercise}
      emptyDescription='Tap "Add Set" to start tracking'
      renderSetHeader={() => (
        <WorkoutSetHeader columns={columns} trailingHeaderLabel="DONE" />
      )}
      renderSetRow={(setItem) => (
        <WorkoutSetRow
          setNumber={setItem.setNumber}
          columns={columns}
          onDelete={() => onDeleteSet(setItem.clientId)}
          renderInput={(column) => (
            <WorkoutSetInput
              value={getWorkoutSessionSetValue(setItem, column.key)}
              onChange={(value) =>
                onChangeSetValue(setItem.clientId, column.key, value)
              }
              placeholder={column.placeholder}
              allowDecimal={column.allowDecimal}
              min={column.min}
              max={column.max}
            />
          )}
          renderTrailingCell={() => (
            <WorkoutSetDoneCheckbox
              checked={!!setItem.completedAt}
              onPress={() => onToggleSetCompleted(setItem.clientId)}
            />
          )}
        />
      )}
    />
  );
}

function getWorkoutSessionSetValue(
  set: WorkoutSessionExerciseSetModel,
  field: ExerciseFieldKey,
): number | null {
  switch (field) {
    case "weight":
      return set.weight ?? null;

    case "reps":
      return set.reps ?? null;

    case "distance":
      return set.distance ?? null;

    case "duration":
      return set.duration ?? null;

    default:
      return null;
  }
}
