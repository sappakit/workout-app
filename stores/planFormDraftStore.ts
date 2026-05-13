import { EditPlanForm } from "@/schemas/edit-plan.schema";
import { create } from "zustand";

export type PlanFormMode = "create" | "edit";

interface PlanFormDraftState {
  mode: PlanFormMode | null;
  workoutId: number | null;
  draft: EditPlanForm | null;

  // Initialize the store for create/edit plan.
  // If it is already the same form context and already has a draft, keep it.
  initializeDraft: (params: {
    mode: PlanFormMode;
    workoutId?: number | null;
    values: EditPlanForm;
  }) => void;

  // Replace the whole draft object
  replaceDraft: (values: EditPlanForm) => void;

  // Update only part of the draft
  updateDraft: (values: Partial<EditPlanForm>) => void;

  // Clear current draft
  resetDraft: () => void;
}

export const usePlanFormDraftStore = create<PlanFormDraftState>((set) => ({
  mode: null,
  workoutId: null,
  draft: null,

  initializeDraft: ({ mode, workoutId = null, values }) =>
    set((state) => {
      const isSameCreateDraft =
        state.mode === "create" && mode === "create" && state.draft;

      const isSameEditDraft =
        state.mode === "edit" &&
        mode === "edit" &&
        state.workoutId === workoutId &&
        state.draft;

      // Keep current draft if user is already in the same create/edit context
      if (isSameCreateDraft || isSameEditDraft) {
        return state;
      }

      return {
        mode,
        workoutId: mode === "edit" ? workoutId : null,
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
      mode: null,
      workoutId: null,
      draft: null,
    }),
}));
