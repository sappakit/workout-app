import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  AlarmClockMinus,
  AlarmClockPlus,
  CircleCheckBig,
  Pause,
  Play,
  SkipForward,
  Trash2,
} from "lucide-react-native";
import { View } from "react-native";
import {
  SessionStatus,
  WorkoutTimerDisplayProps,
} from "../model/workoutTimerDisplay";

export function CollapsedTimerContent({
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
              variant="tertiary"
              icon={pauseAction.isPaused ? Play : Pause}
              iconSize={20}
              shape="pill"
              className="h-14 w-14"
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

export function ExpandedTimerContent({
  display,
  restAction,
  finishAction,
  discardAction,
  pauseAction,
}: WorkoutTimerDisplayProps) {
  return (
    <View className="gap-3">
      <View className="flex-row justify-between">
        {/* Left */}
        <View className="flex-1 gap-1">
          <TimerStat label={display.sets.label} value={display.sets.value} />

          <TimerStat
            label={display.exercises.label}
            value={display.exercises.value}
          />
        </View>

        {/* Mid */}
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

        {/* Right */}
        <View className="flex-1 gap-1">
          <TimerStat
            label={display.volume.label}
            value={display.volume.value}
            align="right"
          />

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

      <View className="flex-row items-center gap-2">
        {display.isResting ? (
          <>
            <AppButton
              title="- 15 sec"
              variant="secondary"
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
              variant="outline"
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

type TimerStatProps = {
  label: string;
  value: string;
  align?: "left" | "right";
  labelClassName?: string;
  valueClassName?: string;
};

function TimerStat({
  label,
  value,
  align = "left",
  labelClassName = "text-xs",
  valueClassName = "text-sm",
}: TimerStatProps) {
  return (
    <View className={align === "right" ? "items-end" : undefined}>
      <ThemedText type="default" variant="primary" className={labelClassName}>
        {label}
      </ThemedText>

      <ThemedText type="default" variant="accent" className={valueClassName}>
        {value}
      </ThemedText>
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
