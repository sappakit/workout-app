import { useExerciseDisplayStore } from "@/stores/exerciseDisplayStore";
import { useEffect, useState } from "react";

export function useExerciseCardExpandedState() {
  const showFullExerciseDetails = useExerciseDisplayStore(
    (state) => state.showFullExerciseDetails,
  );

  const [expandedOverride, setExpandedOverride] = useState<boolean | null>(
    null,
  );

  const expanded = expandedOverride ?? showFullExerciseDetails;

  // reset local override whenever the global setting changes
  useEffect(() => {
    setExpandedOverride(null);
  }, [showFullExerciseDetails]);

  const toggleExpanded = () => {
    setExpandedOverride((prev) => {
      const current = prev ?? showFullExerciseDetails;
      return !current;
    });
  };

  const setExpanded = (value: boolean) => {
    setExpandedOverride(value);
  };

  const resetExpandedOverride = () => {
    setExpandedOverride(null);
  };

  return {
    expanded,
    expandedOverride,
    showFullExerciseDetails,
    toggleExpanded,
    setExpanded,
    resetExpandedOverride,
  };
}
