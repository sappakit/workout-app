import { useExerciseDisplayStore } from "@/stores/exerciseDisplayStore";
import { WorkoutExerciseItem } from "@/types/workout/response/workout.types";
import { useEffect, useState } from "react";
import ExerciseCardBase from "./base/ExerciseCardBase";

interface ExerciseCardReadonlyProps {
  data: WorkoutExerciseItem;
  className?: string;
}

export function ExerciseCardReadonly({
  data,
  className,
}: ExerciseCardReadonlyProps) {
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

  const handleToggleExpanded = () => {
    setExpandedOverride((prev) => {
      const current = prev ?? showFullExerciseDetails;
      return !current;
    });
  };

  return (
    <ExerciseCardBase
      data={data}
      expanded={expanded}
      onToggleExpanded={handleToggleExpanded}
      className={className}
    />
  );
}
