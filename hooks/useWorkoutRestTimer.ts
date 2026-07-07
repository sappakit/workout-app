import { useWorkoutRestTimerStore } from "@/stores/workoutRestTimerStore";
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

export function useWorkoutRestTimer() {
  const restTimerEndsAt = useWorkoutRestTimerStore(
    (state) => state.restTimerEndsAt,
  );

  const startRestTimer = useWorkoutRestTimerStore(
    (state) => state.startRestTimer,
  );

  const completeRestTimer = useWorkoutRestTimerStore(
    (state) => state.completeRestTimer,
  );

  const clearRestTimer = useWorkoutRestTimerStore(
    (state) => state.clearRestTimer,
  );

  const increaseRestTimer = useWorkoutRestTimerStore(
    (state) => state.increaseRestTimer,
  );

  const decreaseRestTimer = useWorkoutRestTimerStore(
    (state) => state.decreaseRestTimer,
  );

  const [now, setNow] = useState(Date.now());

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const endTime = restTimerEndsAt ? new Date(restTimerEndsAt).getTime() : null;

  const isActive = endTime != null && endTime > now;

  const remainingSeconds =
    isActive && endTime != null
      ? Math.max(0, Math.ceil((endTime - now) / 1000))
      : 0;

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const previousAppState = appStateRef.current;
      appStateRef.current = nextAppState;

      const isComingBackToForeground =
        previousAppState.match(/inactive|background/) &&
        nextAppState === "active";

      // Only run the expired-timer cleanup when the app moves from background/inactive -> active
      if (!isComingBackToForeground) return;

      const currentEndsAt = useWorkoutRestTimerStore.getState().restTimerEndsAt;

      if (!currentEndsAt) {
        setNow(Date.now());
        return;
      }

      const currentEndTime = new Date(currentEndsAt).getTime();

      // If notification already handled the alert, silently finish the expired timer
      if (currentEndTime <= Date.now()) {
        completeRestTimer({ shouldAlert: false });
        return;
      }

      setNow(Date.now());
    });

    return () => subscription.remove();
  }, [completeRestTimer]);

  // Keep ticking while a rest timer exists
  useEffect(() => {
    if (!restTimerEndsAt) {
      setNow(Date.now());
      return;
    }

    setNow(Date.now());

    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [restTimerEndsAt]);

  // Auto-stop when the timer reaches 0
  useEffect(() => {
    if (!restTimerEndsAt || endTime == null) return;

    // Only play the in-app alert when the timer finishes while the app is active
    if (AppState.currentState !== "active") return;

    if (endTime <= now) {
      completeRestTimer({ shouldAlert: true });
    }
  }, [restTimerEndsAt, endTime, now, completeRestTimer]);

  return {
    isActive,
    remainingSeconds,
    start: startRestTimer,
    clear: clearRestTimer,
    increase: increaseRestTimer,
    decrease: decreaseRestTimer,
  };
}
