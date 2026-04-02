import { Separator } from "@/components/custom-ui/Separator";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import WorkoutTimerBottomSheet from "@/components/workout/WorkoutTimerBottomSheet";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Check } from "lucide-react-native";
import { FlatList, ImageBackground, StyleSheet, View } from "react-native";

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
    // { id: 5, label: "Set 4", reps: "6 reps" },
    // { id: 6, label: "Set 4", reps: "6 reps" },
    // { id: 7, label: "Set 4", reps: "6 reps" },
    // { id: 8, label: "Set 4", reps: "6 reps" },
    // { id: 9, label: "Set 4", reps: "6 reps" },
    // { id: 10, label: "Set 4", reps: "6 reps" },
    // { id: 11, label: "Set 4", reps: "6 reps" },
    // { id: 12, label: "Set 4", reps: "6 reps" },
  ] satisfies WorkoutSetItem[],
};

function WorkoutSetHeader() {
  return (
    <View className="flex-row items-center justify-between px-2">
      <View className="w-12 items-center">
        <ThemedText type="default" variant="secondary">
          DONE
        </ThemedText>
      </View>

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="secondary">
          SET
        </ThemedText>
      </View>

      <View className="w-[1px]" />

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="secondary">
          PREVIOUS
        </ThemedText>
      </View>

      <View className="w-[1px]" />

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="secondary">
          LOAD
        </ThemedText>
      </View>

      <View className="w-[1px]" />

      <View className="flex-1 items-center">
        <ThemedText type="default" variant="secondary">
          REPS
        </ThemedText>
      </View>
    </View>
  );
}

function WorkoutSetCard({ item }: { item: WorkoutSetItem }) {
  const { colors } = useAppTheme();

  const isCompleted = !!item.completed;
  const isActive = !!item.active;

  return (
    <View
      style={{
        backgroundColor: colors.app.cardSecondary,
        borderColor: isActive ? colors.app.brand : "transparent",
      }}
      className="flex-row items-center justify-between rounded-2xl border px-2 py-4"
    >
      {/* CHECK */}
      <View className="w-12 items-center">
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
      </View>

      {/* SET */}
      <View className="flex-1 items-center">
        <ThemedText type="default" variant="primary">
          {item.id}
        </ThemedText>
      </View>

      <Separator className="h-6" />

      {/* PREVIOUS */}
      <View className="flex-1 items-center">
        <ThemedText type="default" variant="primary">
          -
        </ThemedText>
      </View>

      <Separator className="h-6" />

      {/* LOAD */}
      <View className="flex-1 items-center">
        <ThemedText type="default" variant="primary" className="text-center">
          7.5
        </ThemedText>
      </View>

      <Separator className="h-6" />

      {/* REPS */}
      <View className="flex-1 items-center">
        <ThemedText type="default" variant="primary" className="text-center">
          12
        </ThemedText>
      </View>
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
      <View className="mt-6 flex-1 gap-4 px-4">
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

        <WorkoutSetHeader />

        <FlatList
          data={mockWorkout.sets}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <WorkoutSetCard item={item} />}
          style={{ flex: 1 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <WorkoutTimerBottomSheet />
    </PageLayout>
  );
}
