import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ExerciseFieldKey } from "@/lib/workout/config";
import { useExerciseDisplayStore } from "@/stores/exerciseDisplayStore";
import { useWorkoutRestTimerStore } from "@/stores/workoutRestTimerStore";
import { useWorkoutSessionStore } from "@/stores/workoutSessionStore";
import {
  ExercisePerformanceSummary,
  WorkoutSession,
} from "@/types/workout/response/workout.types";
import { useRouter } from "expo-router";
import { Dumbbell, Layers, Plus, Weight } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import {
  getWorkoutTimerMetricDisplay,
  getWorkoutTimerStats,
  INITIAL_TIMER_STATS,
} from "../bottom-sheet/workout-timer/model/workoutTimerDisplay";
import { AppButton } from "../custom-ui/AppButton";
import { ExerciseListMenu } from "../edit-plan/ui/ExerciseListMenu";
import { InProgressWorkoutExerciseSection } from "../edit-plan/ui/WorkoutExerciseSection/InProgressWorkoutExerciseSection";
import { RecentMetricList } from "../progress/ui/sections/progress-history-section/RecentWorkoutCard";
import { DetailHeroImage } from "../workout-detail/ui/DetailHeroImage";
import {
  addSessionSet,
  commitInheritedSetValues,
  deleteSessionExercise,
  deleteSessionSet,
  syncSessionExerciseCompletion,
} from "./model/helpers";

type WorkoutInProgressContentProps = {
  session: WorkoutSession;
  performanceByExerciseId: Record<string, ExercisePerformanceSummary>;
};

export function WorkoutInProgressContent({
  session,
  performanceByExerciseId,
}: WorkoutInProgressContentProps) {
  const { colors } = useAppTheme();

  const router = useRouter();

  // Display full exercise details toggle
  const showFullExerciseDetails = useExerciseDisplayStore(
    (state) => state.showFullExerciseDetails,
  );
  const toggleShowFullExerciseDetails = useExerciseDisplayStore(
    (state) => state.toggleShowFullExerciseDetails,
  );

  // Workout rest timer store
  const startRestTimer = useWorkoutRestTimerStore(
    (state) => state.startRestTimer,
  );

  // Workout session store
  const hydrated = useWorkoutSessionStore((state) => state.hydrated);
  const storedSession = useWorkoutSessionStore((state) => state.session);
  const storedPerformanceByExerciseId = useWorkoutSessionStore(
    (state) => state.performanceByExerciseId,
  );
  const initializeSession = useWorkoutSessionStore(
    (state) => state.initializeSession,
  );
  const setPerformanceByExerciseId = useWorkoutSessionStore(
    (state) => state.setPerformanceByExerciseId,
  );
  const removePerformanceByExerciseId = useWorkoutSessionStore(
    (state) => state.removePerformanceByExerciseId,
  );
  const updateSession = useWorkoutSessionStore((state) => state.updateSession);
  const updateSessionExercise = useWorkoutSessionStore(
    (state) => state.updateSessionExercise,
  );
  const updateSessionSet = useWorkoutSessionStore(
    (state) => state.updateSessionSet,
  );

  // Initialize session state
  useEffect(() => {
    if (!hydrated) return;

    initializeSession(session);
    setPerformanceByExerciseId(performanceByExerciseId);
  }, [
    hydrated,
    session,
    performanceByExerciseId,
    initializeSession,
    setPerformanceByExerciseId,
  ]);

  // Ensure store is hydrated and contains the current session
  const isActiveSessionReady = hydrated && storedSession?.id === session.id;

  // Use storedSession as the single source of truth
  const [exerciseItems, setExerciseItems] = useState(
    storedSession?.sessionExercises ?? [],
  );

  // Refresh exercise list layout after session exercises change
  useEffect(() => {
    // Wait for the page to fully mount
    const frame = requestAnimationFrame(() => {
      setExerciseItems(storedSession?.sessionExercises ?? []);
    });

    return () => cancelAnimationFrame(frame);
  }, [storedSession?.sessionExercises]);

  // Stats for bottom sheet timer
  const timerStats = storedSession
    ? getWorkoutTimerStats(storedSession)
    : INITIAL_TIMER_STATS;

  // Stats for workout card
  const timerMetrics = getWorkoutTimerMetricDisplay(timerStats);

  const summaryMetricList = [
    {
      label: timerMetrics.exercises.label,
      value: timerMetrics.exercises.value,
      icon: Dumbbell,
    },
    {
      label: timerMetrics.sets.label,
      value: timerMetrics.sets.value,
      icon: Layers,
    },
    {
      label: timerMetrics.volume.label,
      value: timerMetrics.volume.value,
      icon: Weight,
    },
  ];

  /* Functions */
  // Add set
  const handleAddSet = (exerciseClientId: string) => {
    updateSession((prev) => addSessionSet(prev, exerciseClientId));
  };

  // Delete set
  const handleDeleteSet = (exerciseClientId: string, setClientId: string) => {
    updateSession((prev) =>
      deleteSessionSet(prev, exerciseClientId, setClientId),
    );
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
      const targetSetIndex = exercise.sets.findIndex(
        (set) => set.clientId === setClientId,
      );

      if (targetSetIndex === -1) {
        return exercise;
      }

      const updatedSets = exercise.sets.map((set, index) => {
        if (set.clientId !== setClientId) {
          return set;
        }

        // Unchecking DONE should only remove completedAt
        if (set.completedAt) {
          return {
            ...set,
            completedAt: null,
          };
        }

        // Checking DONE should commit inherited placeholder values
        return {
          ...commitInheritedSetValues({
            set,
            sets: exercise.sets,
            currentIndex: index,
            exercise,
          }),
          completedAt,
        };
      });

      return syncSessionExerciseCompletion({
        ...exercise,
        sets: updatedSets,
      });
    });

    if (isCompleting) {
      startRestTimer(targetExercise?.restTime ?? 0);
    }
  };

  // Update set value
  const handleUpdateSetValue = (
    exerciseClientId: string,
    setClientId: string,
    field: ExerciseFieldKey,
    value: number | null,
  ) => {
    updateSessionSet(exerciseClientId, setClientId, (set) => ({
      ...set,
      [field]: value,
    }));
  };

  // Update exercise rest time
  const handleUpdateExerciseRestTime = (
    exerciseClientId: string,
    value: number,
  ) => {
    updateSessionExercise(exerciseClientId, (exercise) => ({
      ...exercise,
      restTime: value,
    }));
  };

  // Manage mode
  const handleOpenManageMode = () => {
    router.push("/(modal)/workout/session/manage-session-exercises");
  };

  // Add exercise
  const handleAddExercise = () => {
    router.push("/(modal)/workout/session/add-session-exercise");
  };

  // Replace exercise
  const handleReplaceExercise = (exerciseClientId: string) => {
    router.push({
      pathname: "/(modal)/workout/session/add-session-exercise",
      params: {
        mode: "replace",
        exerciseClientId,
      },
    });
  };

  // Delete exercise
  const handleDeleteExercise = (exerciseClientId: string) => {
    Alert.alert(
      "Remove exercise?",
      "This exercise and all of its sets will be removed from this workout session.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const targetExercise = storedSession?.sessionExercises.find(
              (exercise) => exercise.clientId === exerciseClientId,
            );

            updateSession((prev) =>
              deleteSessionExercise(prev, exerciseClientId),
            );

            // remove exercise performance from session store
            if (targetExercise?.exercise.id != null) {
              removePerformanceByExerciseId(targetExercise.exercise.id);
            }
          },
        },
      ],
    );
  };

  // Remove all exercises
  const handleRemoveAllExercises = () => {
    if (exerciseItems.length === 0) return;

    Alert.alert(
      "Remove all exercises?",
      "This will remove all exercises and sets from this workout session.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove All",
          style: "destructive",
          onPress: () => {
            const removedExerciseIds = exerciseItems.map(
              (item) => item.exercise.id,
            );

            updateSession((prev) => ({
              ...prev,
              sessionExercises: [],
            }));

            removedExerciseIds.forEach((exerciseId) => {
              removePerformanceByExerciseId(exerciseId);
            });
          },
        },
      ],
    );
  };

  // TODO: add loading
  if (!isActiveSessionReady) {
    return null;
  }

  return (
    <PageLayout
      disableContentPadding
      headerProps={{
        variant: "title",
        title: "Workout",
      }}
      containerStyle={{
        paddingBottom: 200,
      }}
    >
      <DetailHeroImage imageUrl={storedSession?.workout?.imageUrl} />

      <View
        className="px-4"
        style={{
          marginTop: -76, // cardHeight / 2
        }}
      >
        <View
          className="overflow-hidden rounded-2xl"
          style={{ backgroundColor: colors.app.cardPrimary }}
        >
          <View
            className="relative items-center justify-center p-4"
            style={{ height: 80 }}
          >
            {storedSession?.workout?.workoutFocusType?.name && (
              <ThemedText type="small" variant="primary">
                {storedSession.workout.workoutFocusType.name}
              </ThemedText>
            )}

            <ThemedText type="title" variant="accent">
              {storedSession?.workout?.name ?? "Workout"}
            </ThemedText>

            <View className="absolute right-0 top-0 p-4">
              <ExerciseListMenu
                isDisabled={exerciseItems.length === 0}
                showFullExerciseDetails={showFullExerciseDetails}
                actions={{
                  toggleShowFullExerciseDetails,
                  handleOpenManageMode,
                  handleRemoveAllExercises,
                }}
              />
            </View>
          </View>

          <RecentMetricList list={summaryMetricList} />
        </View>
      </View>

      <View className="flex-1 gap-3 px-4 pt-3">
        {exerciseItems.length === 0 ? (
          <View
            className="items-center rounded-2xl p-6"
            style={{ backgroundColor: colors.app.cardPrimary }}
          >
            <View
              className="mb-3 h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: colors.app.cardSecondary }}
            >
              <Dumbbell size={24} color={colors.app.textAccent} />
            </View>

            <ThemedText type="default" variant="accent" className="text-center">
              No exercises yet
            </ThemedText>

            <ThemedText
              type="default"
              variant="primary"
              className="text-center"
            >
              Add your first exercise to start tracking.
            </ThemedText>
          </View>
        ) : (
          exerciseItems.map((exerciseItem) => (
            <InProgressWorkoutExerciseSection
              key={exerciseItem.clientId}
              exercise={exerciseItem}
              performanceSummary={
                storedPerformanceByExerciseId[String(exerciseItem.exercise.id)]
              }
              onAddSet={() => handleAddSet(exerciseItem.clientId)}
              onDeleteExercise={() =>
                handleDeleteExercise(exerciseItem.clientId)
              }
              onReplaceExercise={() =>
                handleReplaceExercise(exerciseItem.clientId)
              }
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
          ))
        )}

        <AppButton
          title="Add exercise"
          variant="primary"
          icon={Plus}
          onPress={handleAddExercise}
        />
      </View>
    </PageLayout>
  );
}
