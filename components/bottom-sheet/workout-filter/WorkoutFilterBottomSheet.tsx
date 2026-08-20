import { FilterBottomSheet } from "@/components/filter-option/FilterBottomSheet";
import {
  WorkoutFilterSheetContent,
  type WorkoutFilterValues,
} from "./WorkoutFilterSheetContent";

type WorkoutFilterBottomSheetProps = {
  value: WorkoutFilterValues;
  onApplyFilters: (value: WorkoutFilterValues) => void;
};

export default function WorkoutFilterBottomSheet({
  value,
  onApplyFilters,
}: WorkoutFilterBottomSheetProps) {
  return (
    <FilterBottomSheet<WorkoutFilterValues>
      value={value}
      onApplyFilters={onApplyFilters}
      renderContent={({ value, bottomInset, onClose, onApplyFilters }) => (
        <WorkoutFilterSheetContent
          value={value}
          bottomInset={bottomInset}
          onClose={onClose}
          onApplyFilters={onApplyFilters}
        />
      )}
    />
  );
}
