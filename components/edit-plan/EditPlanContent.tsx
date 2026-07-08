import { AppButton } from "@/components/custom-ui/AppButton";
import { PageLayout } from "@/components/layout/PageLayout";
import { api } from "@/lib/api/client";
import { workoutApi } from "@/lib/api/workout.api";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  mapEditPlanFormToUpdateWorkoutPayload,
  mapWorkoutResponseToEditPlanForm,
} from "@/lib/workout/mappers";
import { calculateWorkoutDurationFromExercises } from "@/lib/workout/utils";
import { EditPlanForm, editPlanFormSchema } from "@/schemas/edit-plan.schema";
import { usePlanFormDraftStore } from "@/stores/planFormDraftStore";
import { ExerciseMuscleItem } from "@/types/workout/response/exercise.types";
import { WorkoutResponse } from "@/types/workout/response/workout.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Plus, Save } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
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

  const workoutExercises =
    useWatch({
      control,
      name: "workoutExercises",
    }) ?? [];

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
    if (draftMode !== "edit" || draftWorkoutId !== data.id || !draft) return;

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

  // Auto-fill the duration.
  const autoFillDuration = useWatch({
    control,
    name: "autoFillDuration",
  });

  useEffect(() => {
    if (!autoFillDuration) return;

    if (workoutExercises.length === 0) {
      setValue("duration", 0, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    const totalSeconds = calculateWorkoutDurationFromExercises(
      workoutExercises,
      { timeType: "seconds" },
    );

    setValue("duration", totalSeconds, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [workoutExercises, autoFillDuration, setValue]);

  // Auto-fill the target muscles.
  const autoFillMuscles = useWatch({
    control,
    name: "autoFillMuscles",
  });

  useEffect(() => {
    if (!autoFillMuscles) return;

    const uniqueMuscleIds = Array.from(
      new Set(
        workoutExercises.flatMap((workoutExercise) =>
          (workoutExercise.exercise.muscles ?? []).map(
            (item: ExerciseMuscleItem) => item.muscle.id,
          ),
        ),
      ),
    );

    setValue("targetMuscles", uniqueMuscleIds, {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [workoutExercises, autoFillMuscles, setValue]);

  // Disable auto-fill when there are no exercises.
  const hasExercises = workoutExercises.length > 0;

  useEffect(() => {
    if (hasExercises) return;

    if (getValues("autoFillMuscles")) {
      setValue("autoFillMuscles", false, {
        shouldDirty: true,
        shouldValidate: false,
      });
    }

    if (getValues("autoFillDuration")) {
      setValue("autoFillDuration", false, {
        shouldDirty: true,
        shouldValidate: false,
      });
    }
  }, [hasExercises, getValues, setValue]);

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
    if (workoutExercises.length === 0) return;

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

  const selectedTargetMuscleOptions = data.muscles.map((item) => ({
    label: item.muscle.name,
    value: item.muscle.id,
  }));

  const footer = (
    <>
      <AppButton
        title="Save Changes"
        variant="primary"
        icon={Save}
        className="flex-1"
        onPress={handleSubmit(onSubmit)}
        loading={isPending}
      />

      <AppButton
        variant="secondary"
        icon={Plus}
        className="h-12 w-12"
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
