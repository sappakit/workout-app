import { AppButton } from "@/components/custom-ui/app-button";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppColors";
import { Pressable, View } from "react-native";
import {
  SessionStatus,
  type WorkoutTimerDisplayProps,
} from "../model/workoutTimerDisplay";

export function CollapsedTimerContent({
  display,
  restAction,
  finishAction,
  discardAction,
  pauseAction,
}: WorkoutTimerDisplayProps) {
  const colors = useAppColors();

  return (
    <View className="flex-row items-center justify-between">
      <View className="min-w-0 flex-1">
        <ThemedText type="small" tone="muted">
          {display.timer.label}
        </ThemedText>

        <ThemedText type="heading">{display.timer.value}</ThemedText>
      </View>

      <View className="flex-row items-center justify-center gap-1">
        {display.isResting ? (
          <>
            <Pressable
              onPress={() => restAction.onDecrease()}
              hitSlop={8}
              className="h-11 w-11 items-center justify-center rounded-full active:opacity-80"
            >
              <AppIcon name="remove" size="lg" color={colors.mutedForeground} />
            </Pressable>

            <AppButton
              variant="primary"
              size="icon"
              className="h-14 w-14 rounded-full"
              icon={{
                name: "skip",
                size: "md",
              }}
              onPress={restAction.onSkip}
            />

            <Pressable
              onPress={() => restAction.onIncrease()}
              hitSlop={8}
              className="h-11 w-11 items-center justify-center rounded-full active:opacity-80"
            >
              <AppIcon name="add" size="lg" color={colors.mutedForeground} />
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              onPress={finishAction.onPress}
              disabled={finishAction.loading}
              hitSlop={8}
              className="h-11 w-11 items-center justify-center rounded-full active:opacity-80 disabled:opacity-50"
            >
              <AppIcon name="completed" size="lg" color={colors.primary} />
            </Pressable>

            <AppButton
              variant="secondary"
              size="icon"
              className="h-14 w-14 rounded-full"
              icon={{
                name: pauseAction.isPaused ? "play" : "pause",
                size: "lg",
              }}
              onPress={pauseAction.onPress}
            />

            <Pressable
              onPress={discardAction.onPress}
              disabled={discardAction.loading}
              hitSlop={8}
              className="h-11 w-11 items-center justify-center rounded-full active:opacity-80 disabled:opacity-50"
            >
              <AppIcon name="delete" size="lg" color={colors.mutedForeground} />
            </Pressable>
          </>
        )}
      </View>

      <View className="min-w-0 flex-1 items-end">
        <ThemedText type="small" tone="muted">
          {display.status.label}
        </ThemedText>

        <View className="flex-row items-center gap-2">
          <StatusDot status={display.status.value} size={10} />

          <ThemedText type="bodyStrong" numberOfLines={1}>
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
          <ThemedText type="small" tone="muted">
            {display.timer.label}
          </ThemedText>

          <ThemedText type="display" className="text-5xl leading-[56px]">
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
            <ThemedText type="caption" tone="muted">
              {display.status.label}
            </ThemedText>

            <View className="flex-row items-center gap-2">
              <StatusDot status={display.status.value} />

              <ThemedText type="label" numberOfLines={1}>
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
              className="flex-[2]"
              icon={{
                name: "skip",
                size: "sm",
              }}
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
              className="flex-1"
              icon={{
                name: "completed",
                size: "sm",
              }}
              onPress={finishAction.onPress}
              loading={finishAction.loading}
            />

            <AppButton
              variant="secondary"
              size="icon"
              icon={{
                name: pauseAction.isPaused ? "play" : "pause",
                size: "sm",
              }}
              onPress={pauseAction.onPress}
            />

            <AppButton
              title="Discard"
              variant="outline"
              className="flex-1"
              icon={{
                name: "delete",
                size: "sm",
              }}
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
};

function TimerStat({ label, value, align = "left" }: TimerStatProps) {
  return (
    <View className={align === "right" ? "items-end" : undefined}>
      <ThemedText type="caption" tone="muted">
        {label}
      </ThemedText>

      <ThemedText type="label">{value}</ThemedText>
    </View>
  );
}

type StatusDotProps = {
  status: SessionStatus;
  size?: number;
};

function StatusDot({ status, size = 8 }: StatusDotProps) {
  const colors = useAppColors();

  const backgroundColor =
    status === SessionStatus.PAUSED
      ? colors.mutedForeground
      : status === SessionStatus.RESTING
        ? colors.warning
        : colors.success;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
      }}
    />
  );
}
