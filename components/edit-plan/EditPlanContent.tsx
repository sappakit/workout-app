import { muscleApi } from "@/app/api/muscle.api";
import { workoutApi } from "@/app/api/workout.api";
import FormTextInput from "@/components/form/FormTextInput";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { invalidateQueryKeys } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutMutationKeys, workoutQueryKeys } from "@/lib/workout/keys";
import {
  mapEditPlanFormToUpdateWorkoutPayload,
  mapExerciseToCreateWorkoutExerciseFormItem,
  mapWorkoutResponseToEditPlanForm,
  secondsToHMS,
} from "@/lib/workout/mappers";
import { calculateWorkoutDurationFromExercises } from "@/lib/workout/utils";
import { EditPlanForm, editPlanFormSchema } from "@/schemas/edit-plan.schema";
import { useEditPlanDraftStore } from "@/stores/editPlanDraftStore";
import {
  Exercise,
  ExerciseMuscleItem,
} from "@/types/workout/response/exercise.types";
import { Muscle } from "@/types/workout/response/shared.types";
import {
  WorkoutFocusType,
  WorkoutResponse,
} from "@/types/workout/response/workout.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  ArrowUpDown,
  PanelTopOpen,
  Plus,
  Save,
  Trash2,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Alert, View } from "react-native";
import { AppButton } from "../custom-ui/AppButton";
import { Separator } from "../custom-ui/Separator";
import FormCheckbox from "../form/FormCheckbox";
import { FormErrorMessage } from "../form/FormErrorMessage";
import FormNumberInput from "../form/FormNumberInput";
import ExercisePickerModal from "../form/picker/ExercisePickerModal";
import FormInfiniteMultiSelectInput from "../form/select-input/FormInfiniteMultiSelectInput";
import FormInfiniteSelectInput from "../form/select-input/FormInfiniteSelectInput";
import { SectionHeader } from "../layout/SectionHeader";
import {
  DropdownItem,
  MenuSectionLabel,
  OptionsMenu,
} from "../optionsMenu/OptionsMenu";
import { ExerciseCardEdit } from "../workout/exercise-card/ExerciseCardEdit";

interface EditPlanContentProps {
  data: WorkoutResponse;
}

export default function EditPlanContent({ data }: EditPlanContentProps) {
  const { colors } = useAppTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useAppToast();

  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);

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
    formState: { errors, isDirty },
  } = form;

  const { fields, append, remove } = useFieldArray({
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
    mutationKey: workoutMutationKeys.update(data.id),
    mutationFn: async (values: EditPlanForm) => {
      const url = workoutApi.update(data.id);
      const payload = mapEditPlanFormToUpdateWorkoutPayload(values);

      console.log(payload);

      // return await api.patch(url, payload);
    },
    onSuccess: async (_, values) => {
      form.reset(values);
      replaceDraft(values);

      await invalidateQueryKeys(queryClient, [
        workoutQueryKeys.detail(data.id),
        workoutQueryKeys.schedule,
      ]);

      toast.success({
        title: "Plan updated",
        message: "Your workout plan has been saved.",
      });
    },
    onError: (_err: unknown) => {
      toast.error({
        title: "Update failed",
        message: "Unable to save workout plan.",
      });
    },
  });

  const onSubmit = (values: EditPlanForm) => {
    mutate(values);
  };

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

    const totalSeconds = calculateWorkoutDurationFromExercises(
      workoutExercises,
      { timeType: "seconds" },
    );

    const { hours, minutes, seconds } = secondsToHMS(totalSeconds);

    setValue("durationHours", hours ?? 0);
    setValue("durationMinutes", minutes ?? 0);
    setValue("durationSeconds", seconds ?? 0);
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
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [workoutExercises, autoFillMuscles, setValue]);

  // Add exercise
  const handleAddExercise = (exercise: Exercise) => {
    const exists = workoutExercises.some(
      (item) => item.exercise.id === exercise.id,
    );

    if (exists) return;

    const nextOrderIndex =
      workoutExercises.length > 0
        ? Math.max(...workoutExercises.map((item) => item.orderIndex)) + 1
        : 1;

    append(
      mapExerciseToCreateWorkoutExerciseFormItem(exercise, nextOrderIndex),
    );
  };

  // Remove exercise
  const handleRemoveExercise = (indexToRemove: number) => {
    const nextExercises = workoutExercises.filter(
      (_, index) => index !== indexToRemove,
    );

    remove(indexToRemove);

    nextExercises.forEach((_, index) => {
      setValue(`workoutExercises.${index}.orderIndex`, index + 1, {
        shouldDirty: true,
        shouldValidate: false,
      });
    });
  };

  const handleOpenManageMode = () => {
    // Make sure the latest RHF values are in Zustand before navigating
    replaceDraft(getValues());

    router.push({
      pathname: "/(pages)/workout/[id]/edit/manage-exercises",
      params: { id: String(data.id) },
    });
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
        onPress={() => setIsExercisePickerOpen(true)}
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
      stickyFooter={{
        content: footer,
        options: { addBottomInset: true },
      }}
    >
      {/* TODO: remove this */}
      <View className="my-4">
        <AppButton
          title="Back (Cancel Edit)"
          variant="secondary"
          onPress={handleCancelEdit}
        />
      </View>

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
                onChange={field.onChange}
                error={!!errors.autoFillMuscles}
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
                onChange={field.onChange}
                error={!!errors.autoFillDuration}
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
            <OptionsMenu>
              <MenuSectionLabel label="Actions" />

              <DropdownItem
                label="Show full details"
                icon={PanelTopOpen}
                // checked={expanded}
                // onSelect={() => {
                //   setExpanded((prev) => !prev);

                //   // Prevent menu closing
                //   return false;
                // }}
              />
              <DropdownItem
                label="Manage exercises"
                icon={ArrowUpDown}
                onSelect={handleOpenManageMode}
              />
              <DropdownItem
                label="Remove all"
                color={colors.app.error}
                icon={Trash2}
              />
            </OptionsMenu>
          }
        />

        {/* TODO: remove */}
        {/* <View className="mt-3">
          <AppButton
            title="Manage Exercises"
            variant="secondary"
            icon={ArrowUpDown}
            onPress={handleOpenManageMode}
          />
        </View> */}

        <View className="mt-4">
          {fields.map((item, index) => (
            <ExerciseCardEdit
              key={item.fieldId}
              form={form}
              index={index}
              className={index > 0 ? "mt-4" : ""}
            />
          ))}
        </View>
      </View>

      {/* Exercise picker */}
      <ExercisePickerModal
        visible={isExercisePickerOpen}
        onClose={() => setIsExercisePickerOpen(false)}
        onDone={(selectedExercises) => {
          selectedExercises.forEach(handleAddExercise);
          setIsExercisePickerOpen(false);
        }}
        selectedExerciseIds={workoutExercises.map((item) => item.exercise.id)}
      />
    </PageLayout>
  );
}

function ExerciseListMenu() {
  const { colors } = useAppTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <OptionsMenu>
      <MenuSectionLabel label="Actions" />

      <DropdownItem
        label="Show full details"
        icon={PanelTopOpen}
        checked={expanded}
        onSelect={() => {
          setExpanded((prev) => !prev);

          // Prevent menu closing
          return false;
        }}
      />
      <DropdownItem
        label="Manage exercises"
        icon={ArrowUpDown}
        onSelect={() => {}}
      />
      <DropdownItem label="Remove all" color={colors.app.error} icon={Trash2} />
    </OptionsMenu>
  );
}
