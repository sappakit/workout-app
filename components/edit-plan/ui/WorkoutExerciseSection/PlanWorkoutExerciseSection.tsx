import { createEmptyWorkoutExerciseFormSet } from "@/lib/workout/mappers";
import { EditPlanForm } from "@/schemas/edit-plan.schema";
import { useMemo } from "react";
import {
  Controller,
  FieldPath,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { BaseWorkoutExerciseSection } from "./base/BaseWorkoutExerciseSection";
import {
  getWorkoutSetColumns,
  WorkoutSetColumn,
  WorkoutSetHeader,
  WorkoutSetInput,
  WorkoutSetRow,
} from "./base/WorkoutSetTable";

type PlanWorkoutExerciseSectionProps = {
  form: UseFormReturn<EditPlanForm>;
  index: number;
  onDeleteExercise: () => void;
  onReplaceExercise?: () => void;
};

export function PlanWorkoutExerciseSection({
  form,
  index,
  onDeleteExercise,
  onReplaceExercise,
}: PlanWorkoutExerciseSectionProps) {
  const { control, getValues, setValue } = form;

  const exercise = useWatch({
    control,
    name: `workoutExercises.${index}`,
  });

  const columns = useMemo<WorkoutSetColumn[]>(() => {
    if (!exercise) return [];

    return getWorkoutSetColumns(exercise.exercise.exerciseType);
  }, [exercise]);

  if (!exercise) return null;

  const handleChangeRestTime = (seconds: number) => {
    setValue(`workoutExercises.${index}.restTime`, seconds, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleAddSet = () => {
    const currentSets = getValues(`workoutExercises.${index}.sets`) ?? [];

    const nextSetNumber =
      currentSets.length > 0
        ? Math.max(...currentSets.map((set) => set.setNumber)) + 1
        : 1;

    setValue(
      `workoutExercises.${index}.sets`,
      [...currentSets, createEmptyWorkoutExerciseFormSet(nextSetNumber)],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const handleDeleteSet = (targetClientId: string) => {
    const currentSets = getValues(`workoutExercises.${index}.sets`) ?? [];

    const nextSets = currentSets
      .filter((set) => set.clientId !== targetClientId)
      .map((set, setIndex) => ({
        ...set,
        setNumber: setIndex + 1,
      }));

    setValue(`workoutExercises.${index}.sets`, nextSets, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <BaseWorkoutExerciseSection
      exerciseName={exercise.exercise.name}
      subtitle={`${exercise.sets.length} ${
        exercise.sets.length === 1 ? "set" : "sets"
      }`}
      imageUrl={exercise.exercise.imageUrl}
      sets={exercise.sets}
      restTime={exercise.restTime ?? 0}
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
  const baseName =
    `workoutExercises.${exerciseIndex}.sets.${setIndex}` as const;

  switch (column.key) {
    case "duration":
      return (
        <Controller
          control={control}
          name={`${baseName}.durationMinutes`}
          render={({ field, fieldState }) => (
            <WorkoutSetInput
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

    case "weight":
    case "reps":
    case "distance":
      return (
        <PlanWorkoutNumberSetInput
          control={control}
          name={`${baseName}.${column.key}`}
          column={column}
        />
      );

    default:
      return null;
  }
}

type PlanWorkoutNumberSetInputProps = {
  control: UseFormReturn<EditPlanForm>["control"];
  name: FieldPath<EditPlanForm>;
  column: WorkoutSetColumn;
};

function PlanWorkoutNumberSetInput({
  control,
  name,
  column,
}: PlanWorkoutNumberSetInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <WorkoutSetInput
          value={field.value as number | null}
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
