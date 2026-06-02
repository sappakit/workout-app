import { muscleApi } from "@/app/api/muscle.api";
import { workoutApi } from "@/app/api/workout.api";
import { AppButton } from "@/components/custom-ui/AppButton";
import FormCheckbox from "@/components/form/FormCheckbox";
import { FormErrorMessage } from "@/components/form/FormErrorMessage";
import FormNumberInput from "@/components/form/FormNumberInput";
import FormTextInput from "@/components/form/FormTextInput";
import FormInfiniteMultiSelectInput from "@/components/form/select-input/FormInfiniteMultiSelectInput";
import FormInfiniteSelectInput from "@/components/form/select-input/FormInfiniteSelectInput";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ThemedText } from "@/components/themed-text";
import { api } from "@/lib/api";
import { muscleQueryKeys } from "@/lib/exercise/keys";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  mapEditPlanFormToUpdateWorkoutPayload,
  secondsToHMS,
} from "@/lib/workout/mappers";
import { calculateWorkoutDurationFromExercises } from "@/lib/workout/utils";
import { EditPlanForm, editPlanFormSchema } from "@/schemas/edit-plan.schema";
import { useExerciseDisplayStore } from "@/stores/exerciseDisplayStore";
import { usePlanFormDraftStore } from "@/stores/planFormDraftStore";
import { ExerciseMuscleItem } from "@/types/workout/response/exercise.types";
import { Muscle } from "@/types/workout/response/shared.types";
import { WorkoutFocusType } from "@/types/workout/response/workout.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Plus, Save } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Alert, View } from "react-native";
import { ExerciseListMenu } from "../edit-plan/ui/ExerciseListMenu";
import { PlanWorkoutExerciseSection } from "../edit-plan/ui/WorkoutExerciseSection/PlanWorkoutExerciseSection";

const CREATE_PLAN_DEFAULT_VALUES: EditPlanForm = {
  name: "",
  workoutFocusTypeId: null,
  targetMuscles: [],
  autoFillMuscles: false,
  autoFillDuration: false,
  durationHours: null,
  durationMinutes: null,
  durationSeconds: null,
  workoutExercises: [],
};

export default function CreatePlanContent() {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();
  const toast = useAppToast();

  // Display full exercise details toggle
  const showFullExerciseDetails = useExerciseDisplayStore(
    (state) => state.showFullExerciseDetails,
  );
  const toggleShowFullExerciseDetails = useExerciseDisplayStore(
    (state) => state.toggleShowFullExerciseDetails,
  );

  // Draft store
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
    clearErrors,
    formState: { errors, isDirty },
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

  // Initialize Zustand draft once for create mode
  useEffect(() => {
    initializeDraft({
      mode: "create",
      values: initialFormValues,
    });
  }, [initialFormValues, initializeDraft]);

  // When draft changes from another page, like add/manage exercises,
  // refresh RHF so this screen reflects the latest shared draft.
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

      // You can rename this later to mapPlanFormToWorkoutPayload
      // if create and update use the same payload shape.
      const payload = mapEditPlanFormToUpdateWorkoutPayload(values);

      return await api.post(url, payload);
    },
    onSuccess: async () => {
      resetDraft();

      await invalidateQueries([
        workoutQueryKeys.schedule,
        workoutQueryKeys.current,
      ]);

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

  // Duration errors
  const durationErrorMessage =
    errors.durationHours?.message ||
    errors.durationMinutes?.message ||
    errors.durationSeconds?.message;

  // Auto-filled duration
  const autoFillDuration = useWatch({
    control,
    name: "autoFillDuration",
  });

  useEffect(() => {
    if (!autoFillDuration) return;

    // Empty duration field if no exercises
    if (workoutExercises.length === 0) {
      setValue("durationHours", null);
      setValue("durationMinutes", null);
      setValue("durationSeconds", null);
      return;
    }

    const totalSeconds = calculateWorkoutDurationFromExercises(
      workoutExercises,
      { timeType: "seconds" },
    );

    const { hours, minutes, seconds } = secondsToHMS(totalSeconds);

    setValue("durationHours", hours);
    setValue("durationMinutes", minutes);
    setValue("durationSeconds", seconds);
  }, [workoutExercises, autoFillDuration, setValue]);

  // Auto-filled muscles
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

  // Disable auto-fill if no exercises
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

  // Cancel create
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

  // Remove all exercises
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

  // Remove one exercise
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

  // Open the manage mode page
  const handleOpenManageMode = () => {
    replaceDraft(getValues());

    router.push("/(modal)/workout/manage-exercises");
  };

  // Open the add exercise page
  const handleOpenAddExercise = () => {
    replaceDraft(getValues());

    router.push("/(modal)/workout/add-exercise");
  };

  // Replace exercise
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
      headerProps={{
        variant: "title",
        title: "Create Plan",
        showBackButton: true,
        onBackPress: handleCancelCreate,
      }}
      stickyFooter={{
        content: footer,
        options: { addBottomInset: true },
      }}
    >
      {/* Plan Name */}
      <View>
        <ThemedText type="subtitle" variant="accent" className="mb-2">
          Plan Name
        </ThemedText>

        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <>
              <FormTextInput
                placeholder="Enter plan name"
                value={field.value}
                onChangeText={field.onChange}
                error={!!fieldState.error}
              />

              <FormErrorMessage message={fieldState.error?.message} />
            </>
          )}
        />
      </View>

      {/* Workout Type */}
      <View className="mt-4">
        <ThemedText type="subtitle" variant="accent" className="mb-2">
          Workout Type
        </ThemedText>

        <Controller
          control={control}
          name="workoutFocusTypeId"
          render={({ field, fieldState }) => (
            <>
              <FormInfiniteSelectInput<WorkoutFocusType>
                url={workoutApi.getTypes()}
                queryKey={["workout-types"]}
                mapOption={(item) => ({ label: item.name, value: item.id })}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select workout type"
                validationError={!!fieldState.error}
                title="Select Workout Type"
                snapPoints={["70%"]}
                allowEmpty
                emptySelectionLabel="No workout type"
              />

              <FormErrorMessage message={fieldState.error?.message} />
            </>
          )}
        />
      </View>

      {/* Target Muscle Groups */}
      <View className="mt-4">
        <ThemedText type="subtitle" variant="accent">
          Target Muscle Groups
        </ThemedText>

        {/* Auto-filled */}
        <View className="my-2">
          <Controller
            control={control}
            name="autoFillMuscles"
            render={({ field }) => (
              <FormCheckbox
                label="Auto-filled"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);

                  if (value) {
                    clearErrors(["targetMuscles"]);
                  }
                }}
                error={!!errors.autoFillMuscles}
                disabled={!hasExercises}
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="targetMuscles"
          render={({ field, fieldState }) => (
            <>
              <FormInfiniteMultiSelectInput<Muscle>
                url={muscleApi.getAll()}
                queryKey={muscleQueryKeys.all}
                mapOption={(item) => ({ label: item.name, value: item.id })}
                value={field.value}
                onChange={field.onChange}
                selectedOptions={[]}
                placeholder="Select target muscle group"
                validationError={!!fieldState.error}
                title="Select Target Muscles"
                snapPoints={["70%"]}
                disabled={autoFillMuscles}
              />

              <FormErrorMessage message={fieldState.error?.message} />
            </>
          )}
        />
      </View>

      {/* Estimated Duration */}
      <View className="mt-4">
        <ThemedText type="subtitle" variant="accent">
          Estimated Duration
        </ThemedText>

        <View className="my-2">
          <Controller
            control={control}
            name="autoFillDuration"
            render={({ field }) => (
              <FormCheckbox
                label="Auto-filled"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);

                  if (value) {
                    clearErrors([
                      "durationHours",
                      "durationMinutes",
                      "durationSeconds",
                    ]);
                  }
                }}
                error={!!errors.autoFillDuration}
                disabled={!hasExercises}
              />
            )}
          />
        </View>

        <View className="flex-row justify-between gap-3">
          <View className="flex-1">
            <Controller
              control={control}
              name="durationHours"
              render={({ field, fieldState }) => (
                <FormNumberInput
                  value={field.value}
                  onChange={field.onChange}
                  min={0}
                  step={1}
                  placeholder="0"
                  error={!!fieldState.error}
                  disabled={autoFillDuration}
                />
              )}
            />

            <ThemedText
              type="default"
              variant="primary"
              className="mt-2 self-center"
            >
              Hours
            </ThemedText>
          </View>

          <View className="flex-1">
            <Controller
              control={control}
              name="durationMinutes"
              render={({ field, fieldState }) => (
                <FormNumberInput
                  value={field.value}
                  onChange={field.onChange}
                  min={0}
                  max={59}
                  step={1}
                  placeholder="0"
                  error={!!fieldState.error}
                  disabled={autoFillDuration}
                />
              )}
            />

            <ThemedText
              type="default"
              variant="primary"
              className="mt-2 self-center"
            >
              Minutes
            </ThemedText>
          </View>

          <View className="flex-1">
            <Controller
              control={control}
              name="durationSeconds"
              render={({ field, fieldState }) => (
                <FormNumberInput
                  value={field.value}
                  onChange={field.onChange}
                  min={0}
                  max={59}
                  step={1}
                  placeholder="0"
                  error={!!fieldState.error}
                  disabled={autoFillDuration}
                />
              )}
            />

            <ThemedText
              type="default"
              variant="primary"
              className="mt-2 self-center"
            >
              Seconds
            </ThemedText>
          </View>
        </View>

        <FormErrorMessage message={durationErrorMessage} />
      </View>

      {/* Exercise List */}
      <View className="mt-6">
        <SectionHeader
          title="Exercise List"
          action={
            <ExerciseListMenu
              isDisabled={fields.length === 0}
              showFullExerciseDetails={showFullExerciseDetails}
              actions={{
                toggleShowFullExerciseDetails,
                handleOpenManageMode,
                handleRemoveAllExercises,
              }}
            />
          }
        />

        {fields.length === 0 ? (
          <View className="py-2">
            <ThemedText type="default" variant="accent">
              No exercises added yet
            </ThemedText>

            <ThemedText type="default" variant="primary">
              Tap the + button to add your first exercise
            </ThemedText>

            <FormErrorMessage message={errors.workoutExercises?.message} />
          </View>
        ) : (
          fields.map((item, index) => (
            <View key={item.fieldId} className="mt-2">
              <PlanWorkoutExerciseSection
                form={form}
                index={index}
                onDeleteExercise={() => handleRemoveExercise(index)}
                onReplaceExercise={() => handleReplaceExercise(item.clientId)}
              />
            </View>
          ))
        )}
      </View>
    </PageLayout>
  );
}
