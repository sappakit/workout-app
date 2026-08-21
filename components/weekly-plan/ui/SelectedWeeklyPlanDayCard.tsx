import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { MetaPill } from "@/components/custom-ui/MetaPill";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { Separator } from "@/components/ui/separator";
import { formatWorkoutDuration } from "@/components/workout/model/workout-content.mapper";
import { formatExerciseCount } from "@/components/workout/ui/workout-card/WorkoutCard";
import { WORKOUT_IMAGE } from "@/constants/images";
import { useAppColors } from "@/hooks/useAppColors";
import { cn } from "@/lib/utils";
import { requireWorkoutExercises } from "@/lib/workout/utils/response-guards.utils";
import { WorkoutWeeklyPlanDayType } from "@/types/workout/response/workout.types";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import type { ColorValue } from "react-native";
import { ImageBackground, Pressable, StyleSheet, View } from "react-native";
import type { WeeklyPlanDay } from "../model/weekly-plan.mapper";

interface SelectedWeeklyPlanDayCardProps {
  day: WeeklyPlanDay;
  disabled?: boolean;
  onChooseWorkout: () => void;
  onSetRestDay: () => void;
  onClearDay: () => void;
}

export function SelectedWeeklyPlanDayCard({
  day,
  disabled = false,
  onChooseWorkout,
  onSetRestDay,
  onClearDay,
}: SelectedWeeklyPlanDayCardProps) {
  const router = useRouter();
  const colors = useAppColors();

  const isWorkoutDay = day.dayType === WorkoutWeeklyPlanDayType.WORKOUT;

  const isRestDay = day.dayType === WorkoutWeeklyPlanDayType.REST;

  const hasWorkout = isWorkoutDay && !!day.workout;

  const workoutExercises =
    hasWorkout && day.workout ? requireWorkoutExercises(day.workout) : null;

  const durationLabel = formatWorkoutDuration(day.workout?.duration ?? null);

  const title = isWorkoutDay
    ? (day.workout?.name ?? "Workout assigned")
    : isRestDay
      ? "Rest day"
      : "No workout assigned";

  const subtitle = isWorkoutDay
    ? (day.workout?.workoutFocusType?.name ??
      "This workout is assigned to this day.")
    : isRestDay
      ? "Recovery day. No workout scheduled."
      : "Choose a workout or mark this as a rest day.";

  const handleOpenWorkout = () => {
    if (!hasWorkout || !day.workout || disabled) {
      return;
    }

    router.push({
      pathname: "/(pages)/workout/[id]",
      params: {
        id: String(day.workout.id),
      },
    });
  };

  const topContent = (
    <Pressable
      disabled={!hasWorkout || disabled}
      onPress={handleOpenWorkout}
      className={cn("flex-row p-5 active:opacity-80", disabled && "opacity-50")}
    >
      <View className="min-w-0 flex-1">
        <ThemedText
          type="small"
          tone={hasWorkout ? "default" : "muted"}
          style={
            hasWorkout
              ? {
                  color: colors.primaryForeground,
                  opacity: 0.75,
                }
              : undefined
          }
        >
          {day.label}
        </ThemedText>

        <ThemedText
          type="heading"
          numberOfLines={1}
          style={
            hasWorkout
              ? {
                  color: colors.primaryForeground,
                }
              : undefined
          }
        >
          {title}
        </ThemedText>

        <ThemedText
          type="small"
          tone={hasWorkout ? "default" : "muted"}
          numberOfLines={2}
          style={
            hasWorkout
              ? {
                  color: colors.primaryForeground,
                  opacity: 0.75,
                }
              : undefined
          }
        >
          {subtitle}
        </ThemedText>

        {isWorkoutDay && day.workout && workoutExercises ? (
          <View className="mt-3 flex-row flex-wrap gap-2">
            <MetaPill
              variant="overlay"
              icon="exercise"
              label={formatExerciseCount(workoutExercises.length)}
            />

            {durationLabel ? (
              <MetaPill
                variant="overlay"
                icon="duration"
                label={durationLabel}
              />
            ) : null}
          </View>
        ) : null}
      </View>
    </Pressable>
  );

  return (
    <View className="overflow-hidden rounded-3xl bg-card">
      {hasWorkout ? (
        <ImageBackground
          source={{
            uri: day.workout?.imageUrl ?? WORKOUT_IMAGE,
          }}
          resizeMode="cover"
        >
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: colors.imageOverlay,
              },
            ]}
          />

          <LinearGradient
            colors={["transparent", colors.imageOverlayStrong]}
            locations={[0.25, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          {topContent}
        </ImageBackground>
      ) : (
        topContent
      )}

      <View className="flex-row items-center bg-secondary p-2">
        <WeeklyPlanActionButton
          title={isWorkoutDay ? "Change" : "Choose"}
          icon="workout"
          color={colors.primary}
          disabled={disabled}
          onPress={onChooseWorkout}
        />

        <Separator orientation="vertical" className="h-6" />

        <WeeklyPlanActionButton
          title="Rest"
          icon="recovery"
          color={colors.foreground}
          disabled={disabled}
          onPress={onSetRestDay}
        />

        <Separator orientation="vertical" className="h-6" />

        <WeeklyPlanActionButton
          title="Clear"
          icon="unassigned"
          color={colors.mutedForeground}
          disabled={disabled}
          onPress={onClearDay}
        />
      </View>
    </View>
  );
}

type WeeklyPlanActionButtonProps = {
  title: string;
  icon: AppIconName;
  color: ColorValue;
  disabled?: boolean;
  onPress: () => void;
};

function WeeklyPlanActionButton({
  title,
  icon,
  color,
  disabled = false,
  onPress,
}: WeeklyPlanActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        "h-12 flex-1 flex-row items-center justify-center gap-2 rounded-lg active:opacity-80",
        disabled && "opacity-50",
      )}
    >
      <AppIcon name={icon} variant="outline" size="sm" color={color} />

      <ThemedText type="label" style={{ color }}>
        {title}
      </ThemedText>
    </Pressable>
  );
}
