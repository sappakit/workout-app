import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useWorkoutSessionStore } from "@/stores/workoutSessionStore";
import {
  WorkoutSession,
  WorkoutSessionExercise,
} from "@/types/workout/response/workout.types";
import { LinearGradient } from "expo-linear-gradient";
import {
  BicepsFlexed,
  Check,
  ChevronRight,
  Plus,
  Timer,
} from "lucide-react-native";
import { useEffect } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import SwipeableItem, {
  useSwipeableItemParams,
} from "react-native-swipeable-item";
import Thumbnail from "../custom-ui/Thumbnail";
import WorkoutTimerBottomSheet from "../workout/WorkoutTimerBottomSheet";

type WorkoutInProgressContentProps = {
  session: WorkoutSession;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80";

export function WorkoutInProgressContent({
  session,
}: WorkoutInProgressContentProps) {
  const { colors } = useAppTheme();

  // Workout session store
  const hydrated = useWorkoutSessionStore((state) => state.hydrated);
  const storedSession = useWorkoutSessionStore((state) => state.session);
  const initializeSession = useWorkoutSessionStore(
    (state) => state.initializeSession,
  );

  // Initialize session state
  useEffect(() => {
    if (!hydrated) return;

    initializeSession(session);
  }, [hydrated, session, initializeSession]);

  // If store already contains session for this workout, use it instead
  const activeSession =
    hydrated && storedSession?.id === session.id ? storedSession : session;

  const currentExercise = activeSession.sessionExercises.find(
    (exercise) => !exercise.isSkipped && !exercise.completedAt,
  );

  const baseSetItems = buildWorkoutSetItems(currentExercise);

  // const currentExerciseIndex = currentExercise
  //   ? session.sessionExercises.indexOf(currentExercise) + 1
  //   : session.sessionExercises.length;

  // const totalExercises = session.sessionExercises.length;

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
            {activeSession.workoutSchedule.workout.name}
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

      {/* Progress */}
      <View className="mt-6 gap-4 px-4">
        {/* <View className="flex-row items-center justify-between">
          <ThemedText type="default" variant="accent">
            In progress ...
          </ThemedText>

          <ThemedText type="default" variant="primary">
            <ThemedText type="defaultSemiBold" variant="primary">
              Exercise {currentExerciseIndex}
            </ThemedText>{" "}
            of {totalExercises}
          </ThemedText>
        </View> */}

        <View
          className="rounded-2xl border"
          style={{
            backgroundColor: colors.app.cardPrimary,
            borderColor: colors.app.borderPrimary,
          }}
        >
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
            </View>

            <TouchableOpacity className="flex-row items-center gap-1">
              <Timer size={20} color={colors.app.brand} />

              <ThemedText type="default" variant="brand">
                1 min rest
              </ThemedText>
            </TouchableOpacity>
          </View>

          <FlatList
            data={baseSetItems}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <SwipeableWorkoutSetRow item={item} onDelete={() => {}} />
            )}
            ListHeaderComponent={<WorkoutSetHeader />}
            ListFooterComponent={<WorkoutSetFooter />}
            ListFooterComponentStyle={{
              borderTopWidth: 1,
              borderColor: colors.app.borderPrimary,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      <WorkoutTimerBottomSheet />
    </PageLayout>
  );
}

function buildWorkoutSetItems(
  currentExercise?: WorkoutSessionExercise,
): WorkoutSetItem[] {
  if (!currentExercise) return [];

  const plannedSets = currentExercise.plannedSets ?? 0;

  return Array.from({ length: plannedSets }, (_, index) => ({
    id: index + 1,
    label: `Set ${index + 1}`,
    reps: currentExercise.plannedRepsRange ?? "-",
    completed: false,
    active: index === 0,
  }));
}

function WorkoutSetHeader() {
  return (
    <View className="flex-row items-center justify-between py-2">
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

type WorkoutSetItem = {
  id: number;
  label: string;
  reps: string;
  completed?: boolean;
  active?: boolean;
};

function WorkoutSetCard({ item }: { item: WorkoutSetItem }) {
  const { colors } = useAppTheme();

  const isCompleted = !!item.completed;
  const isActive = !!item.active;

  return (
    <View
      className="flex-row items-center justify-between py-4"
      style={{
        backgroundColor: isActive
          ? colors.app.brand + 10
          : colors.app.cardPrimary,
      }}
    >
      <View className="w-16 items-center">
        <ThemedText type="default" variant="primary">
          {item.id}
        </ThemedText>
      </View>

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="primary" className="text-center">
          -
        </ThemedText>
      </View>

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="primary" className="text-center">
          {item.reps}
        </ThemedText>
      </View>

      <View className="w-16 items-center">
        <CircleCheckButton checked={isCompleted} />
      </View>
    </View>
  );
}

function SwipeableWorkoutSetRow({
  item,
  onDelete,
}: {
  item: WorkoutSetItem;
  onDelete: (id: number) => void;
}) {
  return (
    <SwipeableItem
      item={item}
      renderUnderlayLeft={() => (
        <DeleteUnderlay item={item} onDelete={onDelete} />
      )}
      snapPointsLeft={[96]}
      activationThreshold={12}
    >
      <WorkoutSetCard item={item} />
    </SwipeableItem>
  );
}

function DeleteUnderlay({
  item,
  onDelete,
}: {
  item: WorkoutSetItem;
  onDelete: (id: number) => void;
}) {
  const { colors } = useAppTheme();
  const { close } = useSwipeableItemParams<WorkoutSetItem>();

  return (
    <Pressable
      onPress={() => {
        onDelete(item.id);
        close();
      }}
      className="flex-1 items-end justify-center px-5"
      style={{ backgroundColor: colors.app.error }}
    >
      <ThemedText type="default" style={{ color: colors.app.textWhite }}>
        Delete
      </ThemedText>
    </Pressable>
  );
}

function WorkoutSetFooter() {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity className="flex-row items-center justify-center gap-2 py-2">
      <Plus size={16} color={colors.app.brand} />

      <ThemedText type="default" variant="brand">
        Add Set
      </ThemedText>
    </TouchableOpacity>
  );
}

interface CircleCheckButtonProps extends TouchableOpacityProps {
  checked: boolean;
}

function CircleCheckButton({
  checked,
  style,
  disabled,
  onPress,
  ...props
}: CircleCheckButtonProps) {
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
