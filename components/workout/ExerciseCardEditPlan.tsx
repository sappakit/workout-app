import { useAppTheme } from "@/hooks/useAppTheme";
import { exerciseTypeFieldConfig } from "@/lib/workout/config";
import { EditPlanForm } from "@/schemas/edit-plan.schema";
import {
  DifficultyLabel,
  ExerciseTypeLabel,
} from "@/types/workout/response/exercise.types";
import clsx from "clsx";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Dumbbell,
  FileText,
  Pencil,
  Save,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  Controller,
  UseFormReturn,
  useFormState,
  useWatch,
} from "react-hook-form";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { AppButton } from "../custom-ui/AppButton";
import Thumbnail from "../custom-ui/Thumbnail";
import FormNumberInput from "../form/FormNumberInput";
import { ThemedText } from "../themed-text";

type ExerciseInfoItem = {
  key: string;
  label: string;
  value: string;
};

interface ExerciseCardProps {
  form: UseFormReturn<EditPlanForm>;
  index: number;
  editable?: boolean;
  className?: string;
}

// TODO: handle cardio case (expected no sets, reps, etc, field)
export function ExerciseCard({
  form,
  index,
  editable = false,
  className,
}: ExerciseCardProps) {
  const { colors } = useAppTheme();
  const { control, setValue, getValues, trigger } = form;

  const [expanded, setExpanded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasTriedSave, setHasTriedSave] = useState(false);
  const [draftSnapshot, setDraftSnapshot] = useState<
    EditPlanForm["workoutExercises"][number] | null
  >(null);

  const data = useWatch({
    control,
    name: `workoutExercises.${index}`,
  });

  if (!data) return null;

  // Grouped error
  const { errors: formErrors } = useFormState({
    control,
    name: `workoutExercises.${index}`,
  });

  // Reps errors
  const repsMinError =
    formErrors.workoutExercises?.[index]?.plannedRepsMin?.message;
  const repsMaxError =
    formErrors.workoutExercises?.[index]?.plannedRepsMax?.message;
  const repsErrorMessage = repsMinError || repsMaxError;

  // Rest errors
  const restMinutesError =
    formErrors.workoutExercises?.[index]?.plannedRestMinutes?.message;
  const restSecondsError =
    formErrors.workoutExercises?.[index]?.plannedRestSeconds?.message;
  const restTimeErrorMessage = restMinutesError || restSecondsError;

  // Duration errors
  const durationMinutesError =
    formErrors.workoutExercises?.[index]?.plannedDurationMinutes?.message;
  const durationSecondsError =
    formErrors.workoutExercises?.[index]?.plannedDurationSeconds?.message;
  const durationErrorMessage = durationMinutesError || durationSecondsError;

  // Display data based on exercsie type
  const typeConfig = exerciseTypeFieldConfig[data.exercise.exerciseType];
  const showSets = typeConfig.visibleFields.includes("plannedSets");
  const showReps = typeConfig.visibleFields.includes("plannedRepsRange");
  const showRest = typeConfig.visibleFields.includes("plannedRestTime");
  const showDuration = typeConfig.visibleFields.includes("plannedDuration");
  const showDistance = typeConfig.visibleFields.includes("plannedDistance");

  // TODO: update function
  // const duration = calculateExerciseDuration(data);
  const duration = 0;

  // Sets
  const sets = data.plannedSets ?? 0;

  // Reps range
  const fallbackRepsRange = data.exercise.defaultRepsRange ?? null;
  const [fallbackRepsMinRaw, fallbackRepsMaxRaw] = fallbackRepsRange
    ? fallbackRepsRange.split("-")
    : [];

  const repsMin =
    data.plannedRepsMin != null
      ? data.plannedRepsMin
      : fallbackRepsMinRaw != null && fallbackRepsMinRaw !== ""
        ? Number(fallbackRepsMinRaw)
        : null;

  const repsMax =
    data.plannedRepsMax != null
      ? data.plannedRepsMax
      : fallbackRepsMaxRaw != null && fallbackRepsMaxRaw !== ""
        ? Number(fallbackRepsMaxRaw)
        : null;

  const reps =
    repsMin != null && repsMax != null ? `${repsMin}-${repsMax}` : "";

  // Rest time
  const fallbackRestTime = data.exercise.defaultRestTime ?? 0;

  const restMinutes =
    data.plannedRestMinutes != null
      ? data.plannedRestMinutes
      : Math.floor(fallbackRestTime / 60);
  const restSeconds =
    data.plannedRestSeconds != null
      ? data.plannedRestSeconds
      : fallbackRestTime % 60;

  // Equipment
  const equipment = (data.exercise.equipmentLinks ?? []).map(
    (link) => link.equipment.name,
  );

  const infoData: ExerciseInfoItem[] = [
    { key: "sets", label: "Total Sets", value: `${sets}` },
    { key: "reps", label: "Reps per Set", value: `${reps}` },
    {
      key: "rest",
      label: "Rest time per set",
      value: `${restMinutes} min ${restSeconds} sec`,
    },
    {
      key: "equipment",
      label: "Equipment need",
      value: `${equipment.length ? equipment.join(", ") : "None"}`,
    },
    { key: "time", label: "Total Estimate time", value: `${duration} Minutes` },
  ];

  const handleStartEdit = () => {
    setDraftSnapshot(getValues(`workoutExercises.${index}`));
    setHasTriedSave(false);
    setExpanded(true);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    Alert.alert("Exit Edit Mode", "Are you sure you want to cancel editing?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          if (draftSnapshot) {
            setValue(`workoutExercises.${index}`, draftSnapshot, {
              shouldDirty: true,
              shouldValidate: false,
            });
          }

          setHasTriedSave(false);
          setIsEditMode(false);
        },
      },
    ]);
  };

  const handleEditMode = () => {
    if (isEditMode) {
      handleCancelEdit();
      return;
    }

    handleStartEdit();
  };

  const handleSaveEdit = async () => {
    setHasTriedSave(true);

    const isValid = await trigger(`workoutExercises.${index}`);
    if (!isValid) return;

    setIsEditMode(false);
  };

  return (
    <View
      className={twMerge(
        clsx("mt-4 overflow-hidden rounded-2xl border", className),
      )}
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      {/* Edit mode/difficulty badge */}
      {editable ? (
        <View className="absolute right-0 top-0 z-10 flex-row gap-2 p-2">
          <AppButton
            variant="option"
            icon={isEditMode ? X : Pencil}
            className="h-8 w-8 rounded-lg"
            onPress={handleEditMode}
          />
        </View>
      ) : (
        <View className="absolute right-0 top-0 z-10 px-2">
          <DifficultyBadge
            label={DifficultyLabel[data.exercise.difficultyLevel]}
          />
        </View>
      )}

      {/* Main content */}
      <View className="flex-row p-2">
        {/* TODO: add image */}
        {/* <Thumbnail image={data.image} /> */}
        <Thumbnail />

        <View className="ml-4" style={{ justifyContent: "flex-end" }}>
          {/* Subtitle */}
          <ThemedText type="default" variant="accent" className="text-xs">
            {ExerciseTypeLabel[data.exercise.exerciseType]}
          </ThemedText>

          {/* Title */}
          <ThemedText
            type="default"
            variant="brand"
            className="text-xl font-medium"
          >
            {data.exercise.name}
          </ThemedText>

          <View className="flex-row">
            {/* Sets */}
            <View className="flex-row items-center">
              <Dumbbell size={12} color={colors.app.brand} />
              <ThemedText
                type="default"
                variant="primary"
                className="ml-2 text-xs"
              >
                {sets} {sets !== 1 ? "Sets" : "Set"}
              </ThemedText>
            </View>

            {/* Duration */}
            <View className="ml-4 flex-row items-center">
              <Clock size={12} color={colors.app.brand} />
              <ThemedText
                type="default"
                variant="primary"
                className="ml-2 text-xs"
              >
                {duration} min
              </ThemedText>
            </View>
          </View>

          {/* Display info */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setExpanded((prev) => !prev)}
            className="mt-2 flex-row items-center"
          >
            <ThemedText
              type="default"
              variant="primary"
              className="text-xs"
              style={{ marginRight: 3 }}
            >
              {isEditMode
                ? "Editing ..."
                : expanded
                  ? "Show less"
                  : "Show more"}
            </ThemedText>

            {!isEditMode &&
              (expanded ? (
                <ChevronUp size={12} color={colors.app.textPrimary} />
              ) : (
                <ChevronDown size={12} color={colors.app.textPrimary} />
              ))}
          </TouchableOpacity>
        </View>
      </View>

      {/* Info */}
      {isEditMode ? (
        <View style={{ padding: 8, paddingTop: 0 }}>
          <View
            className="gap-2 rounded-lg p-2"
            style={{
              backgroundColor: colors.app.cardSecondary,
            }}
          >
            {/* Total Sets */}
            {showSets && (
              <View>
                <ThemedText
                  type="default"
                  variant="primary"
                  className="mb-1 text-xs"
                >
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
                            void trigger(
                              `workoutExercises.${index}.plannedSets`,
                            );
                          }
                        }}
                        min={0}
                        step={1}
                        placeholder="0"
                        error={!!fieldState.error}
                      />

                      {fieldState.error?.message && (
                        <ThemedText
                          type="default"
                          variant="error"
                          className="mt-1 text-xs"
                        >
                          {fieldState.error?.message}
                        </ThemedText>
                      )}
                    </>
                  )}
                />
              </View>
            )}

            {/* Reps per set */}
            {showReps && (
              <View>
                <ThemedText
                  type="default"
                  variant="primary"
                  className="mb-1 text-xs"
                >
                  Reps per set
                </ThemedText>

                <View className="flex-row items-center gap-2">
                  <View className="flex-1">
                    <Controller
                      control={control}
                      name={`workoutExercises.${index}.plannedRepsMin`}
                      render={({ field, fieldState }) => (
                        <>
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
                        </>
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
                        <>
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
                        </>
                      )}
                    />
                  </View>
                </View>

                {repsErrorMessage && (
                  <ThemedText
                    type="default"
                    variant="error"
                    className="mt-1 text-xs"
                  >
                    {repsErrorMessage}
                  </ThemedText>
                )}
              </View>
            )}

            {/* Rest time per set */}
            {showRest && (
              <View>
                <ThemedText
                  type="default"
                  variant="primary"
                  className="mb-1 text-xs"
                >
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

                {restTimeErrorMessage && (
                  <ThemedText
                    type="default"
                    variant="error"
                    className="mt-1 text-xs"
                  >
                    {restTimeErrorMessage}
                  </ThemedText>
                )}
              </View>
            )}

            {/* Duration */}
            {showDuration && (
              <View>
                <ThemedText
                  type="default"
                  variant="primary"
                  className="mb-1 text-xs"
                >
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

                {durationErrorMessage && (
                  <ThemedText
                    type="default"
                    variant="error"
                    className="mt-1 text-xs"
                  >
                    {durationErrorMessage}
                  </ThemedText>
                )}
              </View>
            )}

            {/* Distance */}
            {showDistance && (
              <View>
                <ThemedText
                  type="default"
                  variant="primary"
                  className="mb-1 text-xs"
                >
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
                            void trigger(
                              `workoutExercises.${index}.plannedDistance`,
                            );
                          }
                        }}
                        min={0}
                        step={1}
                        placeholder="0"
                        error={!!fieldState.error}
                      />

                      {fieldState.error?.message && (
                        <ThemedText
                          type="default"
                          variant="error"
                          className="mt-1 text-xs"
                        >
                          {fieldState.error.message}
                        </ThemedText>
                      )}
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
              onPress={handleSaveEdit}
              // loading={isPending}
            />
          </View>
        </View>
      ) : (
        expanded && (
          <View style={{ padding: 8, paddingTop: 0 }}>
            <FlatList
              data={infoData}
              numColumns={3}
              keyExtractor={(item) => item.key}
              scrollEnabled={false}
              columnWrapperStyle={{ gap: 8 }}
              contentContainerStyle={{ gap: 8 }}
              renderItem={({ item }) => (
                <View style={{ flex: 1 }}>
                  <ExerciseInfoCard label={item.label} value={item.value} />
                </View>
              )}
            />

            {/* TODO: add more detail */}
            <AppButton
              title="More detail"
              variant="secondary"
              icon={FileText}
              className="mt-2 rounded-md"
              textClassName="font-medium"
              // onPress={handleSubmit(onSubmit)}
              // loading={isPending}
            />
          </View>
        )
      )}
    </View>
  );
}

function ExerciseInfoCard({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();

  return (
    <View
      className="rounded-lg p-2"
      style={{
        backgroundColor: colors.app.cardSecondary,
      }}
    >
      <ThemedText type="default" variant="primary" className="text-xs">
        {label}
      </ThemedText>

      <ThemedText type="default" variant="accent" className="mt-1">
        {value}
      </ThemedText>
    </View>
  );
}

function DifficultyBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { colors } = useAppTheme();

  return (
    <View
      className={twMerge(clsx("px-4 py-1", className))}
      style={{
        backgroundColor: colors.app.brand,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
      }}
    >
      <ThemedText
        type="default"
        className="text-xs"
        style={{ color: colors.app.textWhite }}
      >
        {label}
      </ThemedText>
    </View>
  );
}
