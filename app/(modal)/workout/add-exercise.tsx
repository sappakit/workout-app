import { PageLayout } from "@/components/layout/PageLayout";
import {
  ExercisePickerScreen,
  type ExercisePickerMode,
} from "@/components/picker/exercise-picker/ExercisePickerScreen";
import { ErrorState } from "@/components/state/ErrorState";
import { mapExerciseToCreateWorkoutExerciseFormItem } from "@/lib/workout/mappers";
import type { EditPlanForm } from "@/schemas/edit-plan.schema";
import { usePlanFormDraftStore } from "@/stores/planFormDraftStore";
import type { Exercise } from "@/types/workout/response/exercise.types";
import { useLocalSearchParams, useRouter } from "expo-router";

type WorkoutExerciseDraftItem = EditPlanForm["workoutExercises"][number];

type AddExercisesParams = {
  mode?: ExercisePickerMode;
  exerciseClientId?: string;
};

export default function AddExercisesPage() {
  const router = useRouter();

  const params = useLocalSearchParams<AddExercisesParams>();

  const mode: ExercisePickerMode =
    params.mode === "replace" ? "replace" : "add";

  const isReplaceMode = mode === "replace";
  const targetExerciseClientId = params.exerciseClientId;

  const draft = usePlanFormDraftStore((state) => state.draft);

  const replaceDraft = usePlanFormDraftStore((state) => state.replaceDraft);

  const currentExercises = draft?.workoutExercises ?? [];

  const targetWorkoutExercise = currentExercises.find(
    (item) => item.clientId === targetExerciseClientId,
  );

  const handleClose = () => {
    router.back();
  };

  const handleDone = (selectedExercises: Exercise[]) => {
    if (!draft) {
      router.back();
      return;
    }

    if (isReplaceMode) {
      handleReplaceExercise(selectedExercises);
      return;
    }

    handleAddExercises(selectedExercises);
  };

  const handleAddExercises = (selectedExercises: Exercise[]) => {
    if (!draft) {
      router.back();
      return;
    }

    const nextItems: WorkoutExerciseDraftItem[] = [...currentExercises];

    let nextOrderIndex =
      currentExercises.length > 0
        ? Math.max(...currentExercises.map((item) => item.orderIndex)) + 1
        : 1;

    selectedExercises.forEach((exercise) => {
      nextItems.push(
        mapExerciseToCreateWorkoutExerciseFormItem(exercise, nextOrderIndex),
      );

      nextOrderIndex += 1;
    });

    replaceDraft({
      ...draft,
      workoutExercises: nextItems,
    });

    router.back();
  };

  const handleReplaceExercise = (selectedExercises: Exercise[]) => {
    const selectedExercise = selectedExercises[0];

    if (!draft || !selectedExercise || !targetExerciseClientId) {
      router.back();
      return;
    }

    const targetExerciseIndex = currentExercises.findIndex(
      (item) => item.clientId === targetExerciseClientId,
    );

    if (targetExerciseIndex === -1) {
      router.back();
      return;
    }

    const targetWorkoutExercise = currentExercises[targetExerciseIndex];

    const replacementExercise = mapExerciseToCreateWorkoutExerciseFormItem(
      selectedExercise,
      targetWorkoutExercise.orderIndex,
    );

    const nextItems = currentExercises.map((item, index) => {
      if (index !== targetExerciseIndex) {
        return item;
      }

      return replacementExercise;
    });

    replaceDraft({
      ...draft,
      workoutExercises: nextItems,
    });

    router.back();
  };

  if (!draft) {
    return (
      <PageLayout scrollable={false} includeInsets>
        <ErrorState
          icon="details"
          title="No plan draft found"
          message="We couldn't find the workout plan you were editing."
          primaryAction={{
            hidden: true,
          }}
        />
      </PageLayout>
    );
  }

  if (isReplaceMode && !targetWorkoutExercise) {
    return (
      <PageLayout scrollable={false} includeInsets>
        <ErrorState
          icon="exercise"
          title="Exercise not found"
          message="We couldn't find the exercise you were trying to replace."
          primaryAction={{
            hidden: true,
          }}
        />
      </PageLayout>
    );
  }

  return (
    <ExercisePickerScreen
      mode={mode}
      targetExercise={targetWorkoutExercise?.exercise}
      addDescription="Select one or more exercises to add to this workout plan."
      onClose={handleClose}
      onDone={handleDone}
    />
  );
}
