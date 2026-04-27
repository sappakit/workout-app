import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useDefaultBottomSheetAnimation } from "@/hooks/useBottomSheetAnimation";
import { usePausableElapsedSeconds } from "@/hooks/usePausableElapsedSeconds";
import BottomSheet, {
  BottomSheetView,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import {
  AlarmClockMinus,
  AlarmClockPlus,
  CircleCheckBig,
  Pause,
  Play,
  SkipForward,
  Trash2,
} from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { formatDuration } from "../workout-in-progress/duration-picker/DurationPickerSheet";

type WorkoutTimerAction = {
  onPress: () => void;
  loading?: boolean;
};

type WorkoutTimerPauseAction = {
  onPress: () => void;
  isPaused: boolean;
};

type WorkoutTimerRestAction = {
  onSkip: () => void;
  onIncrease: (seconds?: number) => void;
  onDecrease: (seconds?: number) => void;
};

type WorkoutTimerBottomSheetProps = {
  startedAt: string | Date;
  remainingRestSeconds?: number;
  restAction: WorkoutTimerRestAction;
  finishAction: WorkoutTimerAction;
  discardAction: WorkoutTimerAction;
};

export default function WorkoutTimerBottomSheet({
  startedAt,
  remainingRestSeconds = 0,
  restAction,
  finishAction,
  discardAction,
}: WorkoutTimerBottomSheetProps) {
  const { colors } = useAppTheme();
  const animationConfigs = useDefaultBottomSheetAnimation();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [100, 180], []);

  const [activeIndex, setActiveIndex] = useState(0);

  const sessionTimer = usePausableElapsedSeconds(startedAt);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      // make content buttons clickable
      onAnimate={(_, toIndex) => {
        setActiveIndex(toIndex);
      }}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose={false}
      enableOverDrag
      animationConfigs={animationConfigs}
      animateOnMount
      detached={false}
      backgroundStyle={{
        backgroundColor: colors.app.cardPrimary,
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.app.borderSecondary,
      }}
    >
      <WorkoutTimerSheetContent
        sessionElapsedSeconds={sessionTimer.elapsedSeconds}
        remainingRestSeconds={remainingRestSeconds}
        activeIndex={activeIndex}
        restAction={restAction}
        finishAction={finishAction}
        discardAction={discardAction}
        pauseAction={{
          isPaused: sessionTimer.isPaused,
          onPress: sessionTimer.togglePause,
        }}
      />
    </BottomSheet>
  );
}

interface WorkoutTimerContentProps {
  sessionElapsedSeconds: number;
  remainingRestSeconds: number;
  activeIndex: number;
  restAction: WorkoutTimerRestAction;
  finishAction: WorkoutTimerAction;
  discardAction: WorkoutTimerAction;
  pauseAction: WorkoutTimerPauseAction;
}

function WorkoutTimerSheetContent({
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

type WorkoutTimerDisplayProps = {
  display: ReturnType<typeof getWorkoutTimerDisplay>;
  restAction: WorkoutTimerRestAction;
  finishAction: WorkoutTimerAction;
  discardAction: WorkoutTimerAction;
  pauseAction: WorkoutTimerPauseAction;
};

function CollapsedTimerContent({
  display,
  restAction,
  finishAction,
  discardAction,
  pauseAction,
}: WorkoutTimerDisplayProps) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <ThemedText type="default" variant="primary" className="text-sm">
          {display.timer.label}
        </ThemedText>
        <ThemedText type="default" variant="accent" className="text-lg">
          {display.timer.value}
        </ThemedText>
      </View>

      {/* Buttons */}
      <View className="flex-row items-center justify-center">
        {display.isResting ? (
          <>
            <AppButton
              icon={AlarmClockMinus}
              variant="ghost"
              iconSize={20}
              className="p-4"
              onPress={() => restAction.onDecrease()}
            />

            <AppButton
              variant="primary"
              icon={SkipForward}
              iconSize={20}
              className="h-14 w-14 border-0"
              onPress={restAction.onSkip}
            />

            <AppButton
              icon={AlarmClockPlus}
              variant="ghost"
              iconSize={20}
              className="p-4"
              onPress={() => restAction.onIncrease()}
            />
          </>
        ) : (
          <>
            <AppButton
              variant="ghost"
              icon={CircleCheckBig}
              iconSize={20}
              iconColor={colors.app.brand}
              className="p-4"
              onPress={finishAction.onPress}
              loading={finishAction.loading}
            />

            <AppButton
              variant="secondary"
              icon={pauseAction.isPaused ? Play : Pause}
              iconSize={20}
              className="h-14 w-14 border-0"
              onPress={pauseAction.onPress}
            />

            <AppButton
              variant="ghost"
              icon={Trash2}
              iconSize={20}
              className="p-4"
              onPress={discardAction.onPress}
              loading={discardAction.loading}
            />
          </>
        )}
      </View>

      <View className="flex-1 items-end">
        <ThemedText type="default" variant="primary" className="text-sm">
          {display.status.label}
        </ThemedText>

        <View className="flex-row items-center gap-2">
          <StatusDot status={display.status.value} size={10} />

          <ThemedText type="default" variant="accent" className="text-base">
            {display.status.labelValue}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

function ExpandedTimerContent({
  display,
  restAction,
  finishAction,
  discardAction,
  pauseAction,
}: WorkoutTimerDisplayProps) {
  return (
    <View className="gap-3">
      {/* Contents */}
      <View className="flex-row justify-between">
        <View className="flex-1 gap-1">
          <View>
            <ThemedText type="default" variant="primary" className="text-xs">
              {display.sets.label}
            </ThemedText>
            <ThemedText type="default" variant="accent" className="text-sm">
              {display.sets.value}
            </ThemedText>
          </View>

          <View>
            <ThemedText type="default" variant="primary" className="text-xs">
              {display.exercises.label}
            </ThemedText>
            <ThemedText type="default" variant="accent" className="text-sm">
              {display.exercises.value}
            </ThemedText>
          </View>
        </View>

        <View className="items-center justify-between">
          <ThemedText type="default" variant="primary">
            {display.timer.label}
          </ThemedText>

          <ThemedText
            type="default"
            variant="accent"
            className="text-5xl font-semibold"
          >
            {display.timer.value}
          </ThemedText>
        </View>

        <View className="flex-1 gap-1">
          <View className="items-end">
            <ThemedText type="default" variant="primary" className="text-xs">
              {display.volume.label}
            </ThemedText>
            <ThemedText type="default" variant="accent" className="text-sm">
              {display.volume.value}
            </ThemedText>
          </View>

          <View className="items-end">
            <ThemedText type="default" variant="primary" className="text-xs">
              {display.status.label}
            </ThemedText>

            <View className="flex-row items-center gap-2">
              <StatusDot status={display.status.value} />

              <ThemedText type="default" variant="accent" className="text-sm">
                {display.status.labelValue}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View className="flex-row items-center gap-2">
        {display.isResting ? (
          <>
            <AppButton
              title="- 15 sec"
              variant="secondary"
              // icon={AlarmClockMinus}
              className="flex-1"
              onPress={() => restAction.onDecrease()}
            />

            <AppButton
              title="Skip"
              variant="primary"
              icon={SkipForward}
              className="flex-[2]"
              onPress={restAction.onSkip}
            />

            <AppButton
              title="+ 15 sec"
              variant="secondary"
              // icon={AlarmClockPlus}
              className="flex-1"
              onPress={() => restAction.onIncrease()}
            />
          </>
        ) : (
          <>
            <AppButton
              title="Finish"
              variant="primary"
              icon={CircleCheckBig}
              className="flex-1"
              onPress={finishAction.onPress}
              loading={finishAction.loading}
            />

            <AppButton
              variant="tertiary"
              icon={pauseAction.isPaused ? Play : Pause}
              className="h-12 w-12"
              onPress={pauseAction.onPress}
            />

            <AppButton
              title="Discard"
              variant="secondary"
              icon={Trash2}
              className="flex-1"
              onPress={discardAction.onPress}
              loading={discardAction.loading}
            />
          </>
        )}
      </View>
    </View>
  );
}

function StatusDot({
  status,
  size = 8,
}: {
  status: SessionStatus;
  size?: number;
}) {
  const { colors } = useAppTheme();

  const backgroundColor =
    status === SessionStatus.PAUSED
      ? colors.app.textPrimary
      : status === SessionStatus.RESTING
        ? colors.app.warning
        : colors.app.success;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        backgroundColor,
      }}
    />
  );
}

const SessionStatus = {
  TRAINING: "training",
  RESTING: "resting",
  PAUSED: "paused",
} as const;

type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

const SessionStatusLabel = {
  [SessionStatus.TRAINING]: "Training",
  [SessionStatus.RESTING]: "Resting",
  [SessionStatus.PAUSED]: "Paused",
} satisfies Record<SessionStatus, string>;

function getWorkoutTimerDisplay({
  isResting,
  isPaused,
  displaySeconds,
}: {
  isResting: boolean;
  isPaused: boolean;
  displaySeconds: number;
}) {
  let status: SessionStatus;

  if (isPaused) {
    status = SessionStatus.PAUSED;
  } else if (isResting) {
    status = SessionStatus.RESTING;
  } else {
    status = SessionStatus.TRAINING;
  }

  return {
    isResting,
    isPaused,
    timer: {
      label: isResting ? "Next set in" : "Session time",
      value: formatDuration(displaySeconds),
    },
    sets: {
      label: "Sets",
      value: "2 / 12",
    },
    exercises: {
      label: "Exercises",
      value: "1 / 4",
    },
    volume: {
      label: "Volume",
      value: "20 kg",
    },
    status: {
      label: "Status",
      value: status,
      labelValue: SessionStatusLabel[status],
    },
  };
}
