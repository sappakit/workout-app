import { workoutApi } from "@/app/api/workout.api";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { api } from "@/lib/api";
import { createClientId } from "@/lib/id/utils";
import { useInvalidateQueries } from "@/lib/query/utils";
import { useAppToast } from "@/lib/toast/useAppToast";
import { workoutQueryKeys } from "@/lib/workout/keys";
import {
  mapWorkoutSessionModelToFinishPayload,
  useWorkoutSessionStore,
} from "@/stores/workoutSessionStore";
import {
  WorkoutSessionExerciseModel,
  WorkoutSessionExerciseSetModel,
} from "@/types/workout/model/workout.types";
import { WorkoutSession } from "@/types/workout/response/workout.types";
import { useMutation } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import {
  BicepsFlexed,
  Check,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
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
import FormTextInput from "../form/FormTextInput";
import WorkoutTimerBottomSheet from "../workout/WorkoutTimerBottomSheet";
import { DurationBottomSheetPicker } from "./duration-picker/DurationPickerSheet";

type WorkoutInProgressContentProps = {
  session: WorkoutSession;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80";

export function WorkoutInProgressContent({
  session,
}: WorkoutInProgressContentProps) {
  const { colors } = useAppTheme();

  const toast = useAppToast();
  const invalidateQueries = useInvalidateQueries();
  const restTimer = useCountdownTimer();

  // Workout session store
  const hydrated = useWorkoutSessionStore((state) => state.hydrated);
  const storedSession = useWorkoutSessionStore((state) => state.session);
  const initializeSession = useWorkoutSessionStore(
    (state) => state.initializeSession,
  );

  const updateSession = useWorkoutSessionStore((state) => state.updateSession);
  const updateSessionExercise = useWorkoutSessionStore(
    (state) => state.updateSessionExercise,
  );
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
  const exerciseItems = storedSession?.sessionExercises ?? [];

  /* Mutation */
  // Cancel workout
  const cancelWorkoutMutation = useMutation({
    mutationFn: () => {
      if (!storedSession) throw new Error("No active session");

      return api.post(workoutApi.cancelSession(storedSession.id));
    },
    onSuccess: async () => {
      await invalidateQueries([workoutQueryKeys.current]);

      restTimer.stop();
      clearSession();

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

  // Finish workout
  const finishWorkoutSessionMutation = useMutation({
    mutationFn: async () => {
      if (!storedSession) throw new Error("No active session");

      const payload = mapWorkoutSessionModelToFinishPayload(storedSession);

      return api.patch(workoutApi.finishSession(storedSession.id), payload);
    },
    onSuccess: async () => {
      await invalidateQueries([workoutQueryKeys.current]);

      restTimer.stop();
      clearSession();

      toast.success({
        title: "Workout completed",
        message: "Your workout has been saved successfully.",
      });
    },
    onError: () => {
      toast.error({
        title: "Save failed",
        message: "Something went wrong while saving your session.",
      });
    },
  });

  /* Function */
  // Add set
  const handleAddSet = (exerciseClientId: string) => {
    updateSession((prev) => ({
      ...prev,
      sessionExercises: prev.sessionExercises.map((exercise) => {
        if (exercise.clientId !== exerciseClientId) return exercise;

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

        return syncSessionExerciseCompletion({
          ...exercise,
          sets: [...exercise.sets, newSet],
        });
      }),
    }));
  };

  // Delete set
  const handleDeleteSet = (exerciseClientId: string, setClientId: string) => {
    updateSession((prev) => ({
      ...prev,
      sessionExercises: prev.sessionExercises.map((exercise) => {
        if (exercise.clientId !== exerciseClientId) return exercise;

        const filteredSets = exercise.sets
          .filter((set) => set.clientId !== setClientId)
          .map((set, index) => ({
            ...set,
            setNumber: index + 1,
          }));

        return syncSessionExerciseCompletion({
          ...exercise,
          sets: filteredSets,
        });
      }),
    }));
  };

  // Complete set
  const handleToggleSetCompleted = (
    exerciseClientId: string,
    setClientId: string,
  ) => {
    const completedAt = new Date().toISOString();

    const targetExercise = storedSession?.sessionExercises.find(
      (exercise) => exercise.clientId === exerciseClientId,
    );

    const targetSet = targetExercise?.sets.find(
      (set) => set.clientId === setClientId,
    );

    const isCompleting = !targetSet?.completedAt;

    updateSessionExercise(exerciseClientId, (exercise) => {
      const updatedSets = exercise.sets.map((set) =>
        set.clientId === setClientId
          ? {
              ...set,
              completedAt: set.completedAt ? null : completedAt,
            }
          : set,
      );

      return syncSessionExerciseCompletion({
        ...exercise,
        sets: updatedSets,
      });
    });

    if (isCompleting) {
      restTimer.start(targetExercise?.plannedRestTime ?? 0);
    }
  };

  // Update set weight/reps
  const handleUpdateSetValue = (
    exerciseClientId: string,
    setClientId: string,
    field: "weight" | "reps",
    value: string,
  ) => {
    // TODO: non number charater cause NaN
    updateSessionSet(exerciseClientId, setClientId, (set) => ({
      ...set,
      [field]: value === "" ? null : Number(value),
    }));
  };

  // Update exercise rest time
  const handleUpdateExerciseRestTime = (
    exerciseClientId: string,
    value: number,
  ) => {
    updateSessionExercise(exerciseClientId, (exercise) => ({
      ...exercise,
      plannedRestTime: value,
    }));
  };

  // Update sessionExercise completedAt
  // when set changes (add/delete/completed)
  const syncSessionExerciseCompletion = (
    exercise: WorkoutSessionExerciseModel,
  ): WorkoutSessionExerciseModel => {
    const allSetsCompleted =
      exercise.sets.length > 0 &&
      exercise.sets.every((set) => !!set.completedAt);

    return {
      ...exercise,
      completedAt: allSetsCompleted
        ? (exercise.completedAt ?? new Date().toISOString())
        : null,
    };
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

  // finish workout session
  const handleFinishWorkoutSession = async () => {
    if (!storedSession) return;

    await finishWorkoutSessionMutation.mutateAsync();
  };

  // TODO: remove
  useEffect(() => {
    console.log(storedSession);
  }, [storedSession]);

  // TODO: add loading
  if (!isActiveSessionReady) {
    return null;
  }

  return (
    <>
      <PageLayout
        headerProps={{
          variant: "title",
          title: "Workout",
        }}
        // scrollable={false}
        containerStyle={{
          paddingHorizontal: 0,
          paddingTop: 0,
          paddingBottom: 200,
        }}
      >
        {/* Hero */}
        <ImageBackground
          source={{ uri: fallbackImage }}
          resizeMode="cover"
          style={{ height: 240 }}
        >
          <LinearGradient
            colors={["transparent", colors.app.background]}
            locations={[0.4, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          <View className="flex-1 items-center justify-end pb-4">
            <ThemedText type="default" variant="accent">
              {storedSession.workout.workoutFocusType.name}
            </ThemedText>

            <ThemedText
              type="default"
              variant="brand"
              className="mt-1 text-center text-4xl font-bold"
            >
              {storedSession.workout.name}
            </ThemedText>
          </View>
        </ImageBackground>

        {/* Progress */}
        <View className="flex-1 gap-4 px-4">
          {exerciseItems.map((exerciseItem) => (
            <WorkoutExerciseSection
              key={exerciseItem.clientId}
              exercise={exerciseItem}
              onAddSet={() => handleAddSet(exerciseItem.clientId)}
              onDeleteSet={(setClientId) =>
                handleDeleteSet(exerciseItem.clientId, setClientId)
              }
              onToggleSetCompleted={(setClientId) =>
                handleToggleSetCompleted(exerciseItem.clientId, setClientId)
              }
              onChangeSetValue={(setClientId, field, value) =>
                handleUpdateSetValue(
                  exerciseItem.clientId,
                  setClientId,
                  field,
                  value,
                )
              }
              onChangeRestTime={(value) =>
                handleUpdateExerciseRestTime(exerciseItem.clientId, value)
              }
            />
          ))}
        </View>
      </PageLayout>

      <WorkoutTimerBottomSheet
        startedAt={storedSession.startedAt ?? new Date()}
        remainingRestSeconds={restTimer.remainingSeconds}
        restAction={{
          onSkip: restTimer.stop,
          onIncrease: restTimer.increase,
          onDecrease: restTimer.decrease,
        }}
        finishAction={{
          onPress: handleFinishWorkoutSession,
          loading: finishWorkoutSessionMutation.isPending,
        }}
        discardAction={{
          onPress: handleCancelWorkout,
          loading: cancelWorkoutMutation.isPending,
        }}
      />
    </>
  );
}

interface WorkoutExerciseSectionProps {
  exercise: WorkoutSessionExerciseModel;
  onAddSet: () => void;
  onDeleteSet: (setClientId: string) => void;
  onToggleSetCompleted: (setClientId: string) => void;
  onChangeSetValue: (
    setClientId: string,
    field: "weight" | "reps",
    value: string,
  ) => void;
  onChangeRestTime: (value: number) => void;
  onPressMore?: () => void;
}

function WorkoutExerciseSection({
  exercise,
  onAddSet,
  onDeleteSet,
  onToggleSetCompleted,
  onChangeSetValue,
  onChangeRestTime,
  onPressMore,
}: WorkoutExerciseSectionProps) {
  const { colors } = useAppTheme();

  const [expanded, setExpanded] = useState(true);

  const ExpansionIcon = expanded ? ChevronUp : ChevronDown;

  return (
    <View
      className="rounded-2xl border"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      {/* Top section */}
      <View className="flex-row items-center gap-3 p-4">
        {/* Image */}
        <View
          className="h-14 w-14 items-center justify-center rounded-full"
          style={{
            backgroundColor: colors.app.brand + "20",
          }}
        >
          <BicepsFlexed size={28} color={colors.app.brand} />
        </View>

        {/* Title/subtitle */}
        <View>
          <ThemedText type="default" variant="accent" className="text-base">
            {exercise.exercise.name}
          </ThemedText>

          <ThemedText type="default" variant="primary" className="text-xs">
            {getExerciseProgressText(exercise)}
          </ThemedText>
        </View>

        {/* Button */}
        <View className="ml-auto flex-row items-center gap-3">
          <TouchableOpacity onPress={onPressMore}>
            <MoreVertical size={18} color={colors.app.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setExpanded((prev) => !prev)}>
            <ExpansionIcon size={24} color={colors.app.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content section */}
      {expanded && (
        <View>
          {exercise.sets.length > 0 && (
            <View className="px-4 pb-4">
              <DurationBottomSheetPicker
                title="Select Rest Timer"
                value={exercise.plannedRestTime ?? 0}
                onChange={onChangeRestTime}
              />
            </View>
          )}

          <FlatList
            data={exercise.sets}
            keyExtractor={(item) => item.clientId}
            scrollEnabled={false}
            renderItem={({ item: setItem }) => (
              <WorkoutSetCard
                item={setItem}
                onDelete={() => onDeleteSet(setItem.clientId)}
                onToggleComplete={() => onToggleSetCompleted(setItem.clientId)}
                onChangeWeight={(value) =>
                  onChangeSetValue(setItem.clientId, "weight", value)
                }
                onChangeReps={(value) =>
                  onChangeSetValue(setItem.clientId, "reps", value)
                }
              />
            )}
            ListEmptyComponent={
              <View className="items-center gap-1 pb-4">
                <ThemedText type="default" variant="secondary">
                  No sets yet
                </ThemedText>

                <ThemedText
                  type="default"
                  variant="primary"
                  className="text-xs"
                >
                  Tap "Add Set" to start tracking
                </ThemedText>
              </View>
            }
            ListHeaderComponent={
              exercise.sets.length > 0 ? <WorkoutSetHeader /> : null
            }
            ListFooterComponent={<WorkoutSetFooter onPress={onAddSet} />}
            ListFooterComponentStyle={{
              borderTopWidth: 1,
              borderColor: colors.app.borderPrimary,
            }}
          />
        </View>
      )}
    </View>
  );
}

function getExerciseProgressText(exercise: WorkoutSessionExerciseModel) {
  const completedCount = exercise.sets.filter(
    (set) => !!set.completedAt,
  ).length;
  const totalCount = exercise.sets.length;

  if (totalCount === 0) return "No sets yet";
  if (completedCount === totalCount)
    return `Completed • ${completedCount}/${totalCount} sets`;

  return `In progress • ${completedCount}/${totalCount} sets`;
}

function WorkoutSetHeader() {
  return (
    <View className="flex-row items-center gap-4 py-2">
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

interface WorkoutSetCardProps {
  item: WorkoutSessionExerciseModel["sets"][number];
  onDelete: () => void;
  onToggleComplete: () => void;
  onChangeWeight: (value: string) => void;
  onChangeReps: (value: string) => void;
}

function WorkoutSetCard({
  item,
  onDelete,
  onToggleComplete,
  onChangeWeight,
  onChangeReps,
}: WorkoutSetCardProps) {
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
        className="flex-row items-center gap-4 py-2"
        style={{ backgroundColor: colors.app.cardPrimary }}
      >
        <View className="w-16 items-center">
          <ThemedText type="default" variant="primary">
            {item.setNumber}
          </ThemedText>
        </View>

        <View className="flex-1">
          <FormTextInput
            value={item.weight?.toString() ?? ""}
            onChangeText={onChangeWeight}
            keyboardType="numeric"
            placeholder="-"
            inputClassName="text-center"
          />
        </View>

        <View className="flex-1">
          <FormTextInput
            value={item.reps?.toString() ?? ""}
            onChangeText={onChangeReps}
            keyboardType="numeric"
            placeholder="-"
            inputClassName="text-center"
          />
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
