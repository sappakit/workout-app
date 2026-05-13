import { AppButton } from "@/components/custom-ui/AppButton";
import { ExpandableToggle } from "@/components/custom-ui/ExpandableToggle";
import { ThemedText } from "@/components/themed-text";
import { useExerciseCardExpandedState } from "@/hooks/useExerciseCardExpandedState";
import {
  exerciseTypeFieldConfig,
  getExerciseFieldNames,
} from "@/lib/workout/config";
import { mapEditPlanExerciseToWorkoutExerciseItem } from "@/lib/workout/mappers";
import { buildWorkoutExerciseDisplayModel } from "@/lib/workout/utils";
import { EditPlanForm } from "@/schemas/edit-plan.schema";
import { useRouter } from "expo-router";
import { Info, Pencil, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Alert } from "react-native";
import ExerciseCardBase from "./base/ExerciseCardBase";
import ExerciseCardEditFields from "./edit/ExerciseCardEditFields";
import WorkoutExerciseDetailsSection from "./sections/WorkoutExerciseDetailsSection";

interface ExerciseCardEditProps {
  form: UseFormReturn<EditPlanForm>;
  index: number;
  className?: string;
}

export function ExerciseCardEdit({
  form,
  index,
  className,
}: ExerciseCardEditProps) {
  const router = useRouter();
  const { control, setValue, getValues, trigger } = form;

  const [isEditMode, setIsEditMode] = useState(false);
  const [hasTriedSave, setHasTriedSave] = useState(false);
  const [draftSnapshot, setDraftSnapshot] = useState<
    EditPlanForm["workoutExercises"][number] | null
  >(null);

  // Exercise card expansion state
  const { expanded, toggleExpanded, setExpanded } =
    useExerciseCardExpandedState();

  // Current form item
  const data = useWatch({
    control,
    name: `workoutExercises.${index}`,
  });

  if (!data) return null;

  const typeConfig = exerciseTypeFieldConfig[data.exercise.exerciseType];

  // Convert edit-form shape to the same shape used by readonly workout exercise UI
  const cardData = useMemo(
    () => mapEditPlanExerciseToWorkoutExerciseItem(data),
    [data],
  );

  const display = useMemo(
    () => buildWorkoutExerciseDisplayModel(cardData),
    [cardData],
  );

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

    const fieldNames = getExerciseFieldNames(index, typeConfig);
    const isValid = await trigger(fieldNames);

    if (!isValid) return;

    setIsEditMode(false);
  };

  const expandedContent = (
    <WorkoutExerciseDetailsSection
      infoData={display.infoData}
      equipment={display.equipment}
      onPressMoreDetail={() =>
        router.push({
          pathname: "/(pages)/exercise/[id]",
          params: { id: data.exercise.id },
        })
      }
    />
  );
  const shouldShowExpandToggle = !!expandedContent;

  return (
    <ExerciseCardBase
      exercise={data.exercise}
      expanded={expanded}
      className={className}
      isEditMode={isEditMode}
      stats={display.stats}
      footerContent={
        isEditMode ? (
          <ThemedText type="default" variant="primary" className="mt-3 text-xs">
            Editing ...
          </ThemedText>
        ) : (
          shouldShowExpandToggle && (
            <ExpandableToggle
              expanded={expanded}
              onToggleExpanded={toggleExpanded}
              className="mt-3"
            />
          )
        )
      }
      bottomRightContent={
        <>
          {!expanded && (
            <AppButton
              variant="option"
              icon={Info}
              className="h-8 w-8 self-end rounded-full"
              onPress={() =>
                router.push({
                  pathname: "/(pages)/exercise/[id]",
                  params: { id: data.exercise.id },
                })
              }
            />
          )}

          <AppButton
            variant="option"
            icon={isEditMode ? X : Pencil}
            iconSize={isEditMode ? 16 : 14}
            className="h-8 w-8 self-end rounded-full"
            onPress={handleEditMode}
          />
        </>
      }
      expandedContent={expandedContent}
      editContent={
        <ExerciseCardEditFields
          form={form}
          index={index}
          hasTriedSave={hasTriedSave}
          onSave={handleSaveEdit}
          typeConfig={typeConfig}
        />
      }
    />
  );
}
