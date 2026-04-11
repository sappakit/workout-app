import { workoutApi } from "@/app/api/workout.api";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { api } from "@/lib/api";
import { createClientId } from "@/lib/id/utils";
import { invalidateQueryKeys } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutMutationKeys, workoutQueryKeys } from "@/lib/workout/keys";
import { useWorkoutSessionStore } from "@/stores/workoutSessionStore";
import {
  WorkoutSessionExerciseModel,
  WorkoutSessionExerciseSetModel,
} from "@/types/workout/model/workout.types";
import { WorkoutSession } from "@/types/workout/response/workout.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import {
  BicepsFlexed,
  Check,
  ChevronRight,
  MoreVertical,
  Plus,
  Timer,
  Trash2,
  X,
} from "lucide-react-native";
import { useEffect } from "react";
import {
  Alert,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { AppButton } from "../custom-ui/AppButton";
import Thumbnail from "../custom-ui/Thumbnail";

type WorkoutInProgressContentProps = {
  session: WorkoutSession;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80";

export function WorkoutInProgressContent({
  session,
}: WorkoutInProgressContentProps) {
  const { colors } = useAppTheme();

  const queryClient = useQueryClient();
  const toast = useAppToast();

  // Workout session store
  const hydrated = useWorkoutSessionStore((state) => state.hydrated);
  const storedSession = useWorkoutSessionStore((state) => state.session);
  const initializeSession = useWorkoutSessionStore(
    (state) => state.initializeSession,
  );

  const updateSession = useWorkoutSessionStore((state) => state.updateSession);
  const updateSessionSet = useWorkoutSessionStore(
    (state) => state.updateSessionSet,
  );
  const clearSession = useWorkoutSessionStore((state) => state.clearSession);

  // Initialize session state
  useEffect(() => {
    if (!hydrated) return;

    initializeSession(session);
  }, [hydrated, session, initializeSession]);

  // Ensure store is hydrated and contains the current session
  const isActiveSessionReady = hydrated && storedSession?.id === session.id;

  // Use storedSession as the single source of truth
  const currentExercise = storedSession?.sessionExercises.find(
    (exercise) => !exercise.isSkipped && !exercise.completedAt,
  );
  const setItems = currentExercise?.sets ?? [];

  // Cancel workout mutation
  const cancelWorkoutMutation = useMutation({
    mutationKey: workoutMutationKeys.cancelSession,
    mutationFn: () => api.post(workoutApi.cancelSession()),
    onSuccess: async () => {
      clearSession();

      await invalidateQueryKeys(queryClient, [workoutQueryKeys.current]);

      toast.success({
        title: "Workout cancelled",
        message: "Your workout was discarded.",
      });
    },
    onError: () => {
      toast.error({
        title: "Cancel failed",
        message: "Could not cancel workout session.",
      });
    },
  });

  /* Function */
  // Add set
  const handleAddSet = () => {
    if (!currentExercise) return;

    updateSession((prev) => ({
      ...prev,
      sessionExercises: prev.sessionExercises.map((exercise) => {
        if (exercise.id !== currentExercise.id) return exercise;

        const lastSet = exercise.sets[exercise.sets.length - 1];
        const nextSetNumber = lastSet ? lastSet.setNumber + 1 : 1;

        const newSet: WorkoutSessionExerciseSetModel = {
          id: null,
          clientId: createClientId("new"),
          setNumber: nextSetNumber,
          reps: null,
          weight: null,
          distance: null,
          duration: null,
          performedAt: null,
          completedAt: null,
        };

        return {
          ...exercise,
          sets: [...exercise.sets, newSet],
        };
      }),
    }));
  };

  // Delete set
  const handleDeleteSet = (clientId: string) => {
    if (!currentExercise) return;

    updateSession((prev) => ({
      ...prev,
      sessionExercises: prev.sessionExercises.map((exercise) => {
        if (exercise.id !== currentExercise.id) return exercise;

        const filteredSets = exercise.sets
          .filter((set) => set.clientId !== clientId)
          .map((set, index) => ({
            ...set,
            setNumber: index + 1,
          }));

        return {
          ...exercise,
          sets: filteredSets,
        };
      }),
    }));
  };

  // Complete set
  const handleToggleSetCompleted = (clientId: string) => {
    if (!currentExercise) return;

    updateSessionSet(currentExercise.id, clientId, (set) => ({
      ...set,
      completedAt: set.completedAt ? null : new Date().toISOString(),
    }));
  };

  // Cancel workout
  const handleCancelWorkout = () => {
    Alert.alert(
      "Cancel workout?",
      "All progress from this session will be lost.",
      [
        {
          text: "Keep Workout",
          style: "cancel",
        },
        {
          text: "Discard Workout",
          style: "destructive",
          onPress: () => cancelWorkoutMutation.mutate(),
        },
      ],
    );
  };

  // TODO: remove
  useEffect(() => {
    console.log(currentExercise?.sets);
  }, [currentExercise]);

  // TODO: add loading
  if (!isActiveSessionReady) {
    return null;
  }

  return (
    <PageLayout
      headerProps={{
        variant: "title",
        title: "Workout",
      }}
      scrollable={false}
      containerStyle={{ paddingHorizontal: 0, paddingTop: 0 }}
    >
      {/* Hero */}
      <ImageBackground
        source={{ uri: fallbackImage }}
        resizeMode="cover"
        style={{ height: 240 }}
      >
        {/* Next exercise */}
        <View className="absolute right-0 top-0 z-10 items-center justify-center p-2">
          <Thumbnail image={fallbackImage} style={{ height: 56, width: 56 }} />

          <View className="flex-row items-center gap-1">
            <ThemedText type="default" variant="accent" className="text-xs">
              Next exercise
            </ThemedText>

            <ChevronRight size={12} color={colors.app.textAccent} />
          </View>
        </View>

        <LinearGradient
          colors={["transparent", colors.app.background]}
          locations={[0.4, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <View className="flex-1 items-center justify-end pb-4">
          <ThemedText type="default" variant="accent">
            {storedSession.workoutSchedule.workout.name}
          </ThemedText>

          <ThemedText
            type="default"
            variant="brand"
            className="mt-1 text-center text-4xl font-bold"
          >
            {currentExercise?.exercise.name ?? "Workout Complete"}
          </ThemedText>
        </View>
      </ImageBackground>

      {/* TODO: remove */}
      <AppButton
        title="Cancel Workout"
        variant="primary"
        icon={X}
        textClassName="font-medium"
        onPress={handleCancelWorkout}
        loading={cancelWorkoutMutation.isPending}
      />

      {/* Progress */}
      <View className="gap-4 px-4">
        <View
          className="rounded-2xl border"
          style={{
            backgroundColor: colors.app.cardPrimary,
            borderColor: colors.app.borderPrimary,
          }}
        >
          {/* Top section */}
          <View className="gap-4 p-4">
            <View
              className="flex-row items-center gap-3"
              style={{
                borderColor: colors.app.borderPrimary,
              }}
            >
              <View
                className="h-14 w-14 items-center justify-center rounded-full"
                style={{
                  backgroundColor: colors.app.brand + 20,
                }}
              >
                <BicepsFlexed size={28} color={colors.app.brand} />
              </View>

              <View>
                <ThemedText
                  type="default"
                  variant="accent"
                  className="text-base"
                >
                  In progress ...
                </ThemedText>

                <ThemedText
                  type="default"
                  variant="primary"
                  className="text-xs"
                >
                  Set 2 of 4
                </ThemedText>
              </View>

              <TouchableOpacity className="ml-auto self-start p-1">
                <MoreVertical size={20} color={colors.app.textPrimary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="flex-row items-center gap-1">
              <Timer size={20} color={colors.app.brand} />

              <ThemedText type="default" variant="brand">
                1 min rest
              </ThemedText>
            </TouchableOpacity>
          </View>

          <FlatList
            data={setItems}
            keyExtractor={(item) => item.clientId}
            renderItem={({ item }) => (
              <WorkoutSetCard
                item={item}
                onDelete={() => handleDeleteSet(item.clientId)}
                onToggleComplete={() => handleToggleSetCompleted(item.clientId)}
              />
            )}
            ListHeaderComponent={<WorkoutSetHeader />}
            ListFooterComponent={<WorkoutSetFooter onPress={handleAddSet} />}
            ListFooterComponentStyle={{
              borderTopWidth: 1,
              borderColor: colors.app.borderPrimary,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      {/* <WorkoutTimerBottomSheet /> */}
    </PageLayout>
  );
}

function WorkoutSetHeader() {
  return (
    <View className="flex-row items-center py-2">
      <View className="w-16 items-center">
        <ThemedText type="default" variant="accent">
          SET
        </ThemedText>
      </View>

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="accent">
          LOAD
        </ThemedText>
      </View>

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="accent">
          REPS
        </ThemedText>
      </View>

      <View className="w-16 items-center">
        <ThemedText type="default" variant="accent">
          DONE
        </ThemedText>
      </View>
    </View>
  );
}

function WorkoutSetCard({
  item,
  onDelete,
  onToggleComplete,
}: {
  item: WorkoutSessionExerciseModel["sets"][number];
  onDelete: () => void;
  onToggleComplete: () => void;
}) {
  const { colors } = useAppTheme();

  const isCompleted = !!item.completedAt;

  return (
    <Swipeable
      friction={1.5}
      rightThreshold={30}
      overshootRight={false}
      renderRightActions={() => <DeleteSetAction onPress={onDelete} />}
    >
      <View
        className="flex-row items-center py-4"
        style={{ backgroundColor: colors.app.cardPrimary }}
      >
        <View className="w-16 items-center">
          <ThemedText type="default" variant="primary">
            {item.setNumber}
          </ThemedText>
        </View>

        <View className="flex-1 items-center">
          <ThemedText type="default" variant="primary" className="text-center">
            {item.weight ?? "-"}
          </ThemedText>
        </View>

        <View className="flex-1 items-center">
          <ThemedText type="default" variant="primary" className="text-center">
            {item.reps ?? "-"}
          </ThemedText>
        </View>

        <View className="w-16 items-center">
          <CheckButton checked={isCompleted} onPress={onToggleComplete} />
        </View>
      </View>
    </Swipeable>
  );
}

function DeleteSetAction({ onPress }: { onPress: () => void }) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center px-6"
      style={{
        backgroundColor: colors.app.error,
      }}
    >
      <Trash2 size={16} color={colors.app.textWhite} strokeWidth={3} />
    </Pressable>
  );
}

function WorkoutSetFooter({ onPress }: { onPress: () => void }) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      className="flex-row items-center justify-center gap-2 py-2"
      onPress={onPress}
    >
      <Plus size={16} color={colors.app.brand} />

      <ThemedText type="default" variant="brand">
        Add Set
      </ThemedText>
    </TouchableOpacity>
  );
}

interface CheckButtonProps extends TouchableOpacityProps {
  checked: boolean;
}

function CheckButton({
  checked,
  style,
  disabled,
  onPress,
  ...props
}: CheckButtonProps) {
  const { colors } = useAppTheme();

  const baseStyle = {
    backgroundColor: checked ? colors.app.brand : colors.app.cardSecondary,
    borderColor: checked ? colors.app.brand : colors.app.borderPrimary,
  };

  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      activeOpacity={0.8}
      className="h-6 w-6 items-center justify-center rounded-md border"
      style={[baseStyle, { opacity: disabled ? 0.6 : 1 }, style]}
      disabled={disabled}
    >
      {checked ? (
        <Check size={14} color={colors.app.textWhite} strokeWidth={3} />
      ) : null}
    </TouchableOpacity>
  );
}
