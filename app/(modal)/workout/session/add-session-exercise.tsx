import ExerciseFilterBottomSheet from "@/components/bottom-sheet/exercise-filter/ExerciseFilterBottomSheet";
import {
  DEFAULT_EXERCISE_FILTERS,
  ExerciseFilterValues,
} from "@/components/bottom-sheet/exercise-filter/ExerciseFilterSheetContent";
import FullScreenPicker from "@/components/form/picker/FullScreenPicker";
import { ThemedText } from "@/components/themed-text";
import {
  addSessionExercise,
  replaceSessionExercise,
} from "@/components/workout-in-progress/model/helpers";
import {
  ExerciseCard,
  mapExerciseToExerciseCardItem,
} from "@/components/workout/ui/exercise-card/ExerciseCard";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useDebounce } from "@/hooks/useDebounce";
import { api } from "@/lib/api/client";
import { exerciseApi } from "@/lib/api/exercise.api";
import { exerciseQueryKeys } from "@/lib/exercise/keys";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { useWorkoutSessionStore } from "@/stores/workoutSessionStore";
import { Exercise } from "@/types/workout/response/exercise.types";
import { ExercisePerformanceSummary } from "@/types/workout/response/workout.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

type AddSessionExerciseParams = {
  mode?: string;
  exerciseClientId?: string;
};

export default function AddSessionExercisePage() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const params = useLocalSearchParams<AddSessionExerciseParams>();

  const isReplaceMode = params.mode === "replace";
  const targetExerciseClientId = params.exerciseClientId;

  const session = useWorkoutSessionStore((state) => state.session);
  const updateSession = useWorkoutSessionStore((state) => state.updateSession);
  const mergePerformanceByExerciseId = useWorkoutSessionStore(
    (state) => state.mergePerformanceByExerciseId,
  );
  const removePerformanceByExerciseId = useWorkoutSessionStore(
    (state) => state.removePerformanceByExerciseId,
  );

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

  const targetSessionExercise = session?.sessionExercises.find(
    (item) => item.clientId === targetExerciseClientId,
  );

  const selectedExerciseIds = new Set(
    session?.sessionExercises.map((item) => item.exercise.id) ?? [],
  );

  const tempSelectedExerciseIds = new Set(
    tempSelectedExercises.map((exercise) => exercise.id),
  );

  const pickerTitle = isReplaceMode ? "Replace Exercise" : "Add Exercise";

  const pickerDescription = isReplaceMode
    ? `Select one exercise to replace ${
        targetSessionExercise?.exercise.name ?? "this exercise"
      }.`
    : "Select one or more exercises to add to this workout session.";

  const doneText = isReplaceMode ? "Replace" : "Done";

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
      "add-session-exercise-picker",
      debouncedSearch,
      filters.exerciseTypes,
      filters.muscleIds,
      filters.sortBy,
      filters.sortDirection,
    ],
    search: debouncedSearch,
    limit: 20,
    params: {
      exerciseTypes:
        filters.exerciseTypes.length > 0 ? filters.exerciseTypes : undefined,
      muscleIds: filters.muscleIds.length > 0 ? filters.muscleIds : undefined,
      sortBy: sortByParam,
    },
  });

  const exercises = data?.pages.flatMap((page) => page.data) ?? [];

  const loadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  };

  const fetchExercisePerformanceMap = async (exercises: Exercise[]) => {
    const exerciseIds = exercises.map((exercise) => exercise.id);

    if (exerciseIds.length === 0) {
      return {};
    }

    const response = await api.get<{
      data: Record<string, ExercisePerformanceSummary>;
    }>(exerciseApi.getExercisesPerformance(), {
      params: { exerciseIds },
    });

    return response.data.data;
  };

  const handleToggleExercise = (exercise: Exercise) => {
    if (selectedExerciseIds.has(exercise.id)) return;

    setTempSelectedExercises((prev) => {
      const exists = prev.some((item) => item.id === exercise.id);

      if (exists) {
        return prev.filter((item) => item.id !== exercise.id);
      }

      if (isReplaceMode) {
        return [exercise];
      }

      return [...prev, exercise];
    });
  };

  const handleDone = async () => {
    if (!session) {
      router.back();
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (isReplaceMode) {
        await handleReplaceExercise();
        return;
      }

      await handleAddExercises();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleAddExercises = async () => {
    const performanceMap = await fetchExercisePerformanceMap(
      tempSelectedExercises,
    );

    updateSession((prev) => addSessionExercise(prev, tempSelectedExercises));
    mergePerformanceByExerciseId(performanceMap);

    router.back();
  };

  const handleReplaceExercise = async () => {
    const selectedExercise = tempSelectedExercises[0];

    if (!selectedExercise || !targetExerciseClientId) {
      router.back();
      return;
    }

    const oldExerciseId = targetSessionExercise?.exercise.id;

    const performanceMap = await fetchExercisePerformanceMap([
      selectedExercise,
    ]);

    updateSession((prev) =>
      replaceSessionExercise(prev, targetExerciseClientId, selectedExercise),
    );

    if (oldExerciseId != null) {
      removePerformanceByExerciseId(oldExerciseId);
    }

    mergePerformanceByExerciseId(performanceMap);

    router.back();
  };

  if (!session) {
    return (
      <FullScreenPicker
        title={pickerTitle}
        onClose={handleClose}
        onDone={handleClose}
        doneText="Back"
        closeText="Back"
        doneDisabled={false}
        searchValue=""
        onSearchChange={() => {}}
        isError={false}
      >
        <View className="flex-1 items-center justify-center px-6">
          <ThemedText type="default" variant="secondary">
            No active workout session found.
          </ThemedText>
        </View>
      </FullScreenPicker>
    );
  }

  if (isReplaceMode && !targetSessionExercise) {
    return (
      <FullScreenPicker
        title="Replace Exercise"
        onClose={handleClose}
        onDone={handleClose}
        doneText="Back"
        closeText="Back"
        doneDisabled={false}
        searchValue=""
        onSearchChange={() => {}}
        isError={false}
      >
        <View className="flex-1 items-center justify-center px-6">
          <ThemedText type="default" variant="secondary">
            Exercise not found in this workout session.
          </ThemedText>
        </View>
      </FullScreenPicker>
    );
  }

  return (
    <FullScreenPicker
      title={pickerTitle}
      description={pickerDescription}
      onClose={handleClose}
      onDone={handleDone}
      doneText={doneText}
      doneDisabled={tempSelectedExercises.length === 0 || isSubmitting}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search exercise"
      isLoading={isLoading}
      isError={isError}
      isEmpty={exercises.length === 0}
      errorText="Failed to load exercises"
      emptyTitle="No exercises found"
      emptyText="Try changing your search or filters."
      onRetry={() => refetch()}
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
            <View className="py-4">
              <ActivityIndicator />
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const isAlreadyAdded = selectedExerciseIds.has(item.id);
          const isSelected = tempSelectedExerciseIds.has(item.id);
          const cardItem = mapExerciseToExerciseCardItem(item);

          return (
            <ExerciseCard
              title={cardItem.title}
              subtitle={isAlreadyAdded ? "Already added" : cardItem.subtitle}
              imageUrl={cardItem.imageUrl}
              metaItems={cardItem.metaItems}
              onPress={() => handleToggleExercise(item)}
              disabled={isSubmitting || isAlreadyAdded}
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
