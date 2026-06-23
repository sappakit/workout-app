import {
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIRECTION,
  WorkoutSortKey,
} from "@/app/(modal)/workout/choose-workout";
import { muscleApi } from "@/app/api/muscle.api";
import { workoutApi } from "@/app/api/workout.api";
import { muscleQueryKeys } from "@/lib/exercise/keys";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { Muscle } from "@/types/workout/response/shared.types";
import { WorkoutFocusType } from "@/types/workout/response/workout.types";
import { Calendar, Dumbbell, Timer } from "lucide-react-native";
import { useEffect, useState } from "react";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { WorkoutFilterOverviewPage } from "./page/WorkoutFilterOverviewPage";
import {
  getSortDirectionLabel,
  SortDirection,
  SortOption,
  WorkoutFilterSortPage,
} from "./page/WorkoutFilterSortPage";
import { WorkoutFilterRemoteOptionPage } from "./page/workout-filter-option/WorkoutFilterRemoteOptionPage";

type FilterPage = "main" | "focus" | "muscle" | "sort";

const sortOptions: SortOption<WorkoutSortKey>[] = [
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
  {
    value: "duration",
    label: "Duration",
    icon: Timer,
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
  bottomInset: number;
  onClose: () => void;
  onApplyFilters: (value: WorkoutFilterValues) => void;
};

export function WorkoutFilterSheetContent({
  value,
  bottomInset,
  onClose,
  onApplyFilters,
}: WorkoutFilterSheetContentProps) {
  const [page, setPage] = useState<FilterPage>("main");
  const [hasNavigated, setHasNavigated] = useState(false);

  const [selectedFocusTypeIds, setSelectedFocusTypeIds] = useState<number[]>(
    value.focusTypeIds,
  );

  const [selectedMuscleIds, setSelectedMuscleIds] = useState<number[]>(
    value.muscleIds,
  );

  const [selectedSortBy, setSelectedSortBy] = useState<WorkoutSortKey | null>(
    value.sortBy,
  );

  const [sortDirection, setSortDirection] = useState<SortDirection>(
    value.sortDirection,
  );

  useEffect(() => {
    setSelectedFocusTypeIds(value.focusTypeIds);
    setSelectedMuscleIds(value.muscleIds);
    setSelectedSortBy(value.sortBy);
    setSortDirection(value.sortDirection);
  }, [value.focusTypeIds, value.muscleIds, value.sortBy, value.sortDirection]);

  const selectedFilterCount =
    selectedFocusTypeIds.length + selectedMuscleIds.length;

  const focusSummary = getSelectedCountSummary(
    selectedFocusTypeIds,
    "Any focus",
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
    setSelectedFocusTypeIds([]);
    setSelectedMuscleIds([]);
    setSelectedSortBy(DEFAULT_SORT_BY);
    setSortDirection(DEFAULT_SORT_DIRECTION);
  };

  const handleApply = () => {
    onApplyFilters({
      focusTypeIds: selectedFocusTypeIds,
      muscleIds: selectedMuscleIds,
      sortBy: selectedSortBy,
      sortDirection,
    });

    onClose();
  };

  const handleChangeSortBy = (sortBy: WorkoutSortKey) => {
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
        <WorkoutFilterOverviewPage
          bottomInset={bottomInset}
          selectedFilterCount={selectedFilterCount}
          focusSummary={focusSummary}
          muscleSummary={muscleSummary}
          sortSummary={sortSummary}
          onClose={onClose}
          onReset={handleReset}
          onApply={handleApply}
          onOpenFocus={() => openPage("focus")}
          onOpenMuscle={() => openPage("muscle")}
          onOpenSort={() => openPage("sort")}
        />
      )}

      {page === "focus" && (
        <WorkoutFilterRemoteOptionPage<WorkoutFocusType>
          title="Workout focus"
          url={workoutApi.getTypes()}
          queryKey={workoutQueryKeys.type}
          selectedIds={selectedFocusTypeIds}
          bottomInset={bottomInset}
          onBack={handleBackToMain}
          onChangeSelectedIds={setSelectedFocusTypeIds}
          mapOption={(item) => ({
            id: item.id,
            label: item.name,
          })}
        />
      )}

      {page === "muscle" && (
        <WorkoutFilterRemoteOptionPage<Muscle>
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
        <WorkoutFilterSortPage<WorkoutSortKey>
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

// TODO: new animation
// export function AnimatedFilterPage({
//   pageKey,
//   shouldAnimate,
//   children,
// }: AnimatedFilterPageProps) {
//   const translateX = useSharedValue(0);

//   useEffect(() => {
//     if (!shouldAnimate) {
//       translateX.value = 0;
//       return;
//     }

//     translateX.value = pageKey === "main" ? -48 : 48;

//     translateX.value = withTiming(0, {
//       duration: 420,
//       easing: Easing.out(Easing.cubic),
//     });
//   }, [pageKey, shouldAnimate, translateX]);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: translateX.value }],
//   }));

//   return (
//     <Animated.View key={pageKey} style={[{ flex: 1 }, animatedStyle]}>
//       {children}
//     </Animated.View>
//   );
// }

export function AnimatedFilterPage({
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

function getSelectedCountSummary(selectedIds: number[], emptyLabel: string) {
  if (selectedIds.length === 0) return emptyLabel;

  if (selectedIds.length === 1) return "1 selected";

  return `${selectedIds.length} selected`;
}
