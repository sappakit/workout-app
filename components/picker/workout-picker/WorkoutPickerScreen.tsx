import { FilterBottomSheet } from "@/components/bottom-sheet/filter/FilterBottomSheet";
import {
  WorkoutFilterSheetContent,
  type WorkoutFilterValues,
} from "@/components/bottom-sheet/filter/workout-filter/WorkoutFilterSheetContent";
import { ChooseWorkoutPickerSkeleton } from "@/components/workout/ui/workout-card/ChooseWorkoutPickerSkeleton";
import {
  mapWorkoutToWorkoutCardItem,
  WorkoutCard,
} from "@/components/workout/ui/workout-card/WorkoutCard";
import { useDebounce } from "@/hooks/useDebounce";
import { workoutApi } from "@/lib/api/workout.api";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { cn } from "@/lib/utils";
import { workoutQueryKeys } from "@/lib/workout/keys";
import type { WorkoutResponse } from "@/types/workout/response/workout.types";
import { useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import FullScreenPicker from "../FullScreenPicker";

type WorkoutPickerScreenProps = {
  description: string;
  initialSelectedWorkoutId?: number | null;
  requireDifferentSelection?: boolean;
  onClose: () => void;
  onDone: (selectedWorkout: WorkoutResponse) => void | Promise<void>;
  defaultFilters: WorkoutFilterValues;
};

export function WorkoutPickerScreen({
  description,
  initialSelectedWorkoutId = null,
  requireDifferentSelection = false,
  onClose,
  onDone,
  defaultFilters,
}: WorkoutPickerScreenProps) {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(
    initialSelectedWorkoutId,
  );

  const [selectedWorkoutState, setSelectedWorkoutState] =
    useState<WorkoutResponse | null>(null);

  const [filters, setFilters] = useState<WorkoutFilterValues>(defaultFilters);

  const [search, setSearch] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const selectedWorkoutFromOptions =
    workouts.find((workout) => workout.id === selectedWorkoutId) ?? null;

  const selectedWorkout = selectedWorkoutState ?? selectedWorkoutFromOptions;

  const isInitialWorkout =
    selectedWorkoutId !== null &&
    selectedWorkoutId === initialSelectedWorkoutId;

  const loadMore = () => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  };

  const handleSelectWorkout = (workout: WorkoutResponse) => {
    if (isSubmitting) {
      return;
    }

    setSelectedWorkoutId(workout.id);
    setSelectedWorkoutState(workout);
  };

  const handleDone = async () => {
    if (
      !selectedWorkout ||
      isSubmitting ||
      (requireDifferentSelection && isInitialWorkout)
    ) {
      return;
    }

    try {
      setIsSubmitting(true);

      await onDone(selectedWorkout);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FullScreenPicker
      title="Choose Workout"
      description={description}
      onClose={onClose}
      onDone={handleDone}
      doneText="Use Workout"
      doneDisabled={
        !selectedWorkout ||
        isSubmitting ||
        (requireDifferentSelection && isInitialWorkout)
      }
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search workout"
      isLoading={isLoading}
      isError={isError}
      isEmpty={workouts.length === 0}
      errorTitle="Couldn't load workouts"
      errorText="Something went wrong while loading workouts."
      emptyTitle="No workouts found"
      emptyText="Try changing your search or filters."
      onRetry={refetch}
      loadingSkeleton={<ChooseWorkoutPickerSkeleton />}
      searchRight={
        <FilterBottomSheet<WorkoutFilterValues>
          value={filters}
          onChange={setFilters}
          resetValue={defaultFilters}
        >
          {({ value, onChange, bottomContentInset }) => (
            <WorkoutFilterSheetContent
              value={value}
              onChange={onChange}
              bottomContentInset={bottomContentInset}
            />
          )}
        </FilterBottomSheet>
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
            <View className="items-center py-4">
              <ActivityIndicator />
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const isSelected = selectedWorkoutId === item.id;

          const cardItem = mapWorkoutToWorkoutCardItem(item);

          return (
            <WorkoutCard
              id={cardItem.id}
              title={cardItem.title}
              subtitle={cardItem.subtitle}
              imageUrl={cardItem.imageUrl}
              metaItems={cardItem.metaItems}
              onPress={() => handleSelectWorkout(item)}
              disabled={isSubmitting}
              className={cn(
                "border",
                isSelected ? "border-primary" : "border-transparent",
              )}
            />
          );
        }}
      />
    </FullScreenPicker>
  );
}
