import { workoutApi } from "@/app/api/workout.api";
import { AppButton } from "@/components/custom-ui/AppButton";
import FullScreenPicker from "@/components/form/picker/FullScreenPicker";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteOptionsQuery } from "@/lib/query/useInfiniteOptionsQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { WorkoutResponse } from "@/types/workout/response/workout.types";
import clsx from "clsx";
import { useRouter } from "expo-router";
import { Check, SlidersHorizontal } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";

export default function ChooseWorkoutPage() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [selectedWorkout, setSelectedWorkout] =
    useState<WorkoutResponse | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

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
    queryKey: workoutQueryKeys.all,
    search: debouncedSearch,
    limit: 20,
  });

  const workouts = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const loadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  };

  const handleSelectWorkout = (workout: WorkoutResponse) => {
    setSelectedWorkout((prev) => {
      if (prev?.id === workout.id) return null;
      return workout;
    });
  };

  const handleDone = () => {
    if (!selectedWorkout) return;

    // TODO: later connect this to Zustand / draft state.
    // Example:
    // setSelectedWorkoutDraft(selectedWorkout);

    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <FullScreenPicker
      title="Choose Workout"
      description="Select one workout to use."
      onClose={handleClose}
      onDone={handleDone}
      doneDisabled={!selectedWorkout}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search workout"
      isLoading={isLoading}
      isError={isError}
      errorText="Failed to load workouts"
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
          const isSelected = selectedWorkout?.id === item.id;

          return (
            <Pressable
              onPress={() => handleSelectWorkout(item)}
              className={twMerge(
                clsx(
                  "flex-row items-center justify-between rounded-2xl border px-4 py-4",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card",
                ),
              )}
              style={{ backgroundColor: colors.app.cardPrimary }}
            >
              <View className="flex-1 pr-3">
                <ThemedText type="defaultSemiBold" variant="primary">
                  {item.name}
                </ThemedText>
              </View>

              {isSelected ? (
                <View className="bg-primary h-7 w-7 items-center justify-center rounded-full">
                  <Check size={16} color="white" />
                </View>
              ) : (
                <View className="border-border h-7 w-7 rounded-full border" />
              )}
            </Pressable>
          );
        }}
      />
    </FullScreenPicker>
  );
}
