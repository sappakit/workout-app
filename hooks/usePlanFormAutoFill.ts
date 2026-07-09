import { calculateWorkoutDurationFromExercises } from "@/lib/workout/utils";
import { EditPlanForm } from "@/schemas/edit-plan.schema";
import { ExerciseMuscleItem } from "@/types/workout/response/exercise.types";
import { useEffect } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";

type UsePlanFormAutoFillProps = {
  form: UseFormReturn<EditPlanForm>;
};

export function usePlanFormAutoFill({ form }: UsePlanFormAutoFillProps) {
  const { control, getValues, setValue } = form;

  const workoutExercises =
    useWatch({
      control,
      name: "workoutExercises",
    }) ?? [];

  const autoFillDuration = useWatch({
    control,
    name: "autoFillDuration",
  });

  const autoFillMuscles = useWatch({
    control,
    name: "autoFillMuscles",
  });

  const hasExercises = workoutExercises.length > 0;

  // Auto-fill the duration.
  useEffect(() => {
    if (!autoFillDuration) return;

    if (workoutExercises.length === 0) {
      setValue("duration", 0, {
        shouldDirty: true,
        shouldValidate: true,
      });

      return;
    }

    const totalSeconds = calculateWorkoutDurationFromExercises(
      workoutExercises,
      { timeType: "seconds" },
    );

    setValue("duration", totalSeconds, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [workoutExercises, autoFillDuration, setValue]);

  // Auto-fill the target muscles.
  useEffect(() => {
    if (!autoFillMuscles) return;

    const uniqueMuscleIds = Array.from(
      new Set(
        workoutExercises.flatMap((workoutExercise) =>
          (workoutExercise.exercise.muscles ?? []).map(
            (item: ExerciseMuscleItem) => item.muscle.id,
          ),
        ),
      ),
    );

    setValue("targetMuscles", uniqueMuscleIds, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [workoutExercises, autoFillMuscles, setValue]);

  // Disable auto-fill when there are no exercises.
  useEffect(() => {
    if (hasExercises) return;

    if (getValues("autoFillMuscles")) {
      setValue("autoFillMuscles", false, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    if (getValues("autoFillDuration")) {
      setValue("autoFillDuration", false, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [hasExercises, getValues, setValue]);

  return {
    workoutExercises,
    autoFillDuration,
    autoFillMuscles,
    hasExercises,
  };
}
