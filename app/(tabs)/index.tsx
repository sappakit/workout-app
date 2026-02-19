import MainButton from "@/components/custom-ui/MainButton";
import { StatsGrid } from "@/components/custom-ui/StatGrid";
import { StreakCard } from "@/components/custom-ui/StreakCard";
import { WeekCalendar } from "@/components/custom-ui/WeekCalendar";
import { WorkoutCard } from "@/components/custom-ui/WorkoutCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Workout } from "@/types/workout.types";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { View } from "react-native";

const data: Workout[] = [
  {
    id: 1,
    title: "Push-ups",
    subtitle: "Chest Workout",
    sets: "4 Sets",
    duration: "12 Minutes",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
  },
  {
    id: 2,
    title: "Dumbbell Fly",
    subtitle: "Chest Workout",
    sets: "3 Sets",
    duration: "6 Minutes",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
  },
  {
    id: 3,
    title: "Push-ups",
    subtitle: "Chest Workout",
    sets: "4 Sets",
    duration: "12 Minutes",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
  },
  {
    id: 4,
    title: "Dumbbell Fly",
    subtitle: "Chest Workout",
    sets: "3 Sets",
    duration: "6 Minutes",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
  },
  {
    id: 5,
    title: "Push-ups",
    subtitle: "Chest Workout",
    sets: "4 Sets",
    duration: "12 Minutes",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
  },
];

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { signOut, loading } = useAuth();

  return (
    <PageLayout>
      {/* TODO: remove */}
      <MainButton
        title="Log out"
        onPress={signOut}
        loading={loading}
        className="mb-4"
      />

      {/* Streak Card */}
      <StreakCard />
      {/* Stats */}
      <View className="mt-3">
        <SectionHeader title="Your stats" />

        <View className="mt-2">
          <StatsGrid />
        </View>
      </View>
      {/* Calendar */}
      <View className="mt-3">
        <WeekCalendar onDateChange={(d) => console.log("Selected:", d)} />

        <View className="mt-2 flex-row items-center justify-between">
          <ChevronLeft size={24} color={colors.app.textSecondary} />

          <ThemedText
            type="default"
            variant="primary"
            style={{ color: colors.app.textAccent }}
          >
            November 2025
          </ThemedText>

          <ChevronRight size={24} color={colors.app.textSecondary} />
        </View>
      </View>
      {/* Today Plan */}
      <View className="mt-3">
        <SectionHeader title="Today plan" />

        <View className="mt-2">
          {data.map((workout) => (
            <WorkoutCard key={workout.id} data={workout} />
          ))}
        </View>
      </View>
    </PageLayout>
  );
}
