import { BottomSheetView, useBottomSheet } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import type { LayoutChangeEvent } from "react-native";
import { Pressable, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  getWorkoutTimerDisplay,
  type WorkoutTimerAction,
  type WorkoutTimerPauseAction,
  type WorkoutTimerRestAction,
  type WorkoutTimerStats,
} from "../model/workoutTimerDisplay";
import {
  CollapsedTimerContent,
  ExpandedTimerContent,
} from "./WorkoutTimerContentVariants";

const WORKOUT_TIMER_SHEET_PADDING_TOP = 8;
const WORKOUT_TIMER_SHEET_PADDING_BOTTOM = 8;

export const WORKOUT_TIMER_SHEET_VERTICAL_PADDING =
  WORKOUT_TIMER_SHEET_PADDING_TOP + WORKOUT_TIMER_SHEET_PADDING_BOTTOM;

type WorkoutTimerContentProps = {
  sessionElapsedSeconds: number;
  remainingRestSeconds: number;
  stats: WorkoutTimerStats;
  restAction: WorkoutTimerRestAction;
  finishAction: WorkoutTimerAction;
  discardAction: WorkoutTimerAction;
  pauseAction: WorkoutTimerPauseAction;
  onCollapsedLayout?: (height: number) => void;
  onExpandedLayout?: (height: number) => void;
};

export function WorkoutTimerSheetContent({
  sessionElapsedSeconds,
  remainingRestSeconds,
  stats,
  restAction,
  finishAction,
  discardAction,
  pauseAction,
  onCollapsedLayout,
  onExpandedLayout,
}: WorkoutTimerContentProps) {
  const router = useRouter();
  const { animatedIndex } = useBottomSheet();

  const isResting = remainingRestSeconds > 0;

  const displaySeconds = isResting
    ? remainingRestSeconds
    : sessionElapsedSeconds;

  const display = getWorkoutTimerDisplay({
    isResting,
    isPaused: pauseAction.isPaused,
    displaySeconds,
    stats,
  });

  const collapsedAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 0.4, 1],
      [1, 0.4, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          animatedIndex.value,
          [0, 1],
          [0, -6],
          Extrapolation.CLAMP,
        ),
      },
    ],
    pointerEvents: animatedIndex.value < 0.5 ? "auto" : "none",
  }));

  const expandedAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 0.6, 1],
      [0, 0.3, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          animatedIndex.value,
          [0, 1],
          [8, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
    pointerEvents: animatedIndex.value >= 0.5 ? "auto" : "none",
  }));

  const handleCollapsedLayout = (event: LayoutChangeEvent) => {
    onCollapsedLayout?.(Math.ceil(event.nativeEvent.layout.height));
  };

  const handleExpandedLayout = (event: LayoutChangeEvent) => {
    onExpandedLayout?.(Math.ceil(event.nativeEvent.layout.height));
  };

  const handleOpenWorkoutPage = () => {
    router.navigate("/workout");
  };

  return (
    <BottomSheetView
      style={{
        paddingHorizontal: 16,
        paddingTop: WORKOUT_TIMER_SHEET_PADDING_TOP,
        paddingBottom: WORKOUT_TIMER_SHEET_PADDING_BOTTOM,
      }}
    >
      <View style={{ position: "relative" }}>
        <Animated.View
          onLayout={handleCollapsedLayout}
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
            },
            collapsedAnimatedStyle,
          ]}
        >
          <Pressable onPress={handleOpenWorkoutPage}>
            <CollapsedTimerContent
              display={display}
              restAction={restAction}
              finishAction={finishAction}
              discardAction={discardAction}
              pauseAction={pauseAction}
            />
          </Pressable>
        </Animated.View>

        <Animated.View
          onLayout={handleExpandedLayout}
          style={expandedAnimatedStyle}
        >
          <Pressable onPress={handleOpenWorkoutPage}>
            <ExpandedTimerContent
              display={display}
              restAction={restAction}
              finishAction={finishAction}
              discardAction={discardAction}
              pauseAction={pauseAction}
            />
          </Pressable>
        </Animated.View>
      </View>
    </BottomSheetView>
  );
}
