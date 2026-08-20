import { FilterBottomSheet } from "@/components/filter-option/FilterBottomSheet";
import {
  ExerciseFilterSheetContent,
  type ExerciseFilterValues,
} from "./ExerciseFilterSheetContent";

type ExerciseFilterBottomSheetProps = {
  value: ExerciseFilterValues;
  onApplyFilters: (value: ExerciseFilterValues) => void;
};

export default function ExerciseFilterBottomSheet({
  value,
  onApplyFilters,
}: ExerciseFilterBottomSheetProps) {
  return (
    <FilterBottomSheet<ExerciseFilterValues>
      value={value}
      onApplyFilters={onApplyFilters}
      renderContent={({ value, bottomInset, onClose, onApplyFilters }) => (
        <ExerciseFilterSheetContent
          value={value}
          bottomInset={bottomInset}
          onClose={onClose}
          onApplyFilters={onApplyFilters}
        />
      )}
    />
  );
}
