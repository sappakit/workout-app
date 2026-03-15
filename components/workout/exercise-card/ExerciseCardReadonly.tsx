import { WorkoutExerciseItem } from "@/types/workout/response/workout.types";
import { useState } from "react";
import ExerciseCardBase from "./base/ExerciseCardBase";

interface ExerciseCardReadonlyProps {
  data: WorkoutExerciseItem;
  className?: string;
}

export function ExerciseCardReadonly({
  data,
  className,
}: ExerciseCardReadonlyProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <ExerciseCardBase
      data={data}
      expanded={expanded}
      onToggleExpanded={() => setExpanded((prev) => !prev)}
      className={className}
    />
  );
}
