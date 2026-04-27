import { useAppTheme } from "@/hooks/useAppTheme";
import { useDefaultBottomSheetAnimation } from "@/hooks/useBottomSheetAnimation";
import { usePausableElapsedSeconds } from "@/hooks/usePausableElapsedSeconds";
import BottomSheet from "@gorhom/bottom-sheet";
import { useMemo, useRef, useState } from "react";
import {
  WorkoutTimerAction,
  WorkoutTimerPauseAction,
  WorkoutTimerRestAction,
  WorkoutTimerStats,
} from "./model/workoutTimerDisplay";
import { WorkoutTimerSheetContent } from "./ui/WorkoutTimerSheetContent";

type WorkoutTimerBottomSheetProps = {
  startedAt: string | Date;
  remainingRestSeconds?: number;
  stats: WorkoutTimerStats;
  restAction: WorkoutTimerRestAction;
  finishAction: WorkoutTimerAction;
  discardAction: WorkoutTimerAction;
};

export default function WorkoutTimerBottomSheet({
  startedAt,
  remainingRestSeconds = 0,
  stats,
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

  const pauseAction: WorkoutTimerPauseAction = {
    isPaused: sessionTimer.isPaused,
    onPress: sessionTimer.togglePause,
  };

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
        stats={stats}
        restAction={restAction}
        finishAction={finishAction}
        discardAction={discardAction}
        pauseAction={pauseAction}
      />
    </BottomSheet>
  );
}
