import ExerciseFilterBottomSheet from "@/components/bottom-sheet/exercise-filter/ExerciseFilterBottomSheet";
import {
  DEFAULT_EXERCISE_FILTERS,
  ExerciseFilterValues,
} from "@/components/bottom-sheet/exercise-filter/ExerciseFilterSheetContent";
import FullScreenPicker from "@/components/form/picker/FullScreenPicker";
import { ThemedText } from "@/components/themed-text";
import {
  ExerciseCard,
  mapExerciseToExerciseCardItem,
} from "@/components/workout/ui/exercise-card/ExerciseCard";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useDebounce } from "@/hooks/useDebounce";
import { exerciseApi } from "@/lib/api/exercise.api";
import { exerciseQueryKeys } from "@/lib/exercise/keys";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { mapExerciseToCreateWorkoutExerciseFormItem } from "@/lib/workout/mappers";
import { EditPlanForm } from "@/schemas/edit-plan.schema";
import { usePlanFormDraftStore } from "@/stores/planFormDraftStore";
import { Exercise } from "@/types/workout/response/exercise.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

type WorkoutExerciseDraftItem = EditPlanForm["workoutExercises"][number];

type AddExercisesParams = {
  mode?: string;
  exerciseClientId?: string;
};

export default function AddExercisesPage() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const params = useLocalSearchParams<AddExercisesParams>();

  const isReplaceMode = params.mode === "replace";
  const targetExerciseClientId = params.exerciseClientId;

  const draft = usePlanFormDraftStore((state) => state.draft);
  const replaceDraft = usePlanFormDraftStore((state) => state.replaceDraft);

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

  const currentExercises = draft?.workoutExercises ?? [];

  const targetWorkoutExercise = currentExercises.find(
    (item) => item.clientId === targetExerciseClientId,
  );

  const selectedExerciseIds = new Set(
    currentExercises.map((item) => item.exercise.id),
  );

  const tempSelectedExerciseIds = new Set(
    tempSelectedExercises.map((exercise) => exercise.id),
  );

  const pickerTitle = isReplaceMode ? "Replace Exercise" : "Add Exercise";

  const pickerDescription = isReplaceMode
    ? `Select one exercise to replace ${
        targetWorkoutExercise?.exercise.name ?? "this exercise"
      }.`
    : "Select one or more exercises to add to this workout plan.";

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
      "add-exercise-picker",
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

  const handleDone = () => {
    if (!draft) {
      router.back();
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (isReplaceMode) {
        handleReplaceExercise();
        return;
      }

      handleAddExercises();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleAddExercises = () => {
    if (!draft) {
      router.back();
      return;
    }

    const nextItems: WorkoutExerciseDraftItem[] = [...currentExercises];

    let nextOrderIndex =
      currentExercises.length > 0
        ? Math.max(...currentExercises.map((item) => item.orderIndex)) + 1
        : 1;

    tempSelectedExercises.forEach((exercise) => {
      const exists = currentExercises.some(
        (item) => item.exercise.id === exercise.id,
      );

      if (exists) return;

      nextItems.push(
        mapExerciseToCreateWorkoutExerciseFormItem(exercise, nextOrderIndex),
      );

      nextOrderIndex += 1;
    });

    replaceDraft({
      ...draft,
      workoutExercises: nextItems,
    });

    router.back();
  };

  const handleReplaceExercise = () => {
    const selectedExercise = tempSelectedExercises[0];

    if (!draft || !selectedExercise || !targetExerciseClientId) {
      router.back();
      return;
    }

    const targetExerciseIndex = currentExercises.findIndex(
      (item) => item.clientId === targetExerciseClientId,
    );

    if (targetExerciseIndex === -1) {
      router.back();
      return;
    }

    const targetWorkoutExercise = currentExercises[targetExerciseIndex];

    const replacementExercise = mapExerciseToCreateWorkoutExerciseFormItem(
      selectedExercise,
      targetWorkoutExercise.orderIndex,
    );

    const nextItems = currentExercises.map((item, index) => {
      if (index !== targetExerciseIndex) {
        return item;
      }

      return replacementExercise;
    });

    replaceDraft({
      ...draft,
      workoutExercises: nextItems,
    });

    router.back();
  };

  if (!draft) {
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
            No plan draft found.
          </ThemedText>
        </View>
      </FullScreenPicker>
    );
  }

  if (isReplaceMode && !targetWorkoutExercise) {
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
            Exercise not found in this workout plan.
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
