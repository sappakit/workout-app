import { AppButton } from "@/components/custom-ui/AppButton";
import { FormErrorMessage } from "@/components/form/FormErrorMessage";
import FormNumberInput from "@/components/form/FormNumberInput";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  ExerciseTypeFieldConfig,
  getVisibleFields,
} from "@/lib/workout/config";
import { EditPlanForm } from "@/schemas/edit-plan.schema";
import { Save } from "lucide-react-native";
import {
  Controller,
  UseFormReturn,
  useFormState,
  useWatch,
} from "react-hook-form";
import { View } from "react-native";

interface ExerciseCardEditFieldsProps {
  form: UseFormReturn<EditPlanForm>;
  index: number;
  hasTriedSave: boolean;
  onSave: () => void | Promise<void>;
  typeConfig: ExerciseTypeFieldConfig;
}

export default function ExerciseCardEditFields({
  form,
  index,
  hasTriedSave,
  onSave,
  typeConfig,
}: ExerciseCardEditFieldsProps) {
  const { colors } = useAppTheme();
  const { control, trigger } = form;

  const data = useWatch({
    control,
    name: `workoutExercises.${index}`,
  });

  const { errors: formErrors } = useFormState({
    control,
    name: `workoutExercises.${index}`,
  });

  if (!data) return null;

  const repsErrorMessage =
    formErrors.workoutExercises?.[index]?.plannedRepsMin?.message ||
    formErrors.workoutExercises?.[index]?.plannedRepsMax?.message;

  const restTimeErrorMessage =
    formErrors.workoutExercises?.[index]?.plannedRestMinutes?.message ||
    formErrors.workoutExercises?.[index]?.plannedRestSeconds?.message;

  const durationErrorMessage =
    formErrors.workoutExercises?.[index]?.plannedDurationMinutes?.message ||
    formErrors.workoutExercises?.[index]?.plannedDurationSeconds?.message;

  // Display data based on exercsie type
  const visibleFields = getVisibleFields(typeConfig);

  return (
    <View
      className="gap-2 rounded-lg p-2"
      style={{
        backgroundColor: colors.app.cardSecondary,
      }}
    >
      {/* Total Sets */}
      {visibleFields.has("plannedSets") && (
        <View>
          <ThemedText type="default" variant="primary" className="mb-1 text-xs">
            Total Sets
          </ThemedText>

          <Controller
            control={control}
            name={`workoutExercises.${index}.plannedSets`}
            render={({ field, fieldState }) => (
              <>
                <FormNumberInput
                  style={{ backgroundColor: colors.app.cardTertiary }}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value ?? null);

                    // Auto validate after submitted
                    if (hasTriedSave) {
                      void trigger(`workoutExercises.${index}.plannedSets`);
                    }
                  }}
                  min={0}
                  step={1}
                  placeholder="0"
                  error={!!fieldState.error}
                />

                <FormErrorMessage
                  message={fieldState.error?.message}
                  className="mt-1 text-xs"
                />
              </>
            )}
          />
        </View>
      )}

      {/* Reps per set */}
      {visibleFields.has("plannedRepsRange") && (
        <View>
          <ThemedText type="default" variant="primary" className="mb-1 text-xs">
            Reps per Set
          </ThemedText>

          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <Controller
                control={control}
                name={`workoutExercises.${index}.plannedRepsMin`}
                render={({ field, fieldState }) => (
                  <FormNumberInput
                    style={{ backgroundColor: colors.app.cardTertiary }}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value ?? null);

                      if (hasTriedSave) {
                        void trigger([
                          `workoutExercises.${index}.plannedRepsMin`,
                          `workoutExercises.${index}.plannedRepsMax`,
                        ]);
                      }
                    }}
                    min={0}
                    step={1}
                    placeholder="0"
                    error={!!fieldState.error}
                  />
                )}
              />
            </View>

            <View
              className="h-0.5 w-3 rounded"
              style={{
                backgroundColor: colors.app.borderSecondary,
              }}
            />

            <View className="flex-1">
              <Controller
                control={control}
                name={`workoutExercises.${index}.plannedRepsMax`}
                render={({ field, fieldState }) => (
                  <FormNumberInput
                    style={{ backgroundColor: colors.app.cardTertiary }}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value ?? null);

                      if (hasTriedSave) {
                        void trigger([
                          `workoutExercises.${index}.plannedRepsMin`,
                          `workoutExercises.${index}.plannedRepsMax`,
                        ]);
                      }
                    }}
                    min={0}
                    step={1}
                    placeholder="0"
                    error={!!fieldState.error}
                  />
                )}
              />
            </View>
          </View>

          <FormErrorMessage
            message={repsErrorMessage}
            className="mt-1 text-xs"
          />
        </View>
      )}

      {/* Weight / Load */}
      {visibleFields.has("plannedWeight") && (
        <View>
          <ThemedText type="default" variant="primary" className="mb-1 text-xs">
            {"Load (kg)"}
          </ThemedText>

          <Controller
            control={control}
            name={`workoutExercises.${index}.plannedWeight`}
            render={({ field, fieldState }) => (
              <>
                <FormNumberInput
                  style={{ backgroundColor: colors.app.cardTertiary }}
                  allowDecimal
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value ?? null);

                    if (hasTriedSave) {
                      void trigger(`workoutExercises.${index}.plannedWeight`);
                    }
                  }}
                  min={0}
                  max={1000}
                  step={0.25}
                  placeholder="0"
                  error={!!fieldState.error}
                />

                <FormErrorMessage
                  message={fieldState.error?.message}
                  className="mt-1 text-xs"
                />
              </>
            )}
          />
        </View>
      )}

      {/* Rest time per set */}
      {visibleFields.has("plannedRestTime") && (
        <View>
          <ThemedText type="default" variant="primary" className="mb-1 text-xs">
            Rest time per set
          </ThemedText>

          <View className="flex-row justify-between gap-2">
            <View className="flex-1">
              <Controller
                control={control}
                name={`workoutExercises.${index}.plannedRestMinutes`}
                render={({ field, fieldState }) => (
                  <>
                    <FormNumberInput
                      style={{
                        backgroundColor: colors.app.cardTertiary,
                      }}
                      value={field.value}
                      onChange={(minutes) => {
                        field.onChange(minutes ?? null);

                        if (hasTriedSave) {
                          void trigger([
                            `workoutExercises.${index}.plannedRestMinutes`,
                            `workoutExercises.${index}.plannedRestSeconds`,
                          ]);
                        }
                      }}
                      min={0}
                      step={1}
                      placeholder="0"
                      error={!!fieldState.error}
                    />

                    <ThemedText
                      type="default"
                      variant="primary"
                      className="mt-2 self-center text-xs"
                    >
                      Minutes
                    </ThemedText>
                  </>
                )}
              />
            </View>

            <View className="flex-1">
              <Controller
                control={control}
                name={`workoutExercises.${index}.plannedRestSeconds`}
                render={({ field, fieldState }) => (
                  <>
                    <FormNumberInput
                      style={{
                        backgroundColor: colors.app.cardTertiary,
                      }}
                      value={field.value}
                      onChange={(seconds) => {
                        field.onChange(seconds ?? null);

                        if (hasTriedSave) {
                          void trigger([
                            `workoutExercises.${index}.plannedRestMinutes`,
                            `workoutExercises.${index}.plannedRestSeconds`,
                          ]);
                        }
                      }}
                      min={0}
                      max={59}
                      step={1}
                      placeholder="0"
                      error={!!fieldState.error}
                    />

                    <ThemedText
                      type="default"
                      variant="primary"
                      className="mt-2 self-center text-xs"
                    >
                      Seconds
                    </ThemedText>
                  </>
                )}
              />
            </View>
          </View>

          <FormErrorMessage
            message={restTimeErrorMessage}
            className="mt-1 text-xs"
          />
        </View>
      )}

      {/* Duration */}
      {visibleFields.has("plannedDuration") && (
        <View>
          <ThemedText type="default" variant="primary" className="mb-1 text-xs">
            Duration
          </ThemedText>

          <View className="flex-row justify-between gap-2">
            <View className="flex-1">
              <Controller
                control={control}
                name={`workoutExercises.${index}.plannedDurationMinutes`}
                render={({ field, fieldState }) => (
                  <>
                    <FormNumberInput
                      style={{ backgroundColor: colors.app.cardTertiary }}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value ?? null);

                        if (hasTriedSave) {
                          void trigger([
                            `workoutExercises.${index}.plannedDurationMinutes`,
                            `workoutExercises.${index}.plannedDurationSeconds`,
                          ]);
                        }
                      }}
                      min={0}
                      step={1}
                      placeholder="0"
                      error={!!fieldState.error}
                    />

                    <ThemedText
                      type="default"
                      variant="primary"
                      className="mt-2 self-center text-xs"
                    >
                      Minutes
                    </ThemedText>
                  </>
                )}
              />
            </View>

            <View className="flex-1">
              <Controller
                control={control}
                name={`workoutExercises.${index}.plannedDurationSeconds`}
                render={({ field, fieldState }) => (
                  <>
                    <FormNumberInput
                      style={{ backgroundColor: colors.app.cardTertiary }}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value ?? null);

                        if (hasTriedSave) {
                          void trigger([
                            `workoutExercises.${index}.plannedDurationMinutes`,
                            `workoutExercises.${index}.plannedDurationSeconds`,
                          ]);
                        }
                      }}
                      min={0}
                      max={59}
                      step={1}
                      placeholder="0"
                      error={!!fieldState.error}
                    />

                    <ThemedText
                      type="default"
                      variant="primary"
                      className="mt-2 self-center text-xs"
                    >
                      Seconds
                    </ThemedText>
                  </>
                )}
              />
            </View>
          </View>

          <FormErrorMessage
            message={durationErrorMessage}
            className="mt-1 text-xs"
          />
        </View>
      )}

      {/* Distance */}
      {visibleFields.has("plannedDistance") && (
        <View>
          <ThemedText type="default" variant="primary" className="mb-1 text-xs">
            Distance
          </ThemedText>

          <Controller
            control={control}
            name={`workoutExercises.${index}.plannedDistance`}
            render={({ field, fieldState }) => (
              <>
                <FormNumberInput
                  style={{ backgroundColor: colors.app.cardTertiary }}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value ?? null);

                    if (hasTriedSave) {
                      void trigger(`workoutExercises.${index}.plannedDistance`);
                    }
                  }}
                  min={0}
                  step={1}
                  placeholder="0"
                  error={!!fieldState.error}
                />

                <FormErrorMessage
                  message={fieldState.error?.message}
                  className="mt-1 text-xs"
                />
              </>
            )}
          />
        </View>
      )}

      {/* Save changes */}
      <AppButton
        title="Save Changes"
        variant="primary"
        icon={Save}
        className="rounded-md"
        textClassName="font-medium"
        onPress={onSave}
        // loading={isPending}
      />
    </View>
  );
}
