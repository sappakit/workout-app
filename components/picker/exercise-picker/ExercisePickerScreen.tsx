import ExerciseFilterBottomSheet from "@/components/bottom-sheet/exercise-filter/ExerciseFilterBottomSheet";
import {
  DEFAULT_EXERCISE_FILTERS,
  type ExerciseFilterValues,
} from "@/components/bottom-sheet/exercise-filter/ExerciseFilterSheetContent";
import FullScreenPicker from "@/components/form/picker/FullScreenPicker";
import {
  ExerciseCard,
  mapExerciseToExerciseCardItem,
} from "@/components/workout/ui/exercise-card/ExerciseCard";
import { useDebounce } from "@/hooks/useDebounce";
import { exerciseApi } from "@/lib/api/exercise.api";
import { exerciseQueryKeys } from "@/lib/exercise/keys";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/types/workout/response/exercise.types";
import { useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

export type ExercisePickerMode = "add" | "replace";

type ExercisePickerScreenProps = {
  mode: ExercisePickerMode;
  targetExercise?: Exercise;
  addDescription: string;
  onClose: () => void;
  onDone: (selectedExercises: Exercise[]) => void | Promise<void>;
};

export function ExercisePickerScreen({
  mode,
  targetExercise,
  addDescription,
  onClose,
  onDone,
}: ExercisePickerScreenProps) {
  const isReplaceMode = mode === "replace";

  const [tempSelectedExercises, setTempSelectedExercises] = useState<
    Exercise[]
  >([]);

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState<ExerciseFilterValues>(
    DEFAULT_EXERCISE_FILTERS,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const sortByParam = filters.sortBy
    ? `${filters.sortBy}:${filters.sortDirection}`
    : undefined;

  const targetExerciseId = targetExercise?.id;

  const tempSelectedExerciseIds = new Set(
    tempSelectedExercises.map((exercise) => exercise.id),
  );

  const pickerTitle = isReplaceMode ? "Replace Exercise" : "Add Exercise";

  const pickerDescription = isReplaceMode
    ? `Select one exercise to replace ${targetExercise?.name ?? "this exercise"}.`
    : addDescription;

  const selectedCount = tempSelectedExercises.length;

  const doneText = isReplaceMode
    ? "Replace"
    : selectedCount > 0
      ? `Add (${selectedCount})`
      : "Add";

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteOptionsQuery<Exercise>({
    url: exerciseApi.getAll(),
    queryKey: [
      exerciseQueryKeys.all,
      debouncedSearch,
      filters.categoryIds,
      filters.muscleIds,
      filters.sortBy,
      filters.sortDirection,
    ],
    search: debouncedSearch,
    limit: 20,
    params: {
      categoryIds:
        filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
      muscleIds: filters.muscleIds.length > 0 ? filters.muscleIds : undefined,
      sortBy: sortByParam,
    },
  });

  const exercises = data?.pages.flatMap((page) => page.data) ?? [];

  const loadMore = () => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  };

  const handleToggleExercise = (exercise: Exercise) => {
    const isReplacingWithSameExercise =
      isReplaceMode && exercise.id === targetExerciseId;

    if (isReplacingWithSameExercise) {
      return;
    }

    setTempSelectedExercises((previousExercises) => {
      const exists = previousExercises.some((item) => item.id === exercise.id);

      if (exists) {
        return previousExercises.filter((item) => item.id !== exercise.id);
      }

      if (isReplaceMode) {
        return [exercise];
      }

      return [...previousExercises, exercise];
    });
  };

  const handleDone = async () => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      await onDone(tempSelectedExercises);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FullScreenPicker
      title={pickerTitle}
      description={pickerDescription}
      onClose={onClose}
      onDone={handleDone}
      doneText={doneText}
      doneDisabled={selectedCount === 0 || isSubmitting}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search exercise"
      isLoading={isLoading}
      isError={isError}
      isEmpty={exercises.length === 0}
      errorTitle="Couldn't load exercises"
      errorText="Something went wrong while loading exercises."
      emptyTitle="No exercises found"
      emptyText="Try changing your search or filters."
      onRetry={refetch}
      searchRight={
        <ExerciseFilterBottomSheet
          value={filters}
          onApplyFilters={setFilters}
        />
      }
    >
      <FlatList
        data={exercises}
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
          const isReplacingWithSameExercise =
            isReplaceMode && item.id === targetExerciseId;

          const isSelected = tempSelectedExerciseIds.has(item.id);

          const cardItem = mapExerciseToExerciseCardItem(item);

          return (
            <ExerciseCard
              title={cardItem.title}
              subtitle={cardItem.subtitle}
              imageUrl={cardItem.imageUrl}
              metaItems={cardItem.metaItems}
              onPress={() => handleToggleExercise(item)}
              disabled={isSubmitting || isReplacingWithSameExercise}
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
