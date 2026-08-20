import { mapWorkoutSessionModelToFinishPayload } from "@/components/workout-in-progress/model/helpers";
import { useAppColors } from "@/hooks/useAppTheme";
import { useDefaultBottomSheetAnimation } from "@/hooks/useBottomSheetAnimation";
import { usePausableElapsedSeconds } from "@/hooks/usePausableElapsedSeconds";
import { useRestCompleteAlert } from "@/hooks/useRestCompleteAlert";
import { useWorkoutRestTimer } from "@/hooks/useWorkoutRestTimer";
import { api } from "@/lib/api/client";
import { workoutApi } from "@/lib/api/workout.api";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  selectActiveWorkoutSession,
  selectHasActiveWorkoutSession,
  useWorkoutSessionStore,
} from "@/stores/workoutSessionStore";
import { useWorkoutTimerSheetStore } from "@/stores/workoutTimerSheetStore";
import BottomSheet from "@gorhom/bottom-sheet";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import {
  getWorkoutTimerStats,
  INITIAL_TIMER_STATS,
} from "./model/workoutTimerDisplay";
import {
  WORKOUT_TIMER_SHEET_VERTICAL_PADDING,
  WorkoutTimerSheetContent,
} from "./ui/WorkoutTimerSheetContent";

type WorkoutTimerBottomSheetProps = {
  bottomInset?: number;
};

const FALLBACK_COLLAPSED_HEIGHT = 100;
const FALLBACK_EXPANDED_HEIGHT = 180;

// Extra buffer for the bottom sheet handle/spacing.
const SHEET_HEIGHT_BUFFER = 24;

export default function WorkoutTimerBottomSheet({
  bottomInset = 0,
}: WorkoutTimerBottomSheetProps) {
  const colors = useAppColors();

  const toast = useAppToast();
  const invalidateQueries = useInvalidateQueries();
  const animationConfigs = useDefaultBottomSheetAnimation();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const [collapsedContentHeight, setCollapsedContentHeight] = useState<
    number | null
  >(null);

  const [expandedContentHeight, setExpandedContentHeight] = useState<
    number | null
  >(null);

  const setCollapsedSnapPoint = useWorkoutTimerSheetStore(
    (state) => state.setCollapsedSnapPoint,
  );

  const snapPoints = useMemo(() => {
    const collapsedHeight =
      collapsedContentHeight != null
        ? collapsedContentHeight +
          WORKOUT_TIMER_SHEET_VERTICAL_PADDING +
          SHEET_HEIGHT_BUFFER
        : FALLBACK_COLLAPSED_HEIGHT;

    const expandedHeight =
      expandedContentHeight != null
        ? expandedContentHeight +
          WORKOUT_TIMER_SHEET_VERTICAL_PADDING +
          SHEET_HEIGHT_BUFFER
        : FALLBACK_EXPANDED_HEIGHT;

    return [collapsedHeight, Math.max(expandedHeight, collapsedHeight)];
  }, [collapsedContentHeight, expandedContentHeight]);

  const restTimer = useWorkoutRestTimer();

  useRestCompleteAlert();

  // Workout session store
  const hasActiveWorkoutSession = useWorkoutSessionStore(
    selectHasActiveWorkoutSession,
  );

  const storedSession = useWorkoutSessionStore(selectActiveWorkoutSession);

  const updateSession = useWorkoutSessionStore((state) => state.updateSession);

  const clearSession = useWorkoutSessionStore((state) => state.clearSession);

  const sessionTimer = usePausableElapsedSeconds({
    startedAt: storedSession?.startedAt ?? null,
    pausedAt: storedSession?.pausedAt ?? null,
    totalPausedDuration: storedSession?.totalPausedDuration ?? 0,
  });

  const timerStats = storedSession
    ? getWorkoutTimerStats(storedSession)
    : INITIAL_TIMER_STATS;

  // Cancel workout
  const cancelWorkoutMutation = useMutation({
    mutationFn: () => {
      if (!storedSession) {
        throw new Error("No active session");
      }

      return api.post(workoutApi.cancelSession(storedSession.id));
    },

    onSuccess: async () => {
      await invalidateQueries([workoutQueryKeys.current]);

      restTimer.clear();
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
      if (!storedSession) {
        throw new Error("No active session");
      }

      const payload = mapWorkoutSessionModelToFinishPayload(storedSession);

      return api.patch(workoutApi.finishSession(storedSession.id), payload);
    },

    onSuccess: async () => {
      await invalidateQueries([workoutQueryKeys.current, workoutQueryKeys.all]);

      restTimer.clear();
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

  // Finish session
  const handleFinishWorkoutSession = () => {
    if (!storedSession) {
      return;
    }

    finishWorkoutSessionMutation.mutate();
  };

  // Pause/resume session
  const handleTogglePauseWorkout = () => {
    updateSession((previousSession) => {
      const now = new Date();

      // Resume
      if (previousSession.pausedAt) {
        const pausedSeconds = Math.floor(
          (now.getTime() - new Date(previousSession.pausedAt).getTime()) / 1000,
        );

        return {
          ...previousSession,
          pausedAt: null,
          totalPausedDuration:
            previousSession.totalPausedDuration + Math.max(0, pausedSeconds),
        };
      }

      // Pause
      return {
        ...previousSession,
        pausedAt: now.toISOString(),
      };
    });
  };

  if (!hasActiveWorkoutSession || !storedSession) {
    return null;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      bottomInset={bottomInset}
      enableDynamicSizing={false}
      enablePanDownToClose={false}
      enableOverDrag
      animationConfigs={animationConfigs}
      animateOnMount
      detached={false}
      backgroundStyle={{
        backgroundColor: colors.card,
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.borderStrong,
      }}
    >
      <WorkoutTimerSheetContent
        sessionElapsedSeconds={sessionTimer.elapsedSeconds}
        remainingRestSeconds={restTimer.remainingSeconds}
        stats={timerStats}
        restAction={{
          onSkip: restTimer.clear,
          onIncrease: restTimer.increase,
          onDecrease: restTimer.decrease,
        }}
        finishAction={{
          onPress: handleFinishWorkoutSession,
          loading: finishWorkoutSessionMutation.isPending,
        }}
        discardAction={{
          onPress: handleCancelWorkout,
          loading: cancelWorkoutMutation.isPending,
        }}
        pauseAction={{
          onPress: handleTogglePauseWorkout,
          isPaused: sessionTimer.isPaused,
        }}
        onCollapsedLayout={(height) => {
          setCollapsedContentHeight((previousHeight) =>
            previousHeight === height ? previousHeight : height,
          );

          setCollapsedSnapPoint(
            height + WORKOUT_TIMER_SHEET_VERTICAL_PADDING + SHEET_HEIGHT_BUFFER,
          );
        }}
        onExpandedLayout={(height) => {
          setExpandedContentHeight((previousHeight) =>
            previousHeight === height ? previousHeight : height,
          );
        }}
      />
    </BottomSheet>
  );
}
