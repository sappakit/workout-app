import { Separator } from "@/components/custom-ui/Separator";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useWorkoutSessionStore } from "@/stores/workoutSessionStore";
import {
  WorkoutSession,
  WorkoutSessionExercise,
} from "@/types/workout/response/workout.types";
import { LinearGradient } from "expo-linear-gradient";
import { Check, ChevronRight, Plus } from "lucide-react-native";
import { useEffect } from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { AppButton } from "../custom-ui/AppButton";
import Thumbnail from "../custom-ui/Thumbnail";
import WorkoutTimerBottomSheet from "../workout/WorkoutTimerBottomSheet";

type WorkoutInProgressContentProps = {
  session: WorkoutSession;
};

type WorkoutSetItem = {
  id: number;
  label: string;
  reps: string;
  completed?: boolean;
  active?: boolean;
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

        <WorkoutSetHeader />

        <FlatList
          data={baseSetItems}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <WorkoutSetCard item={item} />}
          // style={{ flex: 1 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          showsVerticalScrollIndicator={false}
        />

        <AppButton
          title="Add set"
          variant="primary"
          icon={Plus}
          textClassName="font-medium"
          // onPress={handleSubmit(onSubmit)}
          // loading={isPending}
        />
      </View>

      <WorkoutTimerBottomSheet />
    </PageLayout>
  );
}

function buildWorkoutSetItems(
  currentExercise?: WorkoutSessionExercise,
): WorkoutSetItem[] {
  if (!currentExercise) return [];

  console.log("currentExercise:", currentExercise);

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
    <View className="flex-row items-center justify-between px-2">
      <View className="w-12 items-center">
        <ThemedText type="default" variant="secondary">
          DONE
        </ThemedText>
      </View>

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="secondary">
          SET
        </ThemedText>
      </View>

      <View className="w-[1px]" />

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="secondary">
          PREVIOUS
        </ThemedText>
      </View>

      <View className="w-[1px]" />

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="secondary">
          LOAD
        </ThemedText>
      </View>

      <View className="w-[1px]" />

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="secondary">
          REPS
        </ThemedText>
      </View>
    </View>
  );
}

function WorkoutSetCard({ item }: { item: WorkoutSetItem }) {
  const { colors } = useAppTheme();

  const isCompleted = !!item.completed;
  const isActive = !!item.active;

  return (
    <View
      style={{
        backgroundColor: colors.app.cardSecondary,
        borderColor: isActive ? colors.app.brand : "transparent",
      }}
      className="flex-row items-center justify-between rounded-2xl border px-2 py-4"
    >
      <View className="w-12 items-center">
        <CircleCheckButton checked={isCompleted} />
      </View>

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="primary">
          {item.id}
        </ThemedText>
      </View>

      <Separator className="h-6" />

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="primary">
          -
        </ThemedText>
      </View>

      <Separator className="h-6" />

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="primary" className="text-center">
          -
        </ThemedText>
      </View>

      <Separator className="h-6" />

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="primary" className="text-center">
          {item.reps}
        </ThemedText>
      </View>
    </View>
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
    backgroundColor: checked ? colors.app.brand : colors.app.cardPrimary,
    borderColor: checked
      ? colors.app.borderPrimary
      : colors.app.borderSecondary,
  };

  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      activeOpacity={0.8}
      className="h-6 w-6 items-center justify-center rounded-full border"
      style={[baseStyle, { opacity: disabled ? 0.6 : 1 }, style]}
      disabled={disabled}
    >
      {checked ? (
        <Check size={14} color={colors.app.textWhite} strokeWidth={3} />
      ) : null}
    </TouchableOpacity>
  );
}
