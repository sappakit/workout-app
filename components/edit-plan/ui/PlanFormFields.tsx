import { DurationBottomSheetPicker } from "@/components/bottom-sheet/picker/duration-picker/DurationPickerSheet";
import { RemoteOptionMultiSelectField } from "@/components/bottom-sheet/picker/option-picker/RemoteOptionMultiSelectField";
import { RemoteOptionPickerBottomSheet } from "@/components/bottom-sheet/picker/option-picker/RemoteOptionPickerBottomSheet";
import FormCheckbox from "@/components/form/FormCheckbox";
import { FormErrorMessage, FormField } from "@/components/form/FormField";
import { FormSelectTrigger } from "@/components/form/FormSelectTrigger";
import FormTextInput from "@/components/form/FormTextInput";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ContentFeedback } from "@/components/state/ContentFeedback";
import { muscleApi } from "@/lib/api/muscle.api";
import { workoutApi } from "@/lib/api/workout.api";
import { muscleQueryKeys } from "@/lib/exercise/keys";
import { workoutQueryKeys } from "@/lib/workout/keys";
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
import { ExerciseListMenu } from "./ExerciseListMenu";
import { PlanWorkoutExerciseSection } from "./WorkoutExerciseSection/PlanWorkoutExerciseSection";

type PlanFormFieldsProps = {
  form: UseFormReturn<EditPlanForm>;
  fields: FieldArrayWithId<EditPlanForm, "workoutExercises", "fieldId">[];
  hasExercises: boolean;
  autoFillMuscles: boolean;
  autoFillDuration: boolean;
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
              <RemoteOptionPickerBottomSheet<WorkoutFocusType>
                title="Select Workout Type"
                url={workoutApi.getTypes()}
                queryKey={workoutQueryKeys.type}
                selectionMode="single"
                value={field.value}
                onChange={field.onChange}
                mapOption={(item) => ({
                  label: item.name,
                  value: item.id,
                })}
                trigger={({ open, selectedOption }) => (
                  <FormSelectTrigger
                    label={selectedOption?.label ?? "Select workout type"}
                    placeholder={!selectedOption}
                    onPress={open}
                    error={!!fieldState.error}
                  />
                )}
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
                    size="sm"
                    value={autoFillField.value}
                    onChange={autoFillField.onChange}
                    error={!!errors.autoFillMuscles}
                    disabled={!hasExercises}
                  />
                )}
              />

              <RemoteOptionMultiSelectField<Muscle>
                title="Select Target Muscles"
                url={muscleApi.getAll()}
                queryKey={muscleQueryKeys.all}
                value={field.value}
                onChange={field.onChange}
                mapOption={(item) => ({
                  label: item.name,
                  value: item.id,
                })}
                placeholder="Select target muscle group"
                selectedSingularLabel="muscle group selected"
                selectedPluralLabel="muscle groups selected"
                disabled={autoFillMuscles}
                error={!!fieldState.error}
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
                    size="sm"
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
                triggerVariant="field"
                error={!!fieldState.error}
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
