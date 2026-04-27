import { BottomSheetView, useBottomSheet } from "@gorhom/bottom-sheet";
import { View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  getWorkoutTimerDisplay,
  WorkoutTimerAction,
  WorkoutTimerPauseAction,
  WorkoutTimerRestAction,
} from "../model/workoutTimerDisplay";
import {
  CollapsedTimerContent,
  ExpandedTimerContent,
} from "./WorkoutTimerContentVariants";

type WorkoutTimerContentProps = {
  sessionElapsedSeconds: number;
  remainingRestSeconds: number;
  activeIndex: number;
  restAction: WorkoutTimerRestAction;
  finishAction: WorkoutTimerAction;
  discardAction: WorkoutTimerAction;
  pauseAction: WorkoutTimerPauseAction;
};

export function WorkoutTimerSheetContent({
  sessionElapsedSeconds,
  remainingRestSeconds,
  activeIndex,
  restAction,
  finishAction,
  discardAction,
  pauseAction,
}: WorkoutTimerContentProps) {
  const { animatedIndex } = useBottomSheet();

  const isResting = remainingRestSeconds > 0;
  const displaySeconds = isResting
    ? remainingRestSeconds
    : sessionElapsedSeconds;

  const display = getWorkoutTimerDisplay({
    isResting,
    isPaused: pauseAction.isPaused,
    displaySeconds,
  });

  const collapsedAnimatedStyle = useAnimatedStyle(() => {
    return {
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
    };
  });

  const expandedAnimatedStyle = useAnimatedStyle(() => {
    return {
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
    };
  });

  return (
    <BottomSheetView
      style={{
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
      }}
    >
      <View style={{ position: "relative" }}>
        <Animated.View
          pointerEvents={activeIndex === 0 ? "auto" : "none"}
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
          <CollapsedTimerContent
            display={display}
            restAction={restAction}
            finishAction={finishAction}
            discardAction={discardAction}
            pauseAction={pauseAction}
          />
        </Animated.View>

        <Animated.View
          pointerEvents={activeIndex === 1 ? "auto" : "none"}
          style={expandedAnimatedStyle}
        >
          <ExpandedTimerContent
            display={display}
            restAction={restAction}
            finishAction={finishAction}
            discardAction={discardAction}
            pauseAction={pauseAction}
          />
        </Animated.View>
      </View>
    </BottomSheetView>
  );
}
