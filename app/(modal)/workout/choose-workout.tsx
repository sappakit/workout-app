import { workoutApi } from "@/app/api/workout.api";
import { SortDirection } from "@/components/bottom-sheet/workout-filter/page/WorkoutFilterSortPage";
import WorkoutFilterBottomSheet from "@/components/bottom-sheet/workout-filter/WorkoutFilterBottomSheet";
import { WorkoutFilterValues } from "@/components/bottom-sheet/workout-filter/WorkoutFilterSheetContent";
import FullScreenPicker from "@/components/form/picker/FullScreenPicker";
import { ChooseWorkoutPickerSkeleton } from "@/components/workout/ui/workout-card/ChooseWorkoutPickerSkeleton";
import {
  mapWorkoutToWorkoutCardItem,
  WorkoutCard,
} from "@/components/workout/ui/workout-card/WorkoutCard";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useDebounce } from "@/hooks/useDebounce";
import { api } from "@/lib/api";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { WorkoutResponse } from "@/types/workout/response/workout.types";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

export type WorkoutSortKey = "created_at" | "name" | "duration";

export const DEFAULT_SORT_BY: WorkoutSortKey = "created_at";
export const DEFAULT_SORT_DIRECTION: SortDirection = "DESC";
export const DEFAULT_WORKOUT_FILTERS: WorkoutFilterValues = {
  focusTypeIds: [],
  muscleIds: [],
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
};

export default function ChooseWorkoutPage() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const toast = useAppToast();
  const invalidateQueries = useInvalidateQueries();

  const params = useLocalSearchParams<{
    scheduleId?: string;
    workoutId?: string;
  }>();

  const scheduleId = params.scheduleId ? Number(params.scheduleId) : null;
  const currentWorkoutId = params.workoutId ? Number(params.workoutId) : null;

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
      "today-workout-picker",
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

  const isSameWorkout = selectedWorkoutId === currentWorkoutId;

  const { mutate: updateScheduleWorkout, isPending } = useMutation({
    mutationFn: async (workoutId: number) => {
      if (!scheduleId) {
        throw new Error("Missing schedule id");
      }

      return api.patch(workoutApi.updateScheduleWorkout(scheduleId), {
        workoutId,
      });
    },
    onSuccess: async () => {
      await invalidateQueries([workoutQueryKeys.current]);

      toast.success({
        title: "Workout updated",
        message: "Today's workout has been changed.",
      });

      router.back();
    },
    onError: (_err: unknown) => {
      toast.error({
        title: "Failed to update workout",
        message: "Please try again.",
      });
    },
  });

  const loadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  };

  const handleSelectWorkout = (workout: WorkoutResponse) => {
    setSelectedWorkoutId(workout.id);
  };

  const handleDone = () => {
    if (!selectedWorkoutId || !scheduleId) return;

    updateScheduleWorkout(selectedWorkoutId);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <FullScreenPicker
      title="Choose Workout"
      description="Select one workout to use for today's plan."
      onClose={handleClose}
      onDone={handleDone}
      doneText="Use Workout"
      doneDisabled={
        !selectedWorkout || !scheduleId || isSameWorkout || isPending
      }
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
              disabled={isPending}
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
