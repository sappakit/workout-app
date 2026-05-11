import { workoutApi } from "@/app/api/workout.api";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { api } from "@/lib/api";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  mapWorkoutSessionModelToFinishPayload,
  useWorkoutSessionStore,
} from "@/stores/workoutSessionStore";
import { WorkoutSession } from "@/types/workout/response/workout.types";
import { useMutation } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Alert, ImageBackground, StyleSheet, View } from "react-native";
import {
  getWorkoutTimerStats,
  INITIAL_TIMER_STATS,
} from "../bottom-sheet/workout-timer/model/workoutTimerDisplay";
import WorkoutTimerBottomSheet from "../bottom-sheet/workout-timer/WorkoutTimerBottomSheet";
import {
  addSessionSet,
  deleteSessionSet,
  syncSessionExerciseCompletion,
} from "./model/helpers";
import { WorkoutExerciseSection } from "./ui/WorkoutExerciseSection";

type WorkoutInProgressContentProps = {
  session: WorkoutSession;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80";

export function WorkoutInProgressContent({
  session,
}: WorkoutInProgressContentProps) {
  const { colors } = useAppTheme();

  const toast = useAppToast();
  const invalidateQueries = useInvalidateQueries();
  const restTimer = useCountdownTimer();

  // Workout session store
  const hydrated = useWorkoutSessionStore((state) => state.hydrated);
  const storedSession = useWorkoutSessionStore((state) => state.session);
  const initializeSession = useWorkoutSessionStore(
    (state) => state.initializeSession,
  );

  const updateSession = useWorkoutSessionStore((state) => state.updateSession);
  const updateSessionExercise = useWorkoutSessionStore(
    (state) => state.updateSessionExercise,
  );
  const updateSessionSet = useWorkoutSessionStore(
    (state) => state.updateSessionSet,
  );
  const clearSession = useWorkoutSessionStore((state) => state.clearSession);

  // Initialize session state
  useEffect(() => {
    if (!hydrated) return;

    initializeSession(session);
  }, [hydrated, session, initializeSession]);

  // Ensure store is hydrated and contains the current session
  const isActiveSessionReady = hydrated && storedSession?.id === session.id;

  // Use storedSession as the single source of truth
  const exerciseItems = storedSession?.sessionExercises ?? [];

  // Stats for bottom sheet timer
  const timerStats = storedSession
    ? getWorkoutTimerStats(storedSession)
    : INITIAL_TIMER_STATS;

  /* Mutations */
  // Cancel workout
  const cancelWorkoutMutation = useMutation({
    mutationFn: () => {
      if (!storedSession) throw new Error("No active session");

      return api.post(workoutApi.cancelSession(storedSession.id));
    },
    onSuccess: async () => {
      await invalidateQueries([workoutQueryKeys.current]);

      restTimer.stop();
      clearSession();

      toast.success({
        title: "Workout cancelled",
        message: "Your workout was discarded.",
      });
    },
    onError: () => {
      toast.error({
        title: "Cancel failed",
        message: "Could not cancel workout session.",
      });
    },
  });

  // Finish workout
  const finishWorkoutSessionMutation = useMutation({
    mutationFn: async () => {
      if (!storedSession) throw new Error("No active session");

      const payload = mapWorkoutSessionModelToFinishPayload(storedSession);

      return api.patch(workoutApi.finishSession(storedSession.id), payload);
    },
    onSuccess: async () => {
      await invalidateQueries([workoutQueryKeys.current]);

      restTimer.stop();
      clearSession();

      toast.success({
        title: "Workout completed",
        message: "Your workout has been saved successfully.",
      });
    },
    onError: () => {
      toast.error({
        title: "Save failed",
        message: "Something went wrong while saving your session.",
      });
    },
  });

  /* Functions */
  // Add set
  const handleAddSet = (exerciseClientId: string) => {
    updateSession((prev) => addSessionSet(prev, exerciseClientId));
  };

  // Delete set
  const handleDeleteSet = (exerciseClientId: string, setClientId: string) => {
    updateSession((prev) =>
      deleteSessionSet(prev, exerciseClientId, setClientId),
    );
  };

  // Complete set
  const handleToggleSetCompleted = (
    exerciseClientId: string,
    setClientId: string,
  ) => {
    const completedAt = new Date().toISOString();

    const targetExercise = storedSession?.sessionExercises.find(
      (exercise) => exercise.clientId === exerciseClientId,
    );

    const targetSet = targetExercise?.sets.find(
      (set) => set.clientId === setClientId,
    );

    const isCompleting = !targetSet?.completedAt;

    updateSessionExercise(exerciseClientId, (exercise) => {
      const updatedSets = exercise.sets.map((set) =>
        set.clientId === setClientId
          ? {
              ...set,
              completedAt: set.completedAt ? null : completedAt,
            }
          : set,
      );

      return syncSessionExerciseCompletion({
        ...exercise,
        sets: updatedSets,
      });
    });

    if (isCompleting) {
      restTimer.start(targetExercise?.plannedRestTime ?? 0);
    }
  };

  // Update set weight/reps
  const handleUpdateSetValue = (
    exerciseClientId: string,
    setClientId: string,
    field: "weight" | "reps",
    value: number | null,
  ) => {
    updateSessionSet(exerciseClientId, setClientId, (set) => ({
      ...set,
      [field]: value,
    }));
  };

  // Update exercise rest time
  const handleUpdateExerciseRestTime = (
    exerciseClientId: string,
    value: number,
  ) => {
    updateSessionExercise(exerciseClientId, (exercise) => ({
      ...exercise,
      plannedRestTime: value,
    }));
  };

  // Cancel session
  const handleCancelWorkout = () => {
    Alert.alert(
      "Cancel workout?",
      "All progress from this session will be lost.",
      [
        {
          text: "Keep Workout",
          style: "cancel",
        },
        {
          text: "Discard Workout",
          style: "destructive",
          onPress: () => cancelWorkoutMutation.mutate(),
        },
      ],
    );
  };

  // finish session
  const handleFinishWorkoutSession = () => {
    if (!storedSession) return;

    finishWorkoutSessionMutation.mutate();
  };

  // Pause/resume session
  const handleTogglePauseWorkout = () => {
    updateSession((prev) => {
      const now = new Date();

      // Resume
      if (prev.pausedAt) {
        const pausedSeconds = Math.floor(
          (now.getTime() - new Date(prev.pausedAt).getTime()) / 1000,
        );

        return {
          ...prev,
          pausedAt: null,
          totalPausedDuration:
            prev.totalPausedDuration + Math.max(0, pausedSeconds),
        };
      }

      // Pause
      return {
        ...prev,
        pausedAt: now.toISOString(),
      };
    });
  };

  // TODO: add loading
  if (!isActiveSessionReady) {
    return null;
  }

  return (
    <>
      <PageLayout
        headerProps={{
          variant: "title",
          title: "Workout",
        }}
        containerStyle={{
          paddingHorizontal: 0,
          paddingTop: 0,
          paddingBottom: 200,
        }}
      >
        <ImageBackground
          source={{ uri: fallbackImage }}
          resizeMode="cover"
          style={{ height: 240 }}
        >
          <LinearGradient
            colors={["transparent", colors.app.background]}
            locations={[0.4, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          <View className="flex-1 items-center justify-end pb-4">
            {storedSession?.workout?.workoutFocusType?.name && (
              <ThemedText type="default" variant="accent">
                {storedSession.workout.workoutFocusType.name}
              </ThemedText>
            )}

            <ThemedText
              type="default"
              variant="brand"
              className="mt-1 text-center text-4xl font-bold"
            >
              {storedSession?.workout?.name ?? "Workout"}
            </ThemedText>
          </View>
        </ImageBackground>

        <View className="flex-1 gap-4 px-4">
          {exerciseItems.map((exerciseItem) => (
            <WorkoutExerciseSection
              key={exerciseItem.clientId}
              exercise={exerciseItem}
              onAddSet={() => handleAddSet(exerciseItem.clientId)}
              onDeleteSet={(setClientId) =>
                handleDeleteSet(exerciseItem.clientId, setClientId)
              }
              onToggleSetCompleted={(setClientId) =>
                handleToggleSetCompleted(exerciseItem.clientId, setClientId)
              }
              onChangeSetValue={(setClientId, field, value) =>
                handleUpdateSetValue(
                  exerciseItem.clientId,
                  setClientId,
                  field,
                  value,
                )
              }
              onChangeRestTime={(value) =>
                handleUpdateExerciseRestTime(exerciseItem.clientId, value)
              }
            />
          ))}
        </View>
      </PageLayout>

      <WorkoutTimerBottomSheet
        startedAt={storedSession.startedAt}
        pausedAt={storedSession.pausedAt}
        totalPausedDuration={storedSession.totalPausedDuration}
        remainingRestSeconds={restTimer.remainingSeconds}
        stats={timerStats}
        restAction={{
          onSkip: restTimer.stop,
          onIncrease: restTimer.increase,
          onDecrease: restTimer.decrease,
        }}
        pauseAction={{
          onPress: handleTogglePauseWorkout,
          isPaused: storedSession.pausedAt != null,
        }}
        finishAction={{
          onPress: handleFinishWorkoutSession,
          loading: finishWorkoutSessionMutation.isPending,
        }}
        discardAction={{
          onPress: handleCancelWorkout,
          loading: cancelWorkoutMutation.isPending,
        }}
      />
    </>
  );
}
