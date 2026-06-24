import { AppButton } from "@/components/custom-ui/AppButton";
import { Separator } from "@/components/custom-ui/Separator";
import { ThemedText } from "@/components/themed-text";
import { WorkoutMetaPill } from "@/components/workout/ui/WorkoutCard";
import { FALLBACK_WORKOUT_IMAGE } from "@/constants/images";
import { hexWithOpacity } from "@/constants/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { WorkoutWeeklyPlanDayType } from "@/types/workout/response/workout.types";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { CircleDashed, Clock, Dumbbell, Moon } from "lucide-react-native";
import { ImageBackground, Pressable, StyleSheet, View } from "react-native";
import {
  formatWorkoutDuration,
  WeeklyPlanDay,
} from "../model/weekly-plan.mapper";

interface SelectedWeeklyPlanDayCardProps {
  day: WeeklyPlanDay;
  disabled?: boolean;
  onChooseWorkout: () => void;
  onSetRestDay: () => void;
  onClearDay: () => void;
}

export function SelectedWeeklyPlanDayCard({
  day,
  disabled,
  onChooseWorkout,
  onSetRestDay,
  onClearDay,
}: SelectedWeeklyPlanDayCardProps) {
  const router = useRouter();
  const { colors } = useAppTheme();

  const isWorkoutDay = day.dayType === WorkoutWeeklyPlanDayType.WORKOUT;
  const isRestDay = day.dayType === WorkoutWeeklyPlanDayType.REST;
  const hasWorkout = isWorkoutDay && !!day.workout;

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
    if (!hasWorkout || !day.workout || disabled) return;

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
      className="flex-row p-5"
      style={({ pressed }) => ({
        opacity: pressed && hasWorkout ? 0.85 : 1,
      })}
    >
      <View className="flex-1">
        <ThemedText
          type="default"
          variant={hasWorkout ? "white" : "primary"}
          style={hasWorkout ? { color: colors.app.textWhiteMuted } : undefined}
        >
          {day.label}
        </ThemedText>

        <ThemedText type="subtitle" variant={hasWorkout ? "white" : "accent"}>
          {title}
        </ThemedText>

        <ThemedText
          type="small"
          variant={hasWorkout ? "white" : "primary"}
          style={hasWorkout ? { color: colors.app.textWhiteMuted } : undefined}
        >
          {subtitle}
        </ThemedText>

        {isWorkoutDay && day.workout ? (
          <View className="mt-2 flex-row flex-wrap gap-2">
            <WorkoutMetaPill
              icon={Dumbbell}
              label={`${day.workout.workoutExercises.length} exercises`}
            />

            {durationLabel ? (
              <WorkoutMetaPill icon={Clock} label={durationLabel} />
            ) : null}
          </View>
        ) : null}
      </View>
    </Pressable>
  );

  return (
    <View
      className="overflow-hidden rounded-3xl"
      style={{
        backgroundColor: colors.app.cardPrimary,
      }}
    >
      {hasWorkout ? (
        <ImageBackground
          source={{ uri: day.workout?.imageUrl ?? FALLBACK_WORKOUT_IMAGE }}
          resizeMode="cover"
        >
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: hexWithOpacity(colors.app.black, 40) },
            ]}
          />

          <LinearGradient
            colors={["transparent", hexWithOpacity(colors.app.black, 80)]}
            locations={[0.25, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          {topContent}
        </ImageBackground>
      ) : (
        topContent
      )}

      <View
        className="flex-row items-center justify-between p-2"
        style={{ backgroundColor: colors.app.cardPrimaryDark }}
      >
        <AppButton
          title={isWorkoutDay ? "Change" : "Choose"}
          icon={Dumbbell}
          iconColor={colors.app.brand}
          variant="ghost"
          className="h-12 flex-1"
          textStyle={{ color: colors.app.brand }}
          disabled={disabled}
          onPress={onChooseWorkout}
        />

        <Separator className="h-6" />

        <AppButton
          title="Rest"
          icon={Moon}
          iconColor={colors.app.textAccent}
          variant="ghost"
          className="h-12 flex-1"
          textStyle={{ color: colors.app.textAccent }}
          disabled={disabled}
          onPress={onSetRestDay}
        />

        <Separator className="h-6" />

        <AppButton
          title="Clear"
          icon={CircleDashed}
          variant="ghost"
          className="h-12 flex-1"
          disabled={disabled}
          onPress={onClearDay}
        />
      </View>
    </View>
  );
}
