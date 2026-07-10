import heroImage from "@/assets/images/home-screen/hero_image.png";
import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  WorkoutTodayOverview,
  WorkoutWeeklyPlanDayType,
} from "@/types/workout/response/workout.types";
import { LinearGradient } from "expo-linear-gradient";
import { Href, useRouter } from "expo-router";
import { ClipboardList, Dumbbell, LucideIcon } from "lucide-react-native";
import { Image, StyleSheet, View } from "react-native";

interface TodayWorkoutCardProps {
  todayOverview?: WorkoutTodayOverview;
}

export function TodayWorkoutCard({ todayOverview }: TodayWorkoutCardProps) {
  const { colors } = useAppTheme();
  const router = useRouter();

  const content = getTodayWorkoutCardContent(todayOverview);

  return (
    <View
      className="relative h-44 overflow-hidden rounded-3xl"
      style={{ backgroundColor: colors.app.brand }}
    >
      <LinearGradient
        colors={[colors.app.brandLight, colors.app.brand, colors.app.brandDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View className="flex-1 flex-row justify-between gap-4">
        <View className="flex-1 justify-between p-4">
          <View>
            <ThemedText type="title" variant="white" className="text-3xl">
              {content.title}
            </ThemedText>

            <ThemedText type="small" variant="white">
              {content.subtitle}
            </ThemedText>
          </View>

          <AppButton
            title={content.buttonTitle}
            variant="white"
            shape="pill"
            icon={content.icon}
            onPress={() => router.push(content.href)}
          />
        </View>

        <Image
          source={heroImage}
          resizeMode="contain"
          style={{
            width: "60%",
            height: 240,
            marginLeft: "-15%",
            marginRight: "-7.5%",
          }}
        />
      </View>
    </View>
  );
}

type TodayWorkoutCardContent = {
  title: string;
  subtitle: string;
  buttonTitle: string;
  icon: LucideIcon;
  href: Href;
};

function getTodayWorkoutCardContent(
  todayOverview?: WorkoutTodayOverview,
): TodayWorkoutCardContent {
  if (todayOverview?.hasCompletedWorkoutToday) {
    return {
      title: "Nice Work",
      subtitle: "One more step forward. See your latest progress.",
      buttonTitle: "View Summary",
      icon: ClipboardList,
      href: "/(tabs)/progress",
    };
  }

  if (todayOverview?.todayPlanType === WorkoutWeeklyPlanDayType.WORKOUT) {
    const workoutName = todayOverview.schedule?.workout?.name;

    return {
      title: "Time to Train",
      subtitle: workoutName
        ? `${workoutName} is on the schedule today.`
        : "Your workout is on the schedule today.",
      buttonTitle: "Let's Train",
      icon: Dumbbell,
      href: "/(tabs)/workout",
    };
  }

  if (todayOverview?.todayPlanType === WorkoutWeeklyPlanDayType.REST) {
    return {
      title: "Rest Day",
      subtitle: "Take it easy today, or choose a workout if you feel ready.",
      buttonTitle: "View Workouts",
      icon: Dumbbell,
      href: "/(tabs)/workout",
    };
  }

  return {
    title: "Get Moving",
    subtitle: "Start with any workout that feels right today.",
    buttonTitle: "Let's Train",
    icon: Dumbbell,
    href: "/(tabs)/workout",
  };
}
