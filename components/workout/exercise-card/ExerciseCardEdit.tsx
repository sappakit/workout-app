import { AppButton } from "@/components/custom-ui/AppButton";
import { exerciseTypeFieldConfig } from "@/lib/workout/config";
import { mapEditPlanExerciseToWorkoutExerciseItem } from "@/lib/workout/mappers";
import { EditPlanForm } from "@/schemas/edit-plan.schema";
import { Pencil, X } from "lucide-react-native";
import { useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Alert, View } from "react-native";
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

  const typeConfig = exerciseTypeFieldConfig[data.exercise.exerciseType];
  const cardData = mapEditPlanExerciseToWorkoutExerciseItem(data);

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
    <ExerciseCardBase
      data={cardData}
      expanded={expanded}
      onToggleExpanded={() => setExpanded((prev) => !prev)}
      className={className}
      isEditMode={isEditMode}
      topRightContent={
        <View className="flex-row gap-2">
          <AppButton
            variant="option"
            icon={isEditMode ? X : Pencil}
            className="h-8 w-8 rounded-lg"
            onPress={handleEditMode}
          />
        </View>
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
