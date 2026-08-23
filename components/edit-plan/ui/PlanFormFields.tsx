import FormCheckbox from "@/components/form/FormCheckbox";
import { FormErrorMessage, FormField } from "@/components/form/FormField";
import FormTextInput from "@/components/form/FormTextInput";
import { DurationBottomSheetPicker } from "@/components/form/picker/duration-picker/DurationPickerSheet";
import FormInfiniteMultiSelectInput from "@/components/form/select-input/FormInfiniteMultiSelectInput";
import FormInfiniteSelectInput from "@/components/form/select-input/FormInfiniteSelectInput";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ContentFeedback } from "@/components/state/ContentFeedback";
import { muscleApi } from "@/lib/api/muscle.api";
import { workoutApi } from "@/lib/api/workout.api";
import { muscleQueryKeys } from "@/lib/exercise/keys";
import type { EditPlanForm } from "@/schemas/edit-plan.schema";
import type { Muscle } from "@/types/workout/response/shared.types";
import type { WorkoutFocusType } from "@/types/workout/response/workout.types";
import {
  Controller,
  type FieldArrayWithId,
  type UseFormReturn,
  useFormState,
} from "react-hook-form";
import { View } from "react-native";
import { DurationPickerTrigger } from "./DurationPickerTrigger";
import { ExerciseListMenu } from "./ExerciseListMenu";
import { PlanWorkoutExerciseSection } from "./WorkoutExerciseSection/PlanWorkoutExerciseSection";

type SelectOption = {
  label: string;
  value: number;
};

type PlanFormFieldsProps = {
  form: UseFormReturn<EditPlanForm>;
  fields: FieldArrayWithId<EditPlanForm, "workoutExercises", "fieldId">[];
  hasExercises: boolean;
  autoFillMuscles: boolean;
  autoFillDuration: boolean;
  selectedWorkoutFocusTypeOption?: SelectOption;
  selectedTargetMuscleOptions?: SelectOption[];
  onOpenManageMode: () => void;
  onRemoveAllExercises: () => void;
  onRemoveExercise: (index: number) => void;
  onReplaceExercise: (exerciseClientId: string) => void;
};

export function PlanFormFields({
  form,
  fields,
  hasExercises,
  autoFillMuscles,
  autoFillDuration,
  selectedWorkoutFocusTypeOption,
  selectedTargetMuscleOptions = [],
  onOpenManageMode,
  onRemoveAllExercises,
  onRemoveExercise,
  onReplaceExercise,
}: PlanFormFieldsProps) {
  const { control } = form;

  const { errors } = useFormState({
    control,
  });

  return (
    <View className="gap-4">
      <View className="gap-2">
        <SectionHeader title="Detail" />

        {/* Plan name */}
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <FormField
              label="Plan Name"
              errorMessage={fieldState.error?.message}
            >
              <FormTextInput
                placeholder="Enter plan name"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={!!fieldState.error}
              />
            </FormField>
          )}
        />

        {/* Workout type */}
        <Controller
          control={control}
          name="workoutFocusTypeId"
          render={({ field, fieldState }) => (
            <FormField
              label="Workout Type"
              errorMessage={fieldState.error?.message}
            >
              <FormInfiniteSelectInput<WorkoutFocusType>
                allowEmpty
                emptySelectionLabel="No workout type"
                url={workoutApi.getTypes()}
                queryKey={["workout-types"]}
                mapOption={(item) => ({
                  label: item.name,
                  value: item.id,
                })}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select workout type"
                validationError={!!fieldState.error}
                title="Select Workout Type"
                snapPoints={["70%"]}
                selectedOption={selectedWorkoutFocusTypeOption}
              />
            </FormField>
          )}
        />

        {/* Target muscle groups */}
        <Controller
          control={control}
          name="targetMuscles"
          render={({ field, fieldState }) => (
            <FormField
              label="Target Muscle Groups"
              errorMessage={fieldState.error?.message}
            >
              {/* Auto-filled muscle groups */}
              <Controller
                control={control}
                name="autoFillMuscles"
                render={({ field: autoFillField }) => (
                  <FormCheckbox
                    label="Auto-filled"
                    value={autoFillField.value}
                    onChange={autoFillField.onChange}
                    error={!!errors.autoFillMuscles}
                    disabled={!hasExercises}
                  />
                )}
              />

              <FormInfiniteMultiSelectInput<Muscle>
                url={muscleApi.getAll()}
                queryKey={muscleQueryKeys.all}
                mapOption={(item) => ({
                  label: item.name,
                  value: item.id,
                })}
                value={field.value}
                onChange={field.onChange}
                selectedOptions={selectedTargetMuscleOptions}
                placeholder="Select target muscle group"
                validationError={!!fieldState.error}
                title="Select Target Muscles"
                snapPoints={["70%"]}
                disabled={autoFillMuscles}
              />
            </FormField>
          )}
        />

        {/* Estimated duration */}
        <Controller
          control={control}
          name="duration"
          render={({ field, fieldState }) => (
            <FormField
              label="Estimated Duration"
              errorMessage={fieldState.error?.message}
            >
              {/* Auto-filled duration */}
              <Controller
                control={control}
                name="autoFillDuration"
                render={({ field: autoFillField }) => (
                  <FormCheckbox
                    label="Auto-filled"
                    value={autoFillField.value}
                    onChange={autoFillField.onChange}
                    error={!!errors.autoFillDuration}
                    disabled={!hasExercises}
                  />
                )}
              />

              <DurationBottomSheetPicker
                title="Select Estimated Duration"
                value={field.value ?? 0}
                onChange={field.onChange}
                disabled={autoFillDuration}
                renderTrigger={({ value, openSheet, disabled }) => (
                  <DurationPickerTrigger
                    value={value}
                    onPress={openSheet}
                    disabled={disabled}
                    error={!!fieldState.error}
                  />
                )}
              />
            </FormField>
          )}
        />
      </View>

      {/* Exercise list */}
      <View className="gap-2">
        <SectionHeader
          title="Exercise List"
          action={
            <ExerciseListMenu
              isDisabled={fields.length === 0}
              actions={{
                handleOpenManageMode: onOpenManageMode,
                handleRemoveAllExercises: onRemoveAllExercises,
              }}
            />
          }
        />

        {fields.length === 0 ? (
          <View className="gap-2">
            <ContentFeedback
              icon="exercise"
              title="No exercises added yet"
              subtitle="Tap the + button to add your first exercise"
            />

            <FormErrorMessage message={errors.workoutExercises?.message} />
          </View>
        ) : (
          fields.map((item, index) => (
            <PlanWorkoutExerciseSection
              key={item.fieldId}
              form={form}
              index={index}
              onDeleteExercise={() => onRemoveExercise(index)}
              onReplaceExercise={() => onReplaceExercise(item.clientId)}
            />
          ))
        )}
      </View>
    </View>
  );
}
