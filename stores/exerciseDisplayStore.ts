import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ExerciseDisplayStore {
  showFullExerciseDetails: boolean;
  setShowFullExerciseDetails: (value: boolean) => void;
  toggleShowFullExerciseDetails: () => void;
}

export const useExerciseDisplayStore = create<ExerciseDisplayStore>()(
  persist(
    (set) => ({
      showFullExerciseDetails: true,
      setShowFullExerciseDetails: (value) =>
        set({ showFullExerciseDetails: value }),
      toggleShowFullExerciseDetails: () =>
        set((state) => ({
          showFullExerciseDetails: !state.showFullExerciseDetails,
        })),
    }),
    {
      name: "exercise-display-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
