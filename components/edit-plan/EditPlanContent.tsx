import { exerciseApi, muscleApi, workoutApi } from "@/app/api/workout.api";
import FormTextInput from "@/components/form/FormTextInput";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { getGroupedFieldError } from "@/lib/forms/utils";
import {
  mapEditPlanFormToUpdateWorkoutPayload,
  mapWorkoutResponseToEditPlanForm,
  secondsToHMS,
} from "@/lib/workout/mappers";
import { calculateWorkoutDurationFromExercises } from "@/lib/workout/utils";
import { EditPlanForm, editPlanFormSchema } from "@/schemas/edit-plan.schema";
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
import { Plus, Save } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { View } from "react-native";
import { AppButton } from "../custom-ui/AppButton";
import { Separator } from "../custom-ui/Separator";
import FormCheckbox from "../form/FormCheckbox";
import { FormErrorMessage } from "../form/FormErrorMessage";
import FormNumberInput from "../form/FormNumberInput";
import FormInfiniteSelectInputExercise from "../form/select-input/exercise/FormInfiniteSelectInputExercise";
import { SelectOption } from "../form/select-input/exercise/FormSelectInputExercise";
import FormInfiniteMultiSelectInput from "../form/select-input/FormInfiniteMultiSelectInput";
import FormInfiniteSelectInput from "../form/select-input/FormInfiniteSelectInput";
import { SectionHeader } from "../layout/SectionHeader";
import { ExerciseCardEdit } from "../workout/exercise-card/ExerciseCardEdit";

interface EditPlanContentProps {
  data: WorkoutResponse;
}

export default function EditPlanContent({ data }: EditPlanContentProps) {
  const form = useForm<EditPlanForm>({
    resolver: zodResolver(editPlanFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: mapWorkoutResponseToEditPlanForm(data),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values: EditPlanForm) => {
    const payload = mapEditPlanFormToUpdateWorkoutPayload(values);
    console.log("Edit plan values:", payload);
    // TODO: connect API later
  };

  // Duration errors
  const durationErrorMessage = getGroupedFieldError(
    errors,
    "durationHours",
    "durationMinutes",
    "durationSeconds",
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workoutExercises",
  });

  const workoutExercises = useWatch({
    control,
    name: "workoutExercises",
  });

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

  // TODO: remove
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form errors:", errors);
    }
  }, [errors]);

  const footer = (
    <>
      <AppButton
        title="Save Changes"
        variant="primary"
        icon={Save}
        className="flex-1"
        textClassName="font-medium"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
      />

      <AppButton
        variant="secondary"
        icon={Plus}
        className="h-12 w-12"
        // onPress={handleSubmit(onSubmit)}
        // loading={loading}
      />
    </>
  );

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

    const defaultRepsRange = exercise.defaultRepsRange ?? null;
    const [minRepsRaw, maxRepsRaw] = defaultRepsRange
      ? defaultRepsRange.split("-")
      : [];

    const plannedRepsMin =
      minRepsRaw != null && minRepsRaw !== "" ? Number(minRepsRaw) : null;

    const plannedRepsMax =
      maxRepsRaw != null && maxRepsRaw !== "" ? Number(maxRepsRaw) : null;

    append({
      id: Date.now(),
      orderIndex: nextOrderIndex,
      plannedSets: exercise.defaultSets ?? null,

      // plannedRepsRange
      plannedRepsMin:
        plannedRepsMin != null && Number.isFinite(plannedRepsMin)
          ? plannedRepsMin
          : null,
      plannedRepsMax:
        plannedRepsMax != null && Number.isFinite(plannedRepsMax)
          ? plannedRepsMax
          : null,

      plannedWeight: null,

      // plannedRestTime
      plannedRestMinutes:
        exercise.defaultRestTime != null
          ? Math.floor(exercise.defaultRestTime / 60)
          : null,
      plannedRestSeconds:
        exercise.defaultRestTime != null ? exercise.defaultRestTime % 60 : null,

      // plannedDuration
      plannedDurationMinutes:
        exercise.defaultDuration != null
          ? Math.floor(exercise.defaultDuration / 60)
          : null,
      plannedDurationSeconds:
        exercise.defaultDuration != null ? exercise.defaultDuration % 60 : null,

      plannedDistance: null,
      exercise,
    });
  };

  return (
    <PageLayout
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
        <SectionHeader title="Exercise List" />

        <View className="mt-4">
          <FormInfiniteSelectInputExercise<Exercise>
            url={exerciseApi.getAll()}
            queryKey={["exercises"]}
            mapOption={(item) => ({
              label: item.name,
              value: item.id,
              data: item,
            })}
            onChange={(_, option?: SelectOption<Exercise>) => {
              if (!option?.data) return;
              handleAddExercise(option.data);
            }}
            placeholder="Add exercise"
            title="Select Exercise"
            snapPoints={["70%"]}
          />
        </View>

        <View className="mt-4">
          {fields.map((item, index) => (
            <ExerciseCardEdit
              key={item.id}
              form={form}
              index={index}
              className={index > 0 ? "mt-4" : ""}
            />
          ))}
        </View>
      </View>
    </PageLayout>
  );
}
