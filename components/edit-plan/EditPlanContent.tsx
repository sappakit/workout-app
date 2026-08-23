import { AppButton } from "@/components/custom-ui/app-button";
import { PageLayout } from "@/components/layout/PageLayout";
import { usePlanFormAutoFill } from "@/hooks/usePlanFormAutoFill";
import { api } from "@/lib/api/client";
import { workoutApi } from "@/lib/api/workout.api";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  mapEditPlanFormToUpdateWorkoutPayload,
  mapWorkoutResponseToEditPlanForm,
} from "@/lib/workout/mappers";
import {
  editPlanFormSchema,
  type EditPlanForm,
} from "@/schemas/edit-plan.schema";
import { usePlanFormDraftStore } from "@/stores/planFormDraftStore";
import type { WorkoutResponse } from "@/types/workout/response/workout.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Alert } from "react-native";
import { PlanFormFields } from "./ui/PlanFormFields";

interface EditPlanContentProps {
  data: WorkoutResponse;
}

export default function EditPlanContent({ data }: EditPlanContentProps) {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();
  const toast = useAppToast();

  // Draft store.
  const draftMode = usePlanFormDraftStore((state) => state.mode);
  const draftWorkoutId = usePlanFormDraftStore((state) => state.workoutId);
  const draft = usePlanFormDraftStore((state) => state.draft);
  const initializeDraft = usePlanFormDraftStore(
    (state) => state.initializeDraft,
  );
  const replaceDraft = usePlanFormDraftStore((state) => state.replaceDraft);
  const resetDraft = usePlanFormDraftStore((state) => state.resetDraft);

  // Base values from the API response.
  const mappedDefaultValues = useMemo(
    () => mapWorkoutResponseToEditPlanForm(data),
    [data],
  );

  // Use the existing draft for this workout if one already exists.
  const initialFormValues = useMemo(() => {
    if (draftMode === "edit" && draftWorkoutId === data.id && draft) {
      return draft;
    }

    return mappedDefaultValues;
  }, [draftMode, draftWorkoutId, draft, data.id, mappedDefaultValues]);

  const form = useForm<EditPlanForm>({
    resolver: zodResolver(editPlanFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: initialFormValues,
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { isDirty },
  } = form;

  const { fields, replace, remove } = useFieldArray({
    control,
    name: "workoutExercises",
    keyName: "fieldId",
  });

  const { workoutExercises, autoFillMuscles, autoFillDuration, hasExercises } =
    usePlanFormAutoFill({
      form,
    });

  // Initialize the Zustand draft once for this workout.
  useEffect(() => {
    initializeDraft({
      mode: "edit",
      workoutId: data.id,
      values: initialFormValues,
    });
  }, [data.id, initialFormValues, initializeDraft]);

  // Refresh RHF when the draft changes from another page, like manage mode.
  useEffect(() => {
    if (draftMode !== "edit" || draftWorkoutId !== data.id || !draft) {
      return;
    }

    // Wait until the page has fully mounted.
    const frame = requestAnimationFrame(() => {
      reset(draft, {
        keepDefaultValues: true,
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [draftMode, draftWorkoutId, draft, data.id, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: EditPlanForm) => {
      const url = workoutApi.update(data.id);
      const payload = mapEditPlanFormToUpdateWorkoutPayload(values);

      return await api.patch(url, payload);
    },

    onSuccess: async (_, values) => {
      form.reset(values);
      replaceDraft(values);

      await invalidateQueries([
        workoutQueryKeys.detail(data.id),
        workoutQueryKeys.current,
      ]);

      toast.success({
        title: "Plan updated",
        message: "Your workout plan has been saved.",
      });
    },

    onError: () => {
      toast.error({
        title: "Update failed",
        message: "Unable to save workout plan.",
      });
    },
  });

  const onSubmit = (values: EditPlanForm) => {
    mutate(values);
  };

  // Cancel editing.
  const handleCancelEdit = () => {
    const resetFormAndBack = () => {
      resetDraft();
      router.back();
    };

    if (!isDirty) {
      resetFormAndBack();
      return;
    }

    Alert.alert(
      "Discard changes?",
      "You have unsaved changes. If you go back, your edits will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: resetFormAndBack,
        },
      ],
    );
  };

  // Remove all exercises.
  const handleRemoveAllExercises = () => {
    if (workoutExercises.length === 0) {
      return;
    }

    Alert.alert(
      "Remove all exercises?",
      "This will remove all exercises from this workout plan.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove All",
          style: "destructive",
          onPress: () => {
            replace([]);
          },
        },
      ],
    );
  };

  // Remove one exercise.
  const handleRemoveExercise = (index: number) => {
    const targetExercise = workoutExercises[index];

    Alert.alert(
      "Remove exercise?",
      targetExercise
        ? `${targetExercise.exercise.name} will be removed from this workout plan.`
        : "This exercise will be removed from this workout plan.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            remove(index);

            const nextExercises = getValues("workoutExercises").map(
              (exercise, exerciseIndex) => ({
                ...exercise,
                orderIndex: exerciseIndex + 1,
              }),
            );

            setValue("workoutExercises", nextExercises, {
              shouldDirty: true,
              shouldValidate: true,
            });
          },
        },
      ],
    );
  };

  // Open the manage mode page.
  const handleOpenManageMode = () => {
    // Update Zustand with the latest form values.
    replaceDraft(getValues());

    router.push("/(modal)/workout/manage-exercises");
  };

  // Open the add exercise page.
  const handleOpenAddExercise = () => {
    replaceDraft(getValues());

    router.push("/(modal)/workout/add-exercise");
  };

  // Replace an exercise.
  const handleReplaceExercise = (exerciseClientId: string) => {
    replaceDraft(getValues());

    router.push({
      pathname: "/(modal)/workout/add-exercise",
      params: {
        mode: "replace",
        exerciseClientId,
      },
    });
  };

  const selectedWorkoutFocusTypeOption = data.workoutFocusType
    ? {
        label: data.workoutFocusType.name,
        value: data.workoutFocusType.id,
      }
    : undefined;

  const selectedTargetMuscleOptions = data.muscles?.map((item) => {
    if (!item.muscle) {
      throw new Error("Workout muscle relation was not loaded.");
    }

    return {
      label: item.muscle.name,
      value: item.muscle.id,
    };
  });

  const footer = (
    <>
      <AppButton
        title="Save Changes"
        variant="primary"
        className="flex-1"
        icon={{
          name: "save",
          size: "sm",
        }}
        onPress={handleSubmit(onSubmit)}
        loading={isPending}
        disabled={isPending}
      />

      <AppButton
        variant="secondary"
        size="icon"
        className="h-12 w-12"
        icon={{
          name: "add",
          size: "sm",
        }}
        onPress={handleOpenAddExercise}
      />
    </>
  );

  return (
    <PageLayout
      header={{
        props: {
          variant: "title",
          title: "Edit Plan",
          showBackButton: true,
          onBackPress: handleCancelEdit,
        },
      }}
      stickyFooter={footer}
    >
      <PlanFormFields
        form={form}
        fields={fields}
        hasExercises={hasExercises}
        autoFillMuscles={!!autoFillMuscles}
        autoFillDuration={!!autoFillDuration}
        selectedWorkoutFocusTypeOption={selectedWorkoutFocusTypeOption}
        selectedTargetMuscleOptions={selectedTargetMuscleOptions}
        onOpenManageMode={handleOpenManageMode}
        onRemoveAllExercises={handleRemoveAllExercises}
        onRemoveExercise={handleRemoveExercise}
        onReplaceExercise={handleReplaceExercise}
      />
    </PageLayout>
  );
}
