import { workoutApi } from "@/app/api/workout.api";
import { SortDirection } from "@/components/bottom-sheet/workout-filter/page/WorkoutFilterSortPage";
import WorkoutFilterBottomSheet from "@/components/bottom-sheet/workout-filter/WorkoutFilterBottomSheet";
import { WorkoutFilterValues } from "@/components/bottom-sheet/workout-filter/WorkoutFilterSheetContent";
import FullScreenPicker from "@/components/form/picker/FullScreenPicker";
import { ThemedText } from "@/components/themed-text";
import { useWeeklyPlanWorkoutPickerStore } from "@/components/weekly-plan/weeklyPlanWorkoutSelectionStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { WorkoutResponse } from "@/types/workout/response/workout.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

export type WorkoutSortKey = "created_at" | "name" | "duration";

export const DEFAULT_SORT_BY: WorkoutSortKey = "created_at";
export const DEFAULT_SORT_DIRECTION: SortDirection = "DESC";

const DEFAULT_WORKOUT_FILTERS: WorkoutFilterValues = {
  focusTypeIds: [],
  muscleIds: [],
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
};

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
      errorText="Failed to load workouts"
      onRetry={() => refetch()}
      searchRight={
        <WorkoutFilterBottomSheet value={filters} onApplyFilters={setFilters} />
      }
    >
      <FlatList
        data={workouts}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="gap-2"
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <ThemedText type="default" variant="secondary">
              No workouts found
            </ThemedText>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator />
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const isSelected = selectedWorkoutId === item.id;

          return (
            <Pressable
              onPress={() => handleSelectWorkout(item)}
              className="flex-row items-center justify-between rounded-2xl border px-4 py-4"
              style={{
                backgroundColor: colors.app.cardPrimary,
                borderColor: isSelected
                  ? colors.app.brand
                  : colors.app.borderPrimary,
              }}
            >
              <View className="flex-1">
                <ThemedText type="default" variant="primary">
                  {item.name}
                </ThemedText>

                {item.workoutFocusType?.name ? (
                  <ThemedText type="small" variant="secondary" className="mt-1">
                    {item.workoutFocusType.name}
                  </ThemedText>
                ) : null}
              </View>

              {isSelected ? <Check size={20} color={colors.app.brand} /> : null}
            </Pressable>
          );
        }}
      />
    </FullScreenPicker>
  );
}
