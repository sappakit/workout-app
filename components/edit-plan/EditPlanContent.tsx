import { workoutApi } from "@/app/api/workout.api";
import FormTextInput from "@/components/form/FormTextInput";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { calculateWorkoutDurationFromExercises } from "@/lib/workout/utils";
import {
  WorkoutFocusType,
  WorkoutResponse,
} from "@/types/workout/workout.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { AppButton } from "../custom-ui/AppButton";
import { Separator } from "../custom-ui/Separator";
import FormCheckbox from "../form/FormCheckbox";
import FormInfiniteSelectInput from "../form/FormInfiniteSelectInput";
import FormNumberInput from "../form/FormNumberInput";
import { SectionHeader } from "../layout/SectionHeader";
import { ExerciseCard } from "../workout/ExerciseCard";

interface EditPlanContentProps {
  data: WorkoutResponse;
}

// TODO: refine later
const workoutExerciseSchema = z.object({
  id: z.number(),
  orderIndex: z.number(),
  plannedSets: z.number().nullish(),
  plannedRepsRange: z.string().nullish(),
  plannedWeight: z.number().nullish(),
  plannedRestTime: z.number().nullish(),
  plannedDuration: z.number().nullish(),
  plannedDistance: z.number().nullish(),
  exercise: z.any(),
});

const editPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  workoutFocusTypeId: z.number({
    error: "Workout type is required",
  }),
  targetMuscles: z
    .string()
    .min(1, "Enter target muscle groups or enable Auto-fill"),
  durationHours: z
    .number({ error: "Enter 0+ hours or enable Auto-fill" })
    .min(0, { message: "Minutes cannot be negative" }),
  durationMinutes: z
    .number({ error: "Enter 0+ minutes or enable Auto-fill" })
    .min(0, { message: "Minutes cannot be negative" }),
  durationSeconds: z
    .number({ error: "Enter 0+ seconds or enable Auto-fill" })
    .min(0, { message: "Seconds cannot be negative" }),
  autoFillMuscles: z.boolean(),
  autoFillDuration: z.boolean(),
  workoutExercises: z.array(workoutExerciseSchema),
});

type EditPlanForm = z.infer<typeof editPlanSchema>;

const WORKOUT_TYPES = [
  { label: "Strength", value: 1 },
  { label: "Cardio", value: 2 },
  { label: "Calisthenics", value: 3 },
];

export default function EditPlanContent({ data }: EditPlanContentProps) {
  const {
    control: control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditPlanForm>({
    resolver: zodResolver(editPlanSchema),
    mode: "onTouched",
    defaultValues: {
      name: data.name,
      workoutFocusTypeId: data.workoutFocusType.id,
      targetMuscles: "",
      durationHours: undefined,
      durationMinutes: undefined,
      durationSeconds: undefined,
      autoFillMuscles: false,
      autoFillDuration: false,
      workoutExercises: data.workoutExercises,
    },
  });

  const onSubmit = async (values: EditPlanForm) => {
    console.log("Edit plan values:", values);
    // TODO: connect API later
  };

  const durationErrorMessage =
    errors.durationHours?.message ||
    errors.durationMinutes?.message ||
    errors.durationSeconds?.message;

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

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setValue("durationHours", hours);
    setValue("durationMinutes", minutes);
    setValue("durationSeconds", seconds);
  }, [workoutExercises, autoFillDuration]);

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

  return (
    <PageLayout stickyFooter={footer}>
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
          render={({ field }) => (
            <FormTextInput
              placeholder="Enter plan name"
              value={field.value}
              onChangeText={field.onChange}
              error={!!errors.name}
            />
          )}
        />

        {errors.name?.message && (
          <ThemedText type="default" variant="error" className="mt-2 text-sm">
            {errors.name.message}
          </ThemedText>
        )}
      </View>

      {/* Workout Type */}
      <View className="mt-4">
        <ThemedText type="subtitle" variant="accent" className="mb-2">
          Workout Type
        </ThemedText>

        {/* <Controller
          control={control}
          name="workoutFocusTypeId"
          render={({ field }) => (
            <FormSelectInput
              options={WORKOUT_TYPES}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select workout type"
              error={!!errors.workoutFocusTypeId}
              title="Select Workout Type"
            />
          )}
        /> */}

        <Controller
          control={control}
          name="workoutFocusTypeId"
          render={({ field }) => (
            <FormInfiniteSelectInput<WorkoutFocusType>
              url={workoutApi.getTypes()}
              queryKey={["workout-types"]}
              mapOption={(item) => ({ label: item.name, value: item.id })}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select workout type"
              validationError={!!errors.workoutFocusTypeId}
              title="Select Workout Type"
              selectedOption={
                data.workoutFocusType && {
                  label: data.workoutFocusType.name,
                  value: data.workoutFocusType.id,
                }
              }
            />
          )}
        />

        {errors.workoutFocusTypeId?.message && (
          <ThemedText type="default" variant="error" className="mt-2 text-sm">
            {errors.workoutFocusTypeId.message}
          </ThemedText>
        )}
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
          render={({ field }) => (
            <FormTextInput
              placeholder="Chest, Triceps, Shoulders"
              value={field.value}
              onChangeText={field.onChange}
              error={!!errors.targetMuscles}
            />
          )}
        />

        {errors.targetMuscles?.message && (
          <ThemedText type="default" variant="error" className="mt-2 text-sm">
            {errors.targetMuscles.message}
          </ThemedText>
        )}
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
              render={({ field }) => (
                <FormNumberInput
                  value={field.value}
                  onChange={field.onChange}
                  min={0}
                  step={1}
                  placeholder="0"
                  error={!!errors.durationHours}
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
              render={({ field }) => (
                <FormNumberInput
                  value={field.value}
                  onChange={field.onChange}
                  min={0}
                  step={1}
                  placeholder="0"
                  error={!!errors.durationMinutes}
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
              render={({ field }) => (
                <FormNumberInput
                  value={field.value}
                  onChange={field.onChange}
                  min={0}
                  step={1}
                  placeholder="0"
                  error={!!errors.durationSeconds}
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

        {durationErrorMessage && (
          <ThemedText type="default" variant="error" className="mt-2 text-sm">
            {durationErrorMessage}
          </ThemedText>
        )}
      </View>

      <Separator orientation="horizontal" className="my-6" />

      {/* Exercise List */}
      <View>
        <SectionHeader title="Exercise List" />

        {fields.map((item, index) => (
          <ExerciseCard
            key={item.id}
            data={item}
            className={`${index > 0 ? "mt-4" : ""}`}
          />
        ))}
      </View>
    </PageLayout>
  );
}
