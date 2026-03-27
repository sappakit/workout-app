import { AppButton } from "@/components/custom-ui/AppButton";
import {
  exerciseTypeFieldConfig,
  getExerciseFieldNames,
} from "@/lib/workout/config";
import { mapEditPlanExerciseToWorkoutExerciseItem } from "@/lib/workout/mappers";
import { EditPlanForm } from "@/schemas/edit-plan.schema";
import { useExerciseDisplayStore } from "@/stores/exerciseDisplayStore";
import { Pencil, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Alert } from "react-native";
import ExerciseCardBase from "./base/ExerciseCardBase";
import ExerciseCardEditFields from "./edit/ExerciseCardEditFields";

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
  const { control, setValue, getValues, trigger } = form;

  const [isEditMode, setIsEditMode] = useState(false);
  const [hasTriedSave, setHasTriedSave] = useState(false);
  const [draftSnapshot, setDraftSnapshot] = useState<
    EditPlanForm["workoutExercises"][number] | null
  >(null);

  // Exercise card expansion state
  const showFullExerciseDetails = useExerciseDisplayStore(
    (state) => state.showFullExerciseDetails,
  );
  const [expandedOverride, setExpandedOverride] = useState<boolean | null>(
    null,
  );
  const expanded = expandedOverride ?? showFullExerciseDetails;

  useEffect(() => {
    setExpandedOverride(null);
  }, [showFullExerciseDetails]);

  // Data
  const data = useWatch({
    control,
    name: `workoutExercises.${index}`,
  });

  if (!data) return null;

  const typeConfig = exerciseTypeFieldConfig[data.exercise.exerciseType];
  const cardData = mapEditPlanExerciseToWorkoutExerciseItem(data);

  const handleToggleExpanded = () => {
    setExpandedOverride((prev) => {
      const current = prev ?? showFullExerciseDetails;
      return !current;
    });
  };

  const handleStartEdit = () => {
    setDraftSnapshot(getValues(`workoutExercises.${index}`));
    setHasTriedSave(false);
    setExpandedOverride(true);
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

  return (
    <ExerciseCardBase
      data={cardData}
      expanded={expanded}
      onToggleExpanded={handleToggleExpanded}
      className={className}
      isEditMode={isEditMode}
      bottomRightContent={
        <AppButton
          variant="option"
          icon={isEditMode ? X : Pencil}
          iconSize={isEditMode ? 16 : 14}
          className="h-8 w-8 self-end rounded-full"
          onPress={handleEditMode}
        />
      }
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
