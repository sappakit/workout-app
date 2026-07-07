import { useWorkoutRestTimerStore } from "@/stores/workoutRestTimerStore";
import { useEffect, useState } from "react";

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

  const endTime = restTimerEndsAt ? new Date(restTimerEndsAt).getTime() : null;

  const isActive = endTime != null && endTime > now;

  const remainingSeconds =
    isActive && endTime != null
      ? Math.max(0, Math.ceil((endTime - now) / 1000))
      : 0;

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

    if (endTime <= now) {
      completeRestTimer();
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
