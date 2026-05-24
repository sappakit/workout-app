import heroImage from "@/assets/images/home-screen/hero_image.png";
import { AppButton } from "@/components/custom-ui/AppButton";
import { Separator } from "@/components/custom-ui/Separator";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowUpRight,
  BarChart3,
  ChartBar,
  Clock,
  Dumbbell,
  Heart,
  LucideIcon,
  Timer,
} from "lucide-react-native";
import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

const workoutImage1 =
  "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1200&q=80";

const workoutImage2 =
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80";

const recentWorkoutImage =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80";

const weeklyVolume = [
  { label: "M", value: 45 },
  { label: "T", value: 75 },
  { label: "W", value: 0 },
  { label: "T", value: 105 },
  { label: "F", value: 78 },
  { label: "S", value: 0 },
  { label: "S", value: 0 },
];

const categories = ["All", "Full body", "Chests", "Shoulders", "Arms"];

const popularWorkouts = [
  {
    id: "1",
    title: "Full body - day 1",
    subtitle: "6 exercises | 1 hr 30 min",
    imageUrl: workoutImage1,
    tags: ["Popular", "Beginner"],
  },
  {
    id: "2",
    title: "Full body - day 2",
    subtitle: "5 exercises | 1 hr 10 min",
    imageUrl: workoutImage2,
    tags: ["Popular", "Beginner"],
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const handleStartWorkout = () => {
    router.push("/(tabs)/workout");
  };

  return (
    <PageLayout
      headerProps={{ variant: "home" }}
      // pullToRefresh={{ refreshing: isFetching, onRefresh: handleRefresh }}
    >
      <View className="gap-4">
        <HeroCard onStartWorkout={handleStartWorkout} />

        <View className="flex-row gap-3">
          <VolumeStatCard />

          <View className="flex-1 gap-3">
            <SimpleStatCard icon={Dumbbell} label="Workouts" value="20" />

            <SimpleStatCard icon={Timer} label="Time" value="240m" />
          </View>
        </View>

        <View>
          <View className="mb-3">
            <SectionHeader title="Popular now" />
          </View>

          <CategoryFilter />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingTop: 12 }}
          >
            {popularWorkouts.map((workout) => (
              <PopularWorkoutCard key={workout.id} workout={workout} />
            ))}
          </ScrollView>
        </View>

        <View>
          <View className="mb-3">
            <SectionHeader title="Recent workout" />
          </View>

          <RecentWorkoutCard />
        </View>
      </View>
    </PageLayout>
  );
}

function HeroCard({ onStartWorkout }: { onStartWorkout: () => void }) {
  const { colors } = useAppTheme();

  return (
    <View
      className="relative overflow-hidden rounded-3xl"
      style={{ backgroundColor: colors.app.brand }}
    >
      <LinearGradient
        colors={[colors.app.brandLight, colors.app.brand, colors.app.brandDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <Image
        source={heroImage}
        resizeMode="contain"
        style={{
          position: "absolute",
          right: "-25%",
          bottom: "-65%",
          width: "100%",
          height: 240,
        }}
      />

      <View className="justify-between gap-4 p-4">
        <View>
          <ThemedText type="title" variant="white" className="text-3xl">
            Keep it up!
          </ThemedText>

          <ThemedText type="small" variant="white">
            You've completed 4 workouts{"\n"}this week.
          </ThemedText>
        </View>

        <View className="w-48">
          <AppButton
            title="Let's Train Today"
            variant="white"
            shape="pill"
            icon={Dumbbell}
            onPress={onStartWorkout}
          />
        </View>
      </View>
    </View>
  );
}

function StatIcon({ icon: Icon }: { icon: LucideIcon }) {
  const { colors } = useAppTheme();

  return (
    <View
      className="h-11 w-11 items-center justify-center overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.app.brand }}
    >
      <LinearGradient
        colors={[colors.app.brandLight, colors.app.brand, colors.app.brandDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View>
        <Icon size={20} color={colors.app.textWhite} />
      </View>
    </View>
  );
}

function StatValue({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <ThemedText type="extraSmall" variant="primary">
        {label}
      </ThemedText>
      <ThemedText type="subtitle" variant="accent">
        {value}
      </ThemedText>
    </View>
  );
}

function VolumeStatCard() {
  const { colors } = useAppTheme();

  const maxValue = Math.max(...weeklyVolume.map((item) => item.value));

  return (
    <View
      className="flex-1 justify-between rounded-2xl p-4"
      style={{ backgroundColor: colors.app.cardPrimary }}
    >
      <View className="flex-row items-center gap-3">
        <StatIcon icon={ChartBar} />

        <StatValue label="Volume" value="1,200 kg" />
      </View>

      <View className="flex-row items-end justify-between">
        {weeklyVolume.map((item) => {
          const height = Math.max(6, (item.value / maxValue) * 36);

          return (
            <View key={item.label} className="items-center gap-2">
              <View
                className="w-5 rounded-md"
                style={{
                  height,
                  backgroundColor: colors.app.brand,
                }}
              />

              <ThemedText type="small" variant="primary">
                {item.label}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

type SimpleStatCardProps = {
  icon: typeof Dumbbell;
  label: string;
  value: string;
};

function SimpleStatCard({ icon: Icon, label, value }: SimpleStatCardProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className="rounded-2xl p-4"
      style={{ backgroundColor: colors.app.cardPrimary }}
    >
      <View className="flex-row items-center gap-3">
        <StatIcon icon={Icon} />

        <View className="flex-1">
          <StatValue label={label} value={value} />
        </View>
      </View>
    </View>
  );
}

function CategoryFilter() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {categories.map((category) => {
        const isActive = category === "Full body";

        return (
          <AppButton
            key={category}
            className="h-8 px-6"
            title={category}
            variant={isActive ? "primary" : "secondary"}
            shape="pill"
            // icon={Dumbbell}
            // onPress={onStartWorkout}
          />
        );
      })}
    </ScrollView>
  );
}

type PopularWorkoutCardProps = {
  workout: {
    title: string;
    subtitle: string;
    imageUrl: string;
    tags: string[];
  };
};

function PopularWorkoutCard({ workout }: PopularWorkoutCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      className="overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.app.cardPrimary, width: 240 }}
    >
      <View className="relative h-32">
        <Image
          source={{ uri: workout.imageUrl }}
          className="h-full w-full"
          resizeMode="cover"
        />

        <View className="absolute right-0 top-0 p-3">
          <AppButton
            variant="white"
            icon={Heart}
            className="h-9 w-9"
            shape="pill"
          />
        </View>
      </View>

      <View className="gap-2 p-3">
        <View>
          <ThemedText type="subtitle" variant="accent">
            {workout.title}
          </ThemedText>

          <ThemedText type="small" variant="primary">
            {workout.subtitle}
          </ThemedText>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            {workout.tags.map((tag) => (
              <View
                key={tag}
                className="rounded-full px-4 py-1"
                style={{ backgroundColor: colors.app.cardSecondary }}
              >
                <ThemedText type="extraSmall" variant="primary">
                  {tag}
                </ThemedText>
              </View>
            ))}
          </View>

          <AppButton
            variant="primary"
            icon={ArrowUpRight}
            className="h-9 w-9"
            shape="pill"
          />
        </View>
      </View>
    </Pressable>
  );
}

function RecentWorkoutCard() {
  const { colors } = useAppTheme();

  return (
    <Pressable
      className="overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.app.cardPrimaryDark }}
    >
      <View
        className="flex-row items-center gap-3 p-4"
        style={{ backgroundColor: colors.app.cardPrimary }}
      >
        <View className="h-14 w-14 overflow-hidden rounded-full">
          <Image
            source={{ uri: recentWorkoutImage }}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>

        <View className="flex-1">
          <ThemedText type="subtitle" variant="accent">
            Push workout
          </ThemedText>

          <ThemedText type="extraSmall" variant="primary">
            May 17, 2026 5:32 pm
          </ThemedText>
        </View>

        <AppButton
          variant="tertiary"
          icon={ArrowUpRight}
          className="h-9 w-9 self-start"
          shape="pill"
        />
      </View>

      <View className="flex-row items-center justify-between p-4">
        <RecentMetric icon={BarChart3} label="Sets" value="20" />

        <Separator className="h-8" />

        <RecentMetric icon={Dumbbell} label="Volume" value="12.00 kg" />

        <Separator className="h-8" />

        <RecentMetric icon={Clock} label="Duration" value="58 min" />
      </View>
    </Pressable>
  );
}

type RecentMetricProps = {
  icon: typeof Dumbbell;
  label: string;
  value: string;
};

function RecentMetric({ icon: Icon, label, value }: RecentMetricProps) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-row items-center gap-4">
      <Icon size={24} color={colors.app.brand} />

      <View>
        <ThemedText type="extraSmall" variant="primary">
          {label}
        </ThemedText>
        <ThemedText type="default" variant="accent">
          {value}
        </ThemedText>
      </View>
    </View>
  );
}
