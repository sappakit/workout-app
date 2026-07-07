import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const DEFAULT_REST_TIMER_STEP_SECONDS = 15;

interface WorkoutRestTimerStore {
  restTimerEndsAt: string | null;
  restCompletedAt: number | null;

  startRestTimer: (seconds: number) => void;
  completeRestTimer: () => void;
  clearRestTimer: () => void;
  increaseRestTimer: (seconds?: number) => void;
  decreaseRestTimer: (seconds?: number) => void;
}

export const useWorkoutRestTimerStore = create<WorkoutRestTimerStore>()(
  persist(
    (set, get) => ({
      restTimerEndsAt: null,
      restCompletedAt: null,

      startRestTimer: (seconds) => {
        if (seconds <= 0) {
          set({
            restTimerEndsAt: null,
            restCompletedAt: null,
          });

          return;
        }

        set({
          restTimerEndsAt: new Date(Date.now() + seconds * 1000).toISOString(),
          restCompletedAt: null,
        });
      },

      completeRestTimer: () => {
        set({
          restTimerEndsAt: null,
          restCompletedAt: Date.now(),
        });
      },

      clearRestTimer: () => {
        set({
          restTimerEndsAt: null,
          restCompletedAt: null,
        });
      },

      increaseRestTimer: (seconds = DEFAULT_REST_TIMER_STEP_SECONDS) => {
        const currentEndsAt = get().restTimerEndsAt;

        const baseTime = currentEndsAt
          ? Math.max(new Date(currentEndsAt).getTime(), Date.now())
          : Date.now();

        set({
          restTimerEndsAt: new Date(baseTime + seconds * 1000).toISOString(),
          restCompletedAt: null,
        });
      },

      decreaseRestTimer: (seconds = DEFAULT_REST_TIMER_STEP_SECONDS) => {
        const currentEndsAt = get().restTimerEndsAt;
        if (!currentEndsAt) return;

        const nextTime = new Date(currentEndsAt).getTime() - seconds * 1000;

        if (nextTime <= Date.now()) {
          set({
            restTimerEndsAt: null,
            restCompletedAt: null,
          });

          return;
        }

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
          state?.clearRestTimer();
        }
      },
    },
  ),
);
