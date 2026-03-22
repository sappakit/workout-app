import { exerciseApi } from "@/app/api/exercise.api";
import { AppButton } from "@/components/custom-ui/AppButton";
import Thumbnail from "@/components/custom-ui/Thumbnail";
import { ThemedText } from "@/components/themed-text";
import { DifficultyBadge } from "@/components/workout/exercise-card/base/DifficultyBadge";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import {
  DifficultyLabel,
  Exercise,
  ExerciseTypeLabel,
} from "@/types/workout/response/exercise.types";
import { CircleCheck, Info, SlidersHorizontal } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import FullScreenPickerModal from "./FullScreenPickerModal";

interface ExercisePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onDone: (selectedExercises: Exercise[]) => void;
  selectedExerciseIds?: number[];
}

export default function ExercisePickerModal({
  visible,
  onClose,
  onDone,
  selectedExerciseIds = [],
}: ExercisePickerModalProps) {
  const [search, setSearch] = useState("");
  const [tempSelectedExercises, setTempSelectedExercises] = useState<
    Exercise[]
  >([]);

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

  // Keep selected ids memoized so row props stay simpler.
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

  const resetPickerState = () => {
    setTempSelectedExercises([]);
    setSearch("");
  };

  const handleDone = () => {
    onDone(tempSelectedExercises);
    resetPickerState();
  };

  const handleClose = () => {
    resetPickerState();
    onClose();
  };

  return (
    <FullScreenPickerModal
      visible={visible}
      title="Add Exercise"
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
          // paddingVertical: 16,
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
    </FullScreenPickerModal>
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
