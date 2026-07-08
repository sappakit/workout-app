import {
  ExercisePickerMode,
  ExercisePickerScreen,
} from "@/components/picker/exercise-picker/ExercisePickerScreen";
import {
  addSessionExercise,
  replaceSessionExercise,
} from "@/components/workout-in-progress/model/helpers";
import { api } from "@/lib/api/client";
import { exerciseApi } from "@/lib/api/exercise.api";
import { useWorkoutSessionStore } from "@/stores/workoutSessionStore";
import { Exercise } from "@/types/workout/response/exercise.types";
import { ExercisePerformanceSummary } from "@/types/workout/response/workout.types";
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
      params: { exerciseIds },
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

    updateSession((prev) => addSessionExercise(prev, selectedExercises));
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

    updateSession((prev) =>
      replaceSessionExercise(prev, targetExerciseClientId, selectedExercise),
    );

    if (oldExerciseId != null) {
      removePerformanceByExerciseId(oldExerciseId);
    }

    mergePerformanceByExerciseId(performanceMap);

    router.back();
  };

  return (
    <ExercisePickerScreen
      mode={mode}
      hasSource={!!session}
      targetExercise={targetSessionExercise?.exercise}
      addDescription="Select one or more exercises to add to this workout session."
      missingSourceText="No active workout session found."
      missingTargetText="Exercise not found in this workout session."
      onClose={handleClose}
      onDone={handleDone}
    />
  );
}
