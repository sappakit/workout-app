import { exerciseApi } from "@/app/api/exercise.api";
import { AppButton } from "@/components/custom-ui/AppButton";
import Thumbnail from "@/components/custom-ui/Thumbnail";
import FullScreenPicker from "@/components/form/picker/FullScreenPicker";
import { ThemedText } from "@/components/themed-text";
import { DifficultyBadge } from "@/components/workout/exercise-card/base/DifficultyBadge";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { mapExerciseToCreateWorkoutExerciseFormItem } from "@/lib/workout/mappers";
import { EditPlanForm } from "@/schemas/edit-plan.schema";
import { useEditPlanDraftStore } from "@/stores/editPlanDraftStore";
import {
  DifficultyLabel,
  Exercise,
  ExerciseTypeLabel,
} from "@/types/workout/response/exercise.types";
import { useRouter } from "expo-router";
import { CircleCheck, Info, SlidersHorizontal } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

type WorkoutExerciseDraftItem = EditPlanForm["workoutExercises"][number];

export default function AddExercisesPage() {
  const router = useRouter();

  const draftWorkoutId = useEditPlanDraftStore((state) => state.workoutId);
  const draft = useEditPlanDraftStore((state) => state.draft);
  const replaceDraft = useEditPlanDraftStore((state) => state.replaceDraft);

  const [search, setSearch] = useState("");
  const [tempSelectedExercises, setTempSelectedExercises] = useState<
    Exercise[]
  >([]);

  const selectedExerciseIds = useMemo(
    () => draft?.workoutExercises.map((item) => item.exercise.id) ?? [],
    [draft],
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
    queryKey: ["exercises"],
    search,
    limit: 20,
  });

  const exercises = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const tempSelectedExerciseIds = useMemo(
    () => tempSelectedExercises.map((exercise) => exercise.id),
    [tempSelectedExercises],
  );

  const loadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  };

  const handleToggleExercise = (exercise: Exercise) => {
    if (selectedExerciseIds.includes(exercise.id)) return;

    setTempSelectedExercises((prev) => {
      const exists = prev.some((item) => item.id === exercise.id);

      if (exists) {
        return prev.filter((item) => item.id !== exercise.id);
      }

      return [...prev, exercise];
    });
  };

  const handleDone = () => {
    if (!draft || !draftWorkoutId) {
      router.back();
      return;
    }

    const currentExercises = draft.workoutExercises ?? [];

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

  const handleClose = () => {
    router.back();
  };

  if (!draft) {
    return (
      <FullScreenPicker
        title="Add Exercise"
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
            No edit draft found.
          </ThemedText>
        </View>
      </FullScreenPicker>
    );
  }

  return (
    <FullScreenPicker
      title="Add Exercise"
      description="Select one or more exercises to add to this workout plan."
      onClose={handleClose}
      onDone={handleDone}
      doneDisabled={tempSelectedExercises.length === 0}
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
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          gap: 8,
        }}
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
        renderItem={({ item }) => (
          <ExerciseItem
            item={item}
            alreadyAddedIds={selectedExerciseIds}
            selectedExerciseIds={tempSelectedExerciseIds}
            onToggle={handleToggleExercise}
          />
        )}
      />
    </FullScreenPicker>
  );
}

interface ExerciseItemProps {
  item: Exercise;
  alreadyAddedIds: number[];
  selectedExerciseIds: number[];
  onToggle: (exercise: Exercise) => void;
}

function ExerciseItem({
  item,
  alreadyAddedIds,
  selectedExerciseIds,
  onToggle,
}: ExerciseItemProps) {
  const { colors } = useAppTheme();

  const isAlreadyAdded = alreadyAddedIds.includes(item.id);
  const isSelected = selectedExerciseIds.includes(item.id);

  return (
    <Pressable
      onPress={() => {
        if (isAlreadyAdded) return;
        onToggle(item);
      }}
      className="relative flex-row gap-4 overflow-hidden rounded-3xl border p-2"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: isSelected ? colors.app.borderSecondary : "transparent",
        opacity: isAlreadyAdded ? 0.6 : 1,
      }}
    >
      <View className="absolute right-0 top-0 z-10 px-4">
        <DifficultyBadge label={DifficultyLabel[item.difficultyLevel]} />
      </View>

      <Thumbnail />

      <View className="flex-1 justify-between">
        <View>
          <ThemedText type="default" variant="primary" className="text-xs">
            {ExerciseTypeLabel[item.exerciseType]}
          </ThemedText>

          <ThemedText
            type="default"
            variant="brand"
            className="text-lg font-semibold"
            numberOfLines={2}
          >
            {item.name}
          </ThemedText>
        </View>

        {isAlreadyAdded && (
          <View className="flex-row items-center gap-1">
            <CircleCheck size={12} color={colors.app.textPrimary} />

            <ThemedText type="default" variant="primary" className="text-xs">
              Already added
            </ThemedText>
          </View>
        )}
      </View>

      <View className="flex-row items-end gap-1">
        <AppButton
          variant="option"
          icon={Info}
          className="h-8 w-8 rounded-full"
          // TODO: connect exercise detail action later.
        />
      </View>
    </Pressable>
  );
}
