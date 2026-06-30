import { create } from "zustand";

const DEFAULT_COLLAPSED_SNAP_POINT = 112;

interface WorkoutTimerSheetStore {
  collapsedSnapPoint: number;
  setCollapsedSnapPoint: (height: number) => void;
  resetCollapsedSnapPoint: () => void;
}

export const useWorkoutTimerSheetStore = create<WorkoutTimerSheetStore>()(
  (set) => ({
    collapsedSnapPoint: DEFAULT_COLLAPSED_SNAP_POINT,

    setCollapsedSnapPoint: (height) => {
      set((state) => {
        if (state.collapsedSnapPoint === height) return state;

        return {
          collapsedSnapPoint: height,
        };
      });
    },

    resetCollapsedSnapPoint: () => {
      set({
        collapsedSnapPoint: DEFAULT_COLLAPSED_SNAP_POINT,
      });
    },
  }),
);

export const selectWorkoutTimerSheetCollapsedSnapPoint = (
  state: WorkoutTimerSheetStore,
) => state.collapsedSnapPoint;
