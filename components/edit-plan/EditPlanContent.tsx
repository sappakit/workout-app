import { muscleApi } from "@/app/api/muscle.api";
import { workoutApi } from "@/app/api/workout.api";
import FormTextInput from "@/components/form/FormTextInput";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { api } from "@/lib/api";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  mapEditPlanFormToUpdateWorkoutPayload,
  mapWorkoutResponseToEditPlanForm,
  secondsToHMS,
} from "@/lib/workout/mappers";
import { calculateWorkoutDurationFromExercises } from "@/lib/workout/utils";
import { EditPlanForm, editPlanFormSchema } from "@/schemas/edit-plan.schema";
import { useEditPlanDraftStore } from "@/stores/editPlanDraftStore";
import { useExerciseDisplayStore } from "@/stores/exerciseDisplayStore";
import { ExerciseMuscleItem } from "@/types/workout/response/exercise.types";
import { Muscle } from "@/types/workout/response/shared.types";
import {
  WorkoutFocusType,
  WorkoutResponse,
} from "@/types/workout/response/workout.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Plus, Save } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Alert, View } from "react-native";
import { AppButton } from "../custom-ui/AppButton";
import { Separator } from "../custom-ui/Separator";
import FormCheckbox from "../form/FormCheckbox";
import { FormErrorMessage } from "../form/FormErrorMessage";
import FormNumberInput from "../form/FormNumberInput";
import FormInfiniteMultiSelectInput from "../form/select-input/FormInfiniteMultiSelectInput";
import FormInfiniteSelectInput from "../form/select-input/FormInfiniteSelectInput";
import { SectionHeader } from "../layout/SectionHeader";
import { ExerciseCardEdit } from "../workout/ui/exercise-card/ExerciseCardEdit";
import { ExerciseListMenu } from "./ExerciseListMenu";

interface EditPlanContentProps {
  data: WorkoutResponse;
}

export default function EditPlanContent({ data }: EditPlanContentProps) {
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
  const draftWorkoutId = useEditPlanDraftStore((state) => state.workoutId);
  const draft = useEditPlanDraftStore((state) => state.draft);
  const initializeDraft = useEditPlanDraftStore(
    (state) => state.initializeDraft,
  );
  const replaceDraft = useEditPlanDraftStore((state) => state.replaceDraft);
  const resetDraft = useEditPlanDraftStore((state) => state.resetDraft);

  // Base values from API response
  const mappedDefaultValues = useMemo(
    () => mapWorkoutResponseToEditPlanForm(data),
    [data],
  );

  // If store already contains draft for this workout, use it instead
  const initialFormValues = useMemo(() => {
    if (draftWorkoutId === data.id && draft) {
      return draft;
    }

    return mappedDefaultValues;
  }, [draftWorkoutId, draft, data.id, mappedDefaultValues]);

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

  const { fields, replace } = useFieldArray({
    control,
    name: "workoutExercises",
    keyName: "fieldId",
  });

  const workoutExercises = useWatch({
    control,
    name: "workoutExercises",
  });

  // Initialize Zustand draft once for this workout
  useEffect(() => {
    initializeDraft(data.id, initialFormValues);
  }, [data.id, initialFormValues, initializeDraft]);

  // When draft changes from another page (like manage mode),
  // refresh RHF so this screen reflects the latest shared draft.
  useEffect(() => {
    if (draftWorkoutId !== data.id || !draft) return;

    // Wait for the page to fully mount
    const frame = requestAnimationFrame(() => {
      reset(draft, {
        keepDefaultValues: true,
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [draftWorkoutId, draft, data.id, reset]);

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
        workoutQueryKeys.schedule,
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
  }, [workoutExercises, autoFillDuration]);

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

  // Cancel edit
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

  // Open the manage mode page
  const handleOpenManageMode = () => {
    // Update Zustand state with the latest form values
    replaceDraft(getValues());

    router.push("/(modal)/workout/manage-exercises");
  };

  // Open the add exercise page
  const handleOpenAddExercise = () => {
    replaceDraft(getValues());

    router.push("/(modal)/workout/add-exercise");
  };

  const footer = (
    <>
      <AppButton
        title="Save Changes"
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

  // TODO: remove
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form errors:", errors);
    }
  }, [errors]);

  return (
    <PageLayout
      headerProps={{
        variant: "title",
        title: "Edit Plan",
        showBackButton: true,
        onBackPress: handleCancelEdit,
      }}
      stickyFooter={{
        content: footer,
        options: { addBottomInset: true },
      }}
    >
      {/* Title */}
      <ThemedText type="title" variant="accent">
        Edit Plan
      </ThemedText>

      {/* Plan Name */}
      <View className="mt-4">
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
                selectedOption={
                  data.workoutFocusType && {
                    label: data.workoutFocusType.name,
                    value: data.workoutFocusType.id,
                  }
                }
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

        {/* Auto-filed */}
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
                queryKey={["muscles"]}
                mapOption={(item) => ({ label: item.name, value: item.id })}
                value={field.value}
                onChange={field.onChange}
                selectedOptions={data.muscles.map((item) => ({
                  label: item.muscle.name,
                  value: item.muscle.id,
                }))}
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

      <Separator orientation="horizontal" className="my-6" />

      {/* Exercise List */}
      <View>
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
          <View className="gap-2 py-2">
            <ThemedText type="default" variant="secondary">
              No exercises added yet
            </ThemedText>

            <ThemedText type="default" variant="primary">
              Tap the + button to add your first exercise
            </ThemedText>
          </View>
        ) : (
          fields.map((item, index) => (
            <ExerciseCardEdit
              key={item.fieldId}
              form={form}
              index={index}
              className="mt-2 rounded-3xl"
            />
          ))
        )}
      </View>
    </PageLayout>
  );
}
