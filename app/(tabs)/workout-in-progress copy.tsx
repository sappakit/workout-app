import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Check } from "lucide-react-native";
import { ImageBackground, StyleSheet, View } from "react-native";

type WorkoutSetItem = {
  id: number;
  label: string;
  reps: string;
  completed?: boolean;
  active?: boolean;
};

const mockWorkout = {
  title: "Dumbbell Fly",
  subtitle: "Chest Workout",
  tags: ["Chest", "Triceps"],
  image:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
  progressText: "In progress ...",
  progressRight: "Set 2 of 4",
  sets: [
    { id: 1, label: "Set 1", reps: "12 reps", completed: true },
    { id: 2, label: "Set 2", reps: "10 reps", active: true },
    { id: 3, label: "Set 3", reps: "8 reps" },
    { id: 4, label: "Set 4", reps: "6 reps" },
  ] satisfies WorkoutSetItem[],
};

function WorkoutSetCard({ item }: { item: WorkoutSetItem }) {
  const { colors } = useAppTheme();

  const isCompleted = !!item.completed;
  const isActive = !!item.active;

  return (
    <View
      style={{
        backgroundColor: colors.app.cardSecondary,
        borderWidth: 1,
        borderColor: isActive ? colors.app.brand : "transparent",
      }}
      className="flex-row items-center justify-between rounded-2xl px-4 py-4"
    >
      <View className="flex-row items-center gap-3">
        <View
          style={{
            backgroundColor: isCompleted
              ? colors.app.brand
              : colors.app.cardPrimary,
            borderColor: isCompleted
              ? colors.app.borderPrimary
              : colors.app.borderSecondary,
          }}
          className="h-6 w-6 items-center justify-center rounded-full border"
        >
          {isCompleted ? (
            <Check size={14} color={colors.app.textWhite} strokeWidth={3} />
          ) : null}
        </View>

        <ThemedText type="defaultSemiBold" variant="primary">
          {item.label}
        </ThemedText>
      </View>

      <ThemedText type="default" variant="secondary">
        {item.reps}
      </ThemedText>
    </View>
  );
}

export default function WorkoutInProgressScreen() {
  const { colors } = useAppTheme();

  return (
    <PageLayout
      headerProps={{
        variant: "title",
        title: "Workout",
        showBackButton: true,
      }}
      scrollable={false}
      containerStyle={{ paddingHorizontal: 0, paddingTop: 0 }}
    >
      {/* Hero */}
      <ImageBackground
        source={{ uri: mockWorkout.image }}
        resizeMode="cover"
        style={{ height: 240 }}
      >
        <LinearGradient
          colors={["transparent", colors.app.background]}
          locations={[0.4, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <View className="flex-1 items-center justify-end pb-4">
          <ThemedText type="default" variant="accent">
            {mockWorkout.subtitle}
          </ThemedText>

          <ThemedText
            type="default"
            variant="brand"
            className="mt-1 text-center text-4xl font-bold"
          >
            {mockWorkout.title}
          </ThemedText>
        </View>
      </ImageBackground>

      {/* Progress */}
      <View className="mt-6 gap-4 px-4">
        <View className="flex-row items-center justify-between">
          <ThemedText type="default" variant="accent">
            {mockWorkout.progressText}
          </ThemedText>

          <ThemedText type="default" variant="primary">
            <ThemedText type="defaultSemiBold" variant="primary">
              Set 2
            </ThemedText>{" "}
            of 4
          </ThemedText>
        </View>

        <View className="gap-3">
          {mockWorkout.sets.map((item) => (
            <WorkoutSetCard key={item.id} item={item} />
          ))}
        </View>
      </View>
    </PageLayout>
  );
}
