import { createEmptyWorkoutExerciseFormSet } from "@/lib/workout/mappers";
import { getExercisePrimaryImageUrl } from "@/lib/workout/utils";
import type { EditPlanForm } from "@/schemas/edit-plan.schema";
import { useMemo } from "react";
import {
  Controller,
  type UseFormReturn,
  useFormState,
  useWatch,
} from "react-hook-form";
import { BaseWorkoutExerciseSection } from "./base/BaseWorkoutExerciseSection";
import {
  getWorkoutSetColumns,
  type WorkoutSetColumn,
  WorkoutSetHeader,
  WorkoutSetInput,
  WorkoutSetRow,
} from "./base/WorkoutSetTable";

type PlanWorkoutExerciseSectionProps = {
  form: UseFormReturn<EditPlanForm>;
  index: number;
  onDeleteExercise: () => void;
  onReplaceExercise: () => void;
};

export function PlanWorkoutExerciseSection({
  form,
  index,
  onDeleteExercise,
  onReplaceExercise,
}: PlanWorkoutExerciseSectionProps) {
  const { control, getValues, setValue, trigger } = form;

  const { errors } = useFormState({
    control,
  });

  const exercise = useWatch({
    control,
    name: `workoutExercises.${index}`,
  });

  const setsErrorMessage =
    errors.workoutExercises?.[index]?.sets?.root?.message;

  const trackingTypeCode = exercise?.exercise.trackingType?.code;

  const columns = useMemo<WorkoutSetColumn[]>(() => {
    if (!exercise) {
      return [];
    }

    return getWorkoutSetColumns(trackingTypeCode);
  }, [exercise, trackingTypeCode]);

  if (!exercise) {
    return null;
  }

  const imageUrl = getExercisePrimaryImageUrl(exercise.exercise);

  const handleChangeRestTime = (seconds: number) => {
    setValue(`workoutExercises.${index}.restTime`, seconds, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleAddSet = async () => {
    const setsPath = `workoutExercises.${index}.sets` as const;

    const currentSets = getValues(setsPath) ?? [];
    const nextSetNumber = currentSets.length + 1;

    setValue(
      setsPath,
      [...currentSets, createEmptyWorkoutExerciseFormSet(nextSetNumber)],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    // Revalidate the nested sets array so sets.root.message is recalculated.
    await trigger(setsPath);
  };

  const handleDeleteSet = async (targetClientId: string) => {
    const setsPath = `workoutExercises.${index}.sets` as const;

    const currentSets = getValues(setsPath) ?? [];

    const nextSets = currentSets
      .filter((set) => set.clientId !== targetClientId)
      .map((set, setIndex) => ({
        ...set,
        setNumber: setIndex + 1,
      }));

    setValue(setsPath, nextSets, {
      shouldDirty: true,
      shouldValidate: true,
    });

    await trigger(setsPath);
  };

  return (
    <BaseWorkoutExerciseSection
      exerciseId={exercise.exercise.id}
      exerciseName={exercise.exercise.name}
      subtitle={`${exercise.sets.length} ${
        exercise.sets.length === 1 ? "set" : "sets"
      }`}
      imageUrl={imageUrl}
      sets={exercise.sets}
      restTime={exercise.restTime ?? 0}
      errorMessage={setsErrorMessage}
      onChangeRestTime={handleChangeRestTime}
      onAddSet={handleAddSet}
      onDeleteExercise={onDeleteExercise}
      onReplaceExercise={onReplaceExercise}
      emptyDescription='Tap "Add Set" to start planning'
      renderSetHeader={() => <WorkoutSetHeader columns={columns} />}
      renderSetRow={(setItem, setIndex) => (
        <WorkoutSetRow
          setNumber={setItem.setNumber}
          columns={columns}
          onDelete={() => handleDeleteSet(setItem.clientId)}
          renderInput={(column) => (
            <PlanWorkoutSetInput
              control={control}
              column={column}
              exerciseIndex={index}
              setIndex={setIndex}
            />
          )}
        />
      )}
    />
  );
}

type PlanWorkoutSetInputProps = {
  control: UseFormReturn<EditPlanForm>["control"];
  column: WorkoutSetColumn;
  exerciseIndex: number;
  setIndex: number;
};

function PlanWorkoutSetInput({
  control,
  column,
  exerciseIndex,
  setIndex,
}: PlanWorkoutSetInputProps) {
  const name =
    `workoutExercises.${exerciseIndex}.sets.${setIndex}.${column.key}` as const;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <WorkoutSetInput
          inputType={column.inputType}
          value={field.value}
          onChange={field.onChange}
          error={!!fieldState.error}
          placeholder={column.placeholder}
          allowDecimal={column.allowDecimal}
          min={column.min}
          max={column.max}
        />
      )}
    />
  );
}
