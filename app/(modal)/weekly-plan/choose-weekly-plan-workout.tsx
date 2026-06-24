import { workoutApi } from "@/app/api/workout.api";
import WorkoutFilterBottomSheet from "@/components/bottom-sheet/workout-filter/WorkoutFilterBottomSheet";
import { WorkoutFilterValues } from "@/components/bottom-sheet/workout-filter/WorkoutFilterSheetContent";
import FullScreenPicker from "@/components/form/picker/FullScreenPicker";
import { useWeeklyPlanWorkoutPickerStore } from "@/components/weekly-plan/weeklyPlanWorkoutSelectionStore";
import { ChooseWorkoutPickerSkeleton } from "@/components/workout/ui/workout-card/ChooseWorkoutPickerSkeleton";
import {
  mapWorkoutToWorkoutCardItem,
  WorkoutCard,
} from "@/components/workout/ui/workout-card/WorkoutCard";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { WorkoutResponse } from "@/types/workout/response/workout.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { DEFAULT_WORKOUT_FILTERS } from "../workout/choose-workout";

export default function ChooseWeeklyPlanWorkoutPage() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const params = useLocalSearchParams<{
    dayOfWeek?: string;
    workoutId?: string;
  }>();

  const dayOfWeek = params.dayOfWeek ? Number(params.dayOfWeek) : null;
  const currentWorkoutId = params.workoutId ? Number(params.workoutId) : null;

  const setPickerResult = useWeeklyPlanWorkoutPickerStore(
    (state) => state.setResult,
  );

  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(
    currentWorkoutId,
  );

  const [filters, setFilters] = useState<WorkoutFilterValues>(
    DEFAULT_WORKOUT_FILTERS,
  );

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const sortByParam = filters.sortBy
    ? `${filters.sortBy}:${filters.sortDirection}`
    : undefined;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteOptionsQuery<WorkoutResponse>({
    url: workoutApi.getAll(),
    queryKey: [
      workoutQueryKeys.all,
      "weekly-plan-workout-picker",
      debouncedSearch,
      filters.focusTypeIds,
      filters.muscleIds,
      filters.sortBy,
      filters.sortDirection,
    ],
    search: debouncedSearch,
    limit: 20,
    params: {
      focusTypeIds:
        filters.focusTypeIds.length > 0 ? filters.focusTypeIds : undefined,
      muscleIds: filters.muscleIds.length > 0 ? filters.muscleIds : undefined,
      sortBy: sortByParam,
    },
  });

  const workouts = data?.pages.flatMap((page) => page.data) ?? [];

  const selectedWorkout =
    workouts.find((workout) => workout.id === selectedWorkoutId) ?? null;

  const loadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  };

  const handleSelectWorkout = (workout: WorkoutResponse) => {
    setSelectedWorkoutId(workout.id);
  };

  const handleDone = () => {
    if (!dayOfWeek || !selectedWorkout) return;

    setPickerResult({
      dayOfWeek,
      workout: selectedWorkout,
    });

    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <FullScreenPicker
      title="Choose Workout"
      description="Select one workout for this weekly plan day."
      onClose={handleClose}
      onDone={handleDone}
      doneText="Use Workout"
      doneDisabled={!selectedWorkout || !dayOfWeek}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search workout"
      isLoading={isLoading}
      isError={isError}
      isEmpty={workouts.length === 0}
      errorText="Failed to load workouts"
      emptyTitle="No workouts found"
      emptyText="Try changing your search or filters."
      onRetry={() => refetch()}
      loadingSkeleton={<ChooseWorkoutPickerSkeleton />}
      searchRight={
        <WorkoutFilterBottomSheet value={filters} onApplyFilters={setFilters} />
      }
    >
      <FlatList
        data={workouts}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="gap-3"
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator />
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const isSelected = selectedWorkoutId === item.id;
          const cardItem = mapWorkoutToWorkoutCardItem(item);

          return (
            <WorkoutCard
              title={cardItem.title}
              subtitle={cardItem.subtitle}
              imageUrl={cardItem.imageUrl}
              metaItems={cardItem.metaItems}
              onPress={() => handleSelectWorkout(item)}
              className="border"
              style={{
                borderColor: isSelected ? colors.app.brand : "transparent",
              }}
            />
          );
        }}
      />
    </FullScreenPicker>
  );
}
