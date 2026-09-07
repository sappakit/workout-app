import { exerciseApi } from "@/lib/api/exercise.api";
import { muscleApi } from "@/lib/api/muscle.api";
import { exerciseQueryKeys, muscleQueryKeys } from "@/lib/exercise/keys";
import type { ExerciseCategory } from "@/types/workout/response/exercise.types";
import type { Muscle } from "@/types/workout/response/shared.types";
import { useState } from "react";
import { View } from "react-native";
import { RemoteOptionPickerPage } from "../../picker/option-picker/RemoteOptionPickerPage";
import {
  AnimatedFilterPage,
  getSelectedCountSummary,
} from "../AnimatedFilterPage";
import {
  FilterNavigationItem,
  FilterOverviewPage,
} from "../filter-page/FilterOverviewPage";
import {
  FilterSortPage,
  getSortDirectionLabel,
  type SortDirection,
  type SortOption,
} from "../filter-page/FilterSortPage";

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
    icon: "calendar",
    ascLabel: "Oldest first",
    descLabel: "Newest first",
  },
  {
    value: "name",
    label: "Name",
    icon: "exercise",
    ascLabel: "A to Z",
    descLabel: "Z to A",
  },
];

type ExerciseFilterSheetContentProps = {
  value: ExerciseFilterValues;
  onChange: (value: ExerciseFilterValues) => void;
  bottomContentInset?: number;
};

export function ExerciseFilterSheetContent({
  value,
  onChange,
  bottomContentInset = 0,
}: ExerciseFilterSheetContentProps) {
  const [page, setPage] = useState<FilterPage>("main");

  const [hasNavigated, setHasNavigated] = useState(false);

  const selectedFilterCount = value.categoryIds.length + value.muscleIds.length;

  const categorySummary = getSelectedCountSummary(
    value.categoryIds,
    "Any category",
  );

  const muscleSummary = getSelectedCountSummary(value.muscleIds, "Any muscle");

  const selectedSortOption = sortOptions.find(
    (option) => option.value === value.sortBy,
  );

  const sortSummary = selectedSortOption
    ? `${selectedSortOption.label}: ${getSortDirectionLabel(
        selectedSortOption,
        value.sortDirection,
      )}`
    : "Default";

  const openPage = (nextPage: Exclude<FilterPage, "main">) => {
    if (!hasNavigated) {
      setHasNavigated(true);

      requestAnimationFrame(() => {
        setPage(nextPage);
      });

      return;
    }

    setPage(nextPage);
  };

  const handleBackToMain = () => {
    setPage("main");
  };

  const handleChangeCategoryIds = (categoryIds: number[]) => {
    onChange({
      ...value,
      categoryIds,
    });
  };

  const handleChangeMuscleIds = (muscleIds: number[]) => {
    onChange({
      ...value,
      muscleIds,
    });
  };

  const handleChangeSortBy = (sortBy: ExerciseSortKey) => {
    onChange({
      ...value,
      sortBy,
      sortDirection: sortBy === "created_at" ? "DESC" : "ASC",
    });
  };

  const handleChangeSortDirection = (sortDirection: SortDirection) => {
    onChange({
      ...value,
      sortDirection,
    });
  };

  return (
    <AnimatedFilterPage
      pageKey={page}
      isMainPage={page === "main"}
      shouldAnimate={hasNavigated}
    >
      <View className="flex-1">
        {page === "main" && (
          <FilterOverviewPage
            title="Exercise filters"
            subtitle={
              selectedFilterCount > 0
                ? `${selectedFilterCount} filters selected`
                : "Find the right exercise faster"
            }
            bottomContentInset={bottomContentInset}
          >
            <FilterNavigationItem
              icon="exercise"
              title="Exercise category"
              description={categorySummary}
              onPress={() => openPage("category")}
            />

            <FilterNavigationItem
              icon="workout"
              title="Target muscles"
              description={muscleSummary}
              onPress={() => openPage("muscle")}
            />

            <FilterNavigationItem
              icon="filter"
              title="Sort by"
              description={sortSummary}
              onPress={() => openPage("sort")}
            />
          </FilterOverviewPage>
        )}

        {page === "category" && (
          <RemoteOptionPickerPage<ExerciseCategory>
            title="Exercise category"
            url={exerciseApi.getCategories()}
            queryKey={exerciseQueryKeys.categories}
            selectionMode="multiple"
            value={value.categoryIds}
            onChange={handleChangeCategoryIds}
            onBack={handleBackToMain}
            bottomContentInset={bottomContentInset}
            mapOption={(item) => ({
              value: item.id,
              label: item.name,
            })}
          />
        )}

        {page === "muscle" && (
          <RemoteOptionPickerPage<Muscle>
            title="Target muscles"
            url={muscleApi.getAll()}
            queryKey={muscleQueryKeys.all}
            selectionMode="multiple"
            value={value.muscleIds}
            onChange={handleChangeMuscleIds}
            onBack={handleBackToMain}
            bottomContentInset={bottomContentInset}
            mapOption={(item) => ({
              value: item.id,
              label: item.name,
            })}
          />
        )}

        {page === "sort" && (
          <FilterSortPage<ExerciseSortKey>
            title="Sort by"
            options={sortOptions}
            selectedSortBy={value.sortBy}
            sortDirection={value.sortDirection}
            onBack={handleBackToMain}
            onChangeSortBy={handleChangeSortBy}
            onChangeSortDirection={handleChangeSortDirection}
            bottomContentInset={bottomContentInset}
          />
        )}
      </View>
    </AnimatedFilterPage>
  );
}
