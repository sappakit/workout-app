import type { WorkoutSortKey } from "@/app/(modal)/workout/choose-workout";
import { muscleApi } from "@/lib/api/muscle.api";
import { workoutApi } from "@/lib/api/workout.api";
import { muscleQueryKeys } from "@/lib/exercise/keys";
import { workoutQueryKeys } from "@/lib/workout/keys";
import type { Muscle } from "@/types/workout/response/shared.types";
import type { WorkoutFocusType } from "@/types/workout/response/workout.types";
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

type FilterPage = "main" | "focus" | "muscle" | "sort";

const sortOptions: SortOption<WorkoutSortKey>[] = [
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
    icon: "workout",
    ascLabel: "A to Z",
    descLabel: "Z to A",
  },
  {
    value: "duration",
    label: "Duration",
    icon: "duration",
    ascLabel: "Low to high",
    descLabel: "High to low",
  },
];

export type WorkoutFilterValues = {
  focusTypeIds: number[];
  muscleIds: number[];
  sortBy: WorkoutSortKey | null;
  sortDirection: SortDirection;
};

type WorkoutFilterSheetContentProps = {
  value: WorkoutFilterValues;
  onChange: (value: WorkoutFilterValues) => void;
  bottomContentInset?: number;
};

export function WorkoutFilterSheetContent({
  value,
  onChange,
  bottomContentInset = 0,
}: WorkoutFilterSheetContentProps) {
  const [page, setPage] = useState<FilterPage>("main");

  const [hasNavigated, setHasNavigated] = useState(false);

  const selectedFilterCount =
    value.focusTypeIds.length + value.muscleIds.length;

  const focusSummary = getSelectedCountSummary(value.focusTypeIds, "Any focus");

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

  const handleChangeFocusTypeIds = (focusTypeIds: number[]) => {
    onChange({
      ...value,
      focusTypeIds,
    });
  };

  const handleChangeMuscleIds = (muscleIds: number[]) => {
    onChange({
      ...value,
      muscleIds,
    });
  };

  const handleChangeSortBy = (sortBy: WorkoutSortKey) => {
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
            title="Workout filters"
            subtitle={
              selectedFilterCount > 0
                ? `${selectedFilterCount} filters selected`
                : "Find the right workout faster"
            }
            bottomContentInset={bottomContentInset}
          >
            <FilterNavigationItem
              icon="workout"
              title="Workout focus"
              description={focusSummary}
              onPress={() => openPage("focus")}
            />

            <FilterNavigationItem
              icon="exercise"
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

        {page === "focus" && (
          <RemoteOptionPickerPage<WorkoutFocusType>
            title="Workout focus"
            url={workoutApi.getTypes()}
            queryKey={workoutQueryKeys.type}
            selectionMode="multiple"
            value={value.focusTypeIds}
            onChange={handleChangeFocusTypeIds}
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
          <FilterSortPage<WorkoutSortKey>
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
