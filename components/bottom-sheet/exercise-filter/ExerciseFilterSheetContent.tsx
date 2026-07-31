import {
  FilterNavigationItem,
  FilterOverviewPage,
} from "@/components/filter-option/FilterOverviewPage";
import {
  FilterSortPage,
  getSortDirectionLabel,
  SortDirection,
  SortOption,
} from "@/components/filter-option/FilterSortPage";
import { RemoteFilterOptionPage } from "@/components/filter-option/option-page/RemoteFilterOptionPage";
import { exerciseApi } from "@/lib/api/exercise.api";
import { muscleApi } from "@/lib/api/muscle.api";
import { exerciseQueryKeys, muscleQueryKeys } from "@/lib/exercise/keys";
import { ExerciseCategory } from "@/types/workout/response/exercise.types";
import { Muscle } from "@/types/workout/response/shared.types";
import {
  BicepsFlexed,
  Calendar,
  Dumbbell,
  Sparkles,
  Target,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";

export type ExerciseSortKey = "created_at" | "name";

type FilterPage = "main" | "category" | "muscle" | "sort";

export const DEFAULT_EXERCISE_SORT_BY: ExerciseSortKey = "name";
export const DEFAULT_EXERCISE_SORT_DIRECTION: SortDirection = "ASC";

export type ExerciseFilterValues = {
  categoryIds: number[];
  muscleIds: number[];
  sortBy: ExerciseSortKey | null;
  sortDirection: SortDirection;
};

export const DEFAULT_EXERCISE_FILTERS: ExerciseFilterValues = {
  categoryIds: [],
  muscleIds: [],
  sortBy: DEFAULT_EXERCISE_SORT_BY,
  sortDirection: DEFAULT_EXERCISE_SORT_DIRECTION,
};

const sortOptions: SortOption<ExerciseSortKey>[] = [
  {
    value: "created_at",
    label: "Date",
    icon: Calendar,
    ascLabel: "Oldest first",
    descLabel: "Newest first",
  },
  {
    value: "name",
    label: "Name",
    icon: Dumbbell,
    ascLabel: "A to Z",
    descLabel: "Z to A",
  },
];

type ExerciseFilterSheetContentProps = {
  value: ExerciseFilterValues;
  bottomInset: number;
  onClose: () => void;
  onApplyFilters: (value: ExerciseFilterValues) => void;
};

export function ExerciseFilterSheetContent({
  value,
  bottomInset,
  onClose,
  onApplyFilters,
}: ExerciseFilterSheetContentProps) {
  const [page, setPage] = useState<FilterPage>("main");
  const [hasNavigated, setHasNavigated] = useState(false);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    value.categoryIds,
  );

  const [selectedMuscleIds, setSelectedMuscleIds] = useState<number[]>(
    value.muscleIds,
  );

  const [selectedSortBy, setSelectedSortBy] = useState<ExerciseSortKey | null>(
    value.sortBy,
  );

  const [sortDirection, setSortDirection] = useState<SortDirection>(
    value.sortDirection,
  );

  useEffect(() => {
    setSelectedCategoryIds(value.categoryIds);
    setSelectedMuscleIds(value.muscleIds);
    setSelectedSortBy(value.sortBy);
    setSortDirection(value.sortDirection);
  }, [value.categoryIds, value.muscleIds, value.sortBy, value.sortDirection]);

  const selectedFilterCount =
    selectedCategoryIds.length + selectedMuscleIds.length;

  const categorySummary = getSelectedCountSummary(
    selectedCategoryIds,
    "Any category",
  );

  const muscleSummary = getSelectedCountSummary(
    selectedMuscleIds,
    "Any muscle",
  );

  const selectedSortOption = sortOptions.find(
    (option) => option.value === selectedSortBy,
  );

  const sortSummary = selectedSortOption
    ? `${selectedSortOption.label}: ${getSortDirectionLabel(
        selectedSortOption,
        sortDirection,
      )}`
    : "Default";

  const openPage = (nextPage: Exclude<FilterPage, "main">) => {
    setHasNavigated(true);
    setPage(nextPage);
  };

  const handleBackToMain = () => {
    setHasNavigated(true);
    setPage("main");
  };

  const handleReset = () => {
    setSelectedCategoryIds([]);
    setSelectedMuscleIds([]);
    setSelectedSortBy(DEFAULT_EXERCISE_SORT_BY);
    setSortDirection(DEFAULT_EXERCISE_SORT_DIRECTION);
  };

  const handleApply = () => {
    onApplyFilters({
      categoryIds: selectedCategoryIds,
      muscleIds: selectedMuscleIds,
      sortBy: selectedSortBy,
      sortDirection,
    });

    onClose();
  };

  const handleChangeSortBy = (sortBy: ExerciseSortKey) => {
    setSelectedSortBy(sortBy);

    if (sortBy === "created_at") {
      setSortDirection("DESC");
      return;
    }

    setSortDirection("ASC");
  };

  return (
    <AnimatedFilterPage pageKey={page} shouldAnimate={hasNavigated}>
      {page === "main" && (
        <FilterOverviewPage
          title="Exercise filters"
          subtitle={
            selectedFilterCount > 0
              ? `${selectedFilterCount} filters selected`
              : "Find the right exercise faster"
          }
          bottomInset={bottomInset}
          onReset={handleReset}
          onApply={handleApply}
        >
          <FilterNavigationItem
            icon={Target}
            title="Exercise category"
            description={categorySummary}
            onPress={() => openPage("category")}
          />

          <FilterNavigationItem
            icon={BicepsFlexed}
            title="Target muscles"
            description={muscleSummary}
            onPress={() => openPage("muscle")}
          />

          <FilterNavigationItem
            icon={Sparkles}
            title="Sort by"
            description={sortSummary}
            onPress={() => openPage("sort")}
          />
        </FilterOverviewPage>
      )}

      {page === "category" && (
        <RemoteFilterOptionPage<ExerciseCategory>
          title="Exercise category"
          url={exerciseApi.getCategories()}
          queryKey={exerciseQueryKeys.categories}
          selectedIds={selectedCategoryIds}
          bottomInset={bottomInset}
          onBack={handleBackToMain}
          onChangeSelectedIds={setSelectedCategoryIds}
          mapOption={(item) => ({
            id: item.id,
            label: item.name,
          })}
        />
      )}

      {page === "muscle" && (
        <RemoteFilterOptionPage<Muscle>
          title="Target muscles"
          url={muscleApi.getAll()}
          queryKey={muscleQueryKeys.all}
          selectedIds={selectedMuscleIds}
          bottomInset={bottomInset}
          onBack={handleBackToMain}
          onChangeSelectedIds={setSelectedMuscleIds}
          mapOption={(item) => ({
            id: item.id,
            label: item.name,
          })}
        />
      )}

      {page === "sort" && (
        <FilterSortPage<ExerciseSortKey>
          title="Sort by"
          options={sortOptions}
          selectedSortBy={selectedSortBy}
          sortDirection={sortDirection}
          bottomInset={bottomInset}
          onBack={handleBackToMain}
          onChangeSortBy={handleChangeSortBy}
          onChangeSortDirection={setSortDirection}
        />
      )}
    </AnimatedFilterPage>
  );
}

type AnimatedFilterPageProps = {
  pageKey: FilterPage;
  shouldAnimate: boolean;
  children: React.ReactNode;
};

function AnimatedFilterPage({
  pageKey,
  shouldAnimate,
  children,
}: AnimatedFilterPageProps) {
  const isBackToMain = pageKey === "main";

  const entering = isBackToMain ? SlideInLeft : SlideInRight;
  const exiting = isBackToMain ? SlideOutLeft : SlideOutRight;

  return (
    <Animated.View
      key={pageKey}
      entering={shouldAnimate ? entering.duration(350) : undefined}
      exiting={exiting.duration(350)}
      style={{ flex: 1 }}
    >
      {children}
    </Animated.View>
  );
}

function getSelectedCountSummary<TValue>(
  selectedValues: TValue[],
  emptyLabel: string,
) {
  if (selectedValues.length === 0) return emptyLabel;

  if (selectedValues.length === 1) return "1 selected";

  return `${selectedValues.length} selected`;
}
