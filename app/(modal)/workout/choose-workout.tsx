import { workoutApi } from "@/app/api/workout.api";
import { AppButton } from "@/components/custom-ui/AppButton";
import FullScreenPicker from "@/components/form/picker/FullScreenPicker";
import { ThemedText } from "@/components/themed-text";
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
import { SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

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

  const workouts = data?.pages.flatMap((page) => page.data) ?? [];

  const isSameWorkout = selectedWorkoutId === currentWorkoutId;

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
        !selectedWorkoutId || !scheduleId || isSameWorkout || isPending
      }
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
              <ThemedText type="default" variant="primary">
                {item.name}
              </ThemedText>
            </Pressable>
          );
        }}
      />
    </FullScreenPicker>
  );
}
