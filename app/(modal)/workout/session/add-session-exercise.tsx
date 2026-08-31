import { PageLayout } from "@/components/layout/PageLayout";
import {
  ExercisePickerScreen,
  type ExercisePickerMode,
} from "@/components/picker/exercise-picker/ExercisePickerScreen";
import { ErrorState } from "@/components/state/ErrorState";
import {
  addSessionExercise,
  replaceSessionExercise,
} from "@/components/workout-in-progress/model/session-state.helpers";
import { api } from "@/lib/api/client";
import { exerciseApi } from "@/lib/api/exercise.api";
import { useWorkoutSessionStore } from "@/stores/workoutSessionStore";
import type { Exercise } from "@/types/workout/response/exercise.types";
import type { ExercisePerformanceSummary } from "@/types/workout/response/workout.types";
import { useLocalSearchParams, useRouter } from "expo-router";

type AddSessionExerciseParams = {
  mode?: ExercisePickerMode;
  exerciseClientId?: string;
};

export default function AddSessionExercisePage() {
  const router = useRouter();

  const params = useLocalSearchParams<AddSessionExerciseParams>();

  const mode: ExercisePickerMode =
    params.mode === "replace" ? "replace" : "add";

  const isReplaceMode = mode === "replace";
  const targetExerciseClientId = params.exerciseClientId;

  const session = useWorkoutSessionStore((state) => state.session);

  const updateSession = useWorkoutSessionStore((state) => state.updateSession);

  const mergePerformanceByExerciseId = useWorkoutSessionStore(
    (state) => state.mergePerformanceByExerciseId,
  );

  const removePerformanceByExerciseId = useWorkoutSessionStore(
    (state) => state.removePerformanceByExerciseId,
  );

  const targetSessionExercise = session?.sessionExercises.find(
    (item) => item.clientId === targetExerciseClientId,
  );

  const handleClose = () => {
    router.back();
  };

  const fetchExercisePerformanceMap = async (exercises: Exercise[]) => {
    const exerciseIds = exercises.map((exercise) => exercise.id);

    if (exerciseIds.length === 0) {
      return {};
    }

    const response = await api.get<{
      data: Record<string, ExercisePerformanceSummary>;
    }>(exerciseApi.getExercisesPerformance(), {
      params: {
        exerciseIds,
      },
    });

    return response.data.data;
  };

  const handleDone = async (selectedExercises: Exercise[]) => {
    if (!session) {
      router.back();
      return;
    }

    if (isReplaceMode) {
      await handleReplaceExercise(selectedExercises);
      return;
    }

    await handleAddExercises(selectedExercises);
  };

  const handleAddExercises = async (selectedExercises: Exercise[]) => {
    const performanceMap = await fetchExercisePerformanceMap(selectedExercises);

    updateSession((previousSession) =>
      addSessionExercise(previousSession, selectedExercises),
    );

    mergePerformanceByExerciseId(performanceMap);

    router.back();
  };

  const handleReplaceExercise = async (selectedExercises: Exercise[]) => {
    const selectedExercise = selectedExercises[0];

    if (!selectedExercise || !targetExerciseClientId) {
      router.back();
      return;
    }

    const oldExerciseId = targetSessionExercise?.exercise.id;

    const performanceMap = await fetchExercisePerformanceMap([
      selectedExercise,
    ]);

    updateSession((previousSession) =>
      replaceSessionExercise(
        previousSession,
        targetExerciseClientId,
        selectedExercise,
      ),
    );

    if (oldExerciseId != null) {
      removePerformanceByExerciseId(oldExerciseId);
    }

    mergePerformanceByExerciseId(performanceMap);

    router.back();
  };

  if (!session) {
    return (
      <PageLayout scrollable={false} includeInsets>
        <ErrorState
          icon="details"
          title="No active workout session found"
          message="We couldn't find the workout session you were editing."
          primaryAction={{
            hidden: true,
          }}
        />
      </PageLayout>
    );
  }

  if (isReplaceMode && !targetSessionExercise) {
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
      targetExercise={targetSessionExercise?.exercise}
      addDescription="Select one or more exercises to add to this workout session."
      onClose={handleClose}
      onDone={handleDone}
    />
  );
}
