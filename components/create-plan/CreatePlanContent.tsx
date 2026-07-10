import { AppButton } from "@/components/custom-ui/AppButton";
import { PageLayout } from "@/components/layout/PageLayout";
import { usePlanFormAutoFill } from "@/hooks/usePlanFormAutoFill";
import { api } from "@/lib/api/client";
import { workoutApi } from "@/lib/api/workout.api";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { mapEditPlanFormToUpdateWorkoutPayload } from "@/lib/workout/mappers";
import { EditPlanForm, editPlanFormSchema } from "@/schemas/edit-plan.schema";
import { usePlanFormDraftStore } from "@/stores/planFormDraftStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Plus, Save } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Alert } from "react-native";
import { PlanFormFields } from "../edit-plan/ui/PlanFormFields";

const CREATE_PLAN_DEFAULT_VALUES: EditPlanForm = {
  name: "",
  workoutFocusTypeId: null,
  targetMuscles: [],
  autoFillMuscles: false,
  autoFillDuration: false,
  duration: 0,
  workoutExercises: [],
};

export default function CreatePlanContent() {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();
  const toast = useAppToast();

  // Draft store.
  const draftMode = usePlanFormDraftStore((state) => state.mode);
  const draft = usePlanFormDraftStore((state) => state.draft);
  const initializeDraft = usePlanFormDraftStore(
    (state) => state.initializeDraft,
  );
  const replaceDraft = usePlanFormDraftStore((state) => state.replaceDraft);
  const resetDraft = usePlanFormDraftStore((state) => state.resetDraft);

  const initialFormValues = useMemo(() => {
    if (draftMode === "create" && draft) {
      return draft;
    }

    return CREATE_PLAN_DEFAULT_VALUES;
  }, [draftMode, draft]);

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
    usePlanFormAutoFill({ form });

  // Initialize the Zustand draft once for create mode.
  useEffect(() => {
    initializeDraft({
      mode: "create",
      values: initialFormValues,
    });
  }, [initialFormValues, initializeDraft]);

  // Refresh RHF when the draft changes from another page, like add/manage exercises.
  useEffect(() => {
    if (draftMode !== "create" || !draft) return;

    const frame = requestAnimationFrame(() => {
      reset(draft, {
        keepDefaultValues: true,
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [draftMode, draft, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: EditPlanForm) => {
      const url = workoutApi.create();

      // TODO: Rename this to mapPlanFormToWorkoutPayload.
      const payload = mapEditPlanFormToUpdateWorkoutPayload(values);

      return await api.post(url, payload);
    },
    onSuccess: async () => {
      resetDraft();

      await invalidateQueries([workoutQueryKeys.current]);

      toast.success({
        title: "Plan created",
        message: "Your workout plan has been created.",
      });

      router.back();
    },
    onError: () => {
      toast.error({
        title: "Create failed",
        message: "Unable to create workout plan.",
      });
    },
  });

  const onSubmit = (values: EditPlanForm) => {
    mutate(values);
  };

  // Cancel creation.
  const handleCancelCreate = () => {
    const resetFormAndBack = () => {
      resetDraft();
      router.back();
    };

    if (!isDirty) {
      resetFormAndBack();
      return;
    }

    Alert.alert(
      "Discard new plan?",
      "You have unsaved changes. If you go back, this workout plan will be lost.",
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

  const footer = (
    <>
      <AppButton
        title="Create Plan"
        variant="primary"
        icon={Save}
        className="flex-1"
        textClassName="font-medium"
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
          title: "Create Plan",
          showBackButton: true,
          onBackPress: handleCancelCreate,
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
        onOpenManageMode={handleOpenManageMode}
        onRemoveAllExercises={handleRemoveAllExercises}
        onRemoveExercise={handleRemoveExercise}
        onReplaceExercise={handleReplaceExercise}
      />
    </PageLayout>
  );
}
