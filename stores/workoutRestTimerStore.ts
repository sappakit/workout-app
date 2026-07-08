import { devLogger } from "@/lib/logger/devLogger";
import {
  cancelRestCompleteNotification,
  scheduleRestCompleteNotification,
} from "@/lib/notifications/restTimerNotifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const DEFAULT_REST_TIMER_STEP_SECONDS = 15;

interface CompleteRestTimerOptions {
  shouldAlert?: boolean;
}

interface WorkoutRestTimerStore {
  restTimerEndsAt: string | null;
  restCompletedAt: number | null;

  startRestTimer: (seconds: number) => void;
  completeRestTimer: (options?: CompleteRestTimerOptions) => void;
  clearRestTimer: () => void;
  increaseRestTimer: (seconds?: number) => void;
  decreaseRestTimer: (seconds?: number) => void;
}

function cancelRestNotificationSafely() {
  void cancelRestCompleteNotification().catch((error) => {
    devLogger.error("Failed to cancel rest notification", error);
  });
}

function scheduleRestNotificationSafely(seconds: number) {
  void scheduleRestCompleteNotification(seconds).catch((error) => {
    devLogger.error("Failed to schedule rest notification", error);
  });
}

export const useWorkoutRestTimerStore = create<WorkoutRestTimerStore>()(
  persist(
    (set, get) => ({
      restTimerEndsAt: null,
      restCompletedAt: null,

      startRestTimer: (seconds) => {
        cancelRestNotificationSafely();

        if (seconds <= 0) {
          set({
            restTimerEndsAt: null,
            restCompletedAt: null,
          });

          return;
        }

        scheduleRestNotificationSafely(seconds);

        set({
          restTimerEndsAt: new Date(Date.now() + seconds * 1000).toISOString(),
          restCompletedAt: null,
        });
      },

      completeRestTimer: (options) => {
        const shouldAlert = options?.shouldAlert ?? true;

        cancelRestNotificationSafely();

        set({
          restTimerEndsAt: null,
          restCompletedAt: shouldAlert ? Date.now() : null,
        });
      },

      clearRestTimer: () => {
        cancelRestNotificationSafely();

        set({
          restTimerEndsAt: null,
          restCompletedAt: null,
        });
      },

      increaseRestTimer: (seconds = DEFAULT_REST_TIMER_STEP_SECONDS) => {
        const now = Date.now();
        const currentEndsAt = get().restTimerEndsAt;

        const baseTime = currentEndsAt
          ? Math.max(new Date(currentEndsAt).getTime(), now)
          : now;

        const nextTime = baseTime + seconds * 1000;
        const nextRemainingSeconds = Math.ceil((nextTime - now) / 1000);

        cancelRestNotificationSafely();
        scheduleRestNotificationSafely(nextRemainingSeconds);

        set({
          restTimerEndsAt: new Date(nextTime).toISOString(),
          restCompletedAt: null,
        });
      },

      decreaseRestTimer: (seconds = DEFAULT_REST_TIMER_STEP_SECONDS) => {
        const currentEndsAt = get().restTimerEndsAt;
        if (!currentEndsAt) return;

        const now = Date.now();
        const nextTime = new Date(currentEndsAt).getTime() - seconds * 1000;

        cancelRestNotificationSafely();

        if (nextTime <= now) {
          set({
            restTimerEndsAt: null,
            restCompletedAt: null,
          });

          return;
        }

        const nextRemainingSeconds = Math.ceil((nextTime - now) / 1000);

        scheduleRestNotificationSafely(nextRemainingSeconds);

        set({
          restTimerEndsAt: new Date(nextTime).toISOString(),
          restCompletedAt: null,
        });
      },
    }),
    {
      name: "workout-rest-timer-store",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        const restTimerEndsAt = state?.restTimerEndsAt;

        if (
          restTimerEndsAt &&
          new Date(restTimerEndsAt).getTime() <= Date.now()
        ) {
          // Cold start cleanup
          state?.completeRestTimer({ shouldAlert: false });
        }
      },
    },
  ),
);
