import { EditPlanForm } from "@/schemas/edit-plan.schema";
import { create } from "zustand";

interface EditPlanDraftState {
  workoutId: number | null;
  draft: EditPlanForm | null;

  // Initialize the store for a specific workout.
  // If it is already the same workout and already has a draft, keep it.
  initializeDraft: (workoutId: number, values: EditPlanForm) => void;

  // Replace the whole draft object
  replaceDraft: (values: EditPlanForm) => void;

  // Update only part of the draft
  updateDraft: (values: Partial<EditPlanForm>) => void;

  // Clear current draft
  resetDraft: () => void;
}

export const useEditPlanDraftStore = create<EditPlanDraftState>((set) => ({
  workoutId: null,
  draft: null,

  initializeDraft: (workoutId, values) =>
    set((state) => {
      // Keep current draft if user is already editing the same workout
      if (state.workoutId === workoutId && state.draft) {
        return state;
      }

      return {
        workoutId,
        draft: values,
      };
    }),

  replaceDraft: (values) =>
    set((state) => ({
      ...state,
      draft: values,
    })),

  updateDraft: (values) =>
    set((state) => {
      if (!state.draft) return state;

      return {
        ...state,
        draft: {
          ...state.draft,
          ...values,
        },
      };
    }),

  resetDraft: () =>
    set({
      workoutId: null,
      draft: null,
    }),
}));
