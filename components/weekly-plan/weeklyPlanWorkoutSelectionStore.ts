import { WorkoutResponse } from "@/types/workout/response/workout.types";
import { create } from "zustand";

export type WeeklyPlanWorkoutPickerResult = {
  dayOfWeek: number;
  workout: WorkoutResponse;
};

type WeeklyPlanWorkoutPickerStore = {
  result: WeeklyPlanWorkoutPickerResult | null;
  setResult: (result: WeeklyPlanWorkoutPickerResult) => void;
  clearResult: () => void;
};

export const useWeeklyPlanWorkoutPickerStore =
  create<WeeklyPlanWorkoutPickerStore>((set) => ({
    result: null,
    setResult: (result) => set({ result }),
    clearResult: () => set({ result: null }),
  }));
