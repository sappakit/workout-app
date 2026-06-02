import { exerciseApi } from "@/app/api/exercise.api";
import { AppButton } from "@/components/custom-ui/AppButton";
import FullScreenPicker from "@/components/form/picker/FullScreenPicker";
import { ThemedText } from "@/components/themed-text";
import { ExercisePickerCard } from "@/components/workout/ui/exercise-card/ExercisePickerCard";
import { useDebounce } from "@/hooks/useDebounce";
import { exerciseQueryKeys } from "@/lib/exercise/keys";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { mapExerciseToCreateWorkoutExerciseFormItem } from "@/lib/workout/mappers";
import { EditPlanForm } from "@/schemas/edit-plan.schema";
import { usePlanFormDraftStore } from "@/stores/planFormDraftStore";
import { Exercise } from "@/types/workout/response/exercise.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

type WorkoutExerciseDraftItem = EditPlanForm["workoutExercises"][number];

type AddExercisesParams = {
  mode?: string;
  exerciseClientId?: string;
};

export default function AddExercisesPage() {
  const router = useRouter();

  const params = useLocalSearchParams<AddExercisesParams>();

  const isReplaceMode = params.mode === "replace";
  const targetExerciseClientId = params.exerciseClientId;

  const draft = usePlanFormDraftStore((state) => state.draft);
  const replaceDraft = usePlanFormDraftStore((state) => state.replaceDraft);

  const [tempSelectedExercises, setTempSelectedExercises] = useState<
    Exercise[]
  >([]);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

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
    queryKey: exerciseQueryKeys.all,
    search: debouncedSearch,
    limit: 20,
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
        title={isReplaceMode ? "Replace Exercise" : "Add Exercise"}
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
      title={isReplaceMode ? "Replace Exercise" : "Add Exercise"}
      description={
        isReplaceMode
          ? `Select one exercise to replace ${
              targetWorkoutExercise?.exercise.name ?? "this exercise"
            }.`
          : "Select one or more exercises to add to this workout plan."
      }
      onClose={handleClose}
      onDone={handleDone}
      doneText={isReplaceMode ? "Replace" : "Done"}
      doneDisabled={tempSelectedExercises.length === 0 || isSubmitting}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search exercise"
      isLoading={isLoading}
      isError={isError}
      errorText="Failed to load exercises"
      onRetry={() => refetch()}
      searchRight={
        <AppButton
          variant="option"
          icon={SlidersHorizontal}
          className="h-12 w-12 rounded-full"
          iconSize={18}
          // TODO: connect filter action later.
        />
      }
    >
      <FlatList
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="gap-2"
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <ThemedText type="default" variant="secondary">
              No exercises found
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
          const isAlreadyAdded = selectedExerciseIds.has(item.id);
          const isSelected = tempSelectedExerciseIds.has(item.id);

          const status = isAlreadyAdded
            ? "already-added"
            : isSelected
              ? "selected"
              : "idle";

          return (
            <ExercisePickerCard
              exercise={item}
              status={status}
              onPressAdd={() => handleToggleExercise(item)}
            />
          );
        }}
      />
    </FullScreenPicker>
  );
}
