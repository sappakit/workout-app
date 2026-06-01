import {
  getExerciseProgressText,
  getPreviousSetValue,
  getWorkoutSessionSetValue,
} from "@/components/workout-in-progress/model/helpers";
import { ExerciseFieldKey } from "@/lib/workout/config";
import { WorkoutSessionExerciseModel } from "@/types/workout/model/workout.types";
import { ExercisePerformanceSummary } from "@/types/workout/response/workout.types";
import { useMemo, useState } from "react";
import { BaseWorkoutExerciseSection } from "./base/BaseWorkoutExerciseSection";
import {
  getWorkoutSetColumns,
  SetPerformanceMode,
  WorkoutSetColumn,
  WorkoutSetDoneCheckbox,
  WorkoutSetHeader,
  WorkoutSetInput,
  WorkoutSetPerformanceText,
  WorkoutSetRow,
} from "./base/WorkoutSetTable";

interface InProgressWorkoutExerciseSectionProps {
  exercise: WorkoutSessionExerciseModel;
  performanceSummary?: ExercisePerformanceSummary;
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
  performanceSummary,
  onAddSet,
  onDeleteExercise,
  onReplaceExercise,
  onDeleteSet,
  onToggleSetCompleted,
  onChangeSetValue,
  onChangeRestTime,
}: InProgressWorkoutExerciseSectionProps) {
  const [performanceMode, setPerformanceMode] =
    useState<SetPerformanceMode>("previous");

  const columns = useMemo<WorkoutSetColumn[]>(() => {
    return getWorkoutSetColumns(exercise.exercise.exerciseType);
  }, [exercise.exercise.exerciseType]);

  const handleTogglePerformanceMode = () => {
    setPerformanceMode((prev) => (prev === "previous" ? "best" : "previous"));
  };

  return (
    <BaseWorkoutExerciseSection
      exerciseName={exercise.exercise.name}
      subtitle={getExerciseProgressText(exercise)}
      imageUrl={exercise.exercise.imageUrl}
      sets={exercise.sets}
      restTime={exercise.restTime ?? 0}
      onChangeRestTime={onChangeRestTime}
      onAddSet={onAddSet}
      onDeleteExercise={onDeleteExercise}
      onReplaceExercise={onReplaceExercise}
      emptyDescription='Tap "Add Set" to start tracking'
      renderSetHeader={() => (
        <WorkoutSetHeader
          columns={columns}
          performanceMode={performanceMode}
          onTogglePerformanceMode={handleTogglePerformanceMode}
          trailingHeaderLabel="DONE"
        />
      )}
      renderSetRow={(setItem, index) => (
        <WorkoutSetRow
          setNumber={setItem.setNumber}
          columns={columns}
          onDelete={() => onDeleteSet(setItem.clientId)}
          renderPerformanceCell={() => (
            <WorkoutSetPerformanceText
              value={getSetPerformanceText({
                mode: performanceMode,
                setNumber: setItem.setNumber,
                performanceSummary,
              })}
            />
          )}
          renderInput={(column) => {
            const value = getWorkoutSessionSetValue(setItem, column.key);

            const previousValue = getPreviousSetValue({
              sets: exercise.sets,
              currentIndex: index,
              field: column.key,
            });

            const placeholder =
              previousValue != null
                ? String(previousValue)
                : column.placeholder;

            return (
              <WorkoutSetInput
                value={value}
                onChange={(value) =>
                  onChangeSetValue(setItem.clientId, column.key, value)
                }
                placeholder={placeholder}
                allowDecimal={column.allowDecimal}
                min={column.min}
                max={column.max}
              />
            );
          }}
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

function getSetPerformanceText({
  mode,
  setNumber,
  performanceSummary,
}: {
  mode: SetPerformanceMode;
  setNumber: number;
  performanceSummary?: ExercisePerformanceSummary;
}) {
  const performanceSets =
    mode === "previous"
      ? performanceSummary?.previousSets
      : performanceSummary?.bestSets;

  const performanceSet = performanceSets?.find(
    (item) => item.setNumber === setNumber,
  );

  if (!performanceSet) {
    return "-";
  }

  return formatSetPerformanceText(performanceSet);
}

function formatSetPerformanceText(set: {
  weight: number | null;
  reps: number | null;
  distance: number | null;
  duration: number | null;
}) {
  if (set.weight != null && set.reps != null) {
    return `${formatNumber(set.weight)} x ${set.reps}`;
  }

  if (set.reps != null) {
    return `${set.reps} reps`;
  }

  if (set.distance != null) {
    return `${formatNumber(set.distance)} km`;
  }

  if (set.duration != null) {
    return formatDuration(set.duration);
  }

  return "-";
}

function formatNumber(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : String(Number(value).toFixed(1));
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}
