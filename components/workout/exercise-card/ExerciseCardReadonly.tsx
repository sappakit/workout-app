import { AppButton } from "@/components/custom-ui/AppButton";
import { ExpandableToggle } from "@/components/custom-ui/ExpandableToggle";
import { useExerciseCardExpandedState } from "@/hooks/useExerciseCardExpandedState";
import { buildWorkoutExerciseDisplayModel } from "@/lib/workout/utils";
import { WorkoutExerciseItem } from "@/types/workout/response/workout.types";
import { useRouter } from "expo-router";
import { Info } from "lucide-react-native";
import { useMemo } from "react";
import ExerciseCardBase from "./base/ExerciseCardBase";
import WorkoutExerciseDetailsSection from "./sections/WorkoutExerciseDetailsSection";

interface ExerciseCardReadonlyProps {
  data: WorkoutExerciseItem;
  className?: string;
}

export function ExerciseCardReadonly({
  data,
  className,
}: ExerciseCardReadonlyProps) {
  const router = useRouter();

  // Exercise card expansion state
  const { expanded, toggleExpanded } = useExerciseCardExpandedState();

  const display = useMemo(() => buildWorkoutExerciseDisplayModel(data), [data]);

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
      stats={display.stats}
      footerContent={
        shouldShowExpandToggle && (
          <ExpandableToggle
            expanded={expanded}
            onToggleExpanded={toggleExpanded}
            className="mt-3"
          />
        )
      }
      bottomRightContent={
        !expanded && (
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
        )
      }
      expandedContent={expandedContent}
    />
  );
}
