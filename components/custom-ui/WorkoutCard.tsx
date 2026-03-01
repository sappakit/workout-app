import { useAppTheme } from "@/hooks/useAppTheme";
import { Workout } from "@/types/workout.types";
import { Clock, Dumbbell } from "lucide-react-native";
import { View } from "react-native";
import { ThemedText } from "../themed-text";
import Thumbnail from "./Thumbnail";

interface WorkoutCardProps {
  data: Workout;
}

export function WorkoutCard({ data }: WorkoutCardProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className="mb-4 overflow-hidden rounded-2xl border"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      <View className="flex-1 flex-row overflow-hidden p-2">
        <Thumbnail image={data.image} />

        <View className="ml-4" style={{ justifyContent: "flex-end" }}>
          <ThemedText type="default" variant="accent" className="text-xs">
            {data.subtitle}
          </ThemedText>

          <ThemedText
            type="default"
            variant="brand"
            className="text-xl font-medium"
          >
            {data.title}
          </ThemedText>

          <View className="mt-2 flex-row">
            <View className="flex-row items-center">
              <Dumbbell size={12} color={colors.app.brand} />
              <ThemedText
                type="default"
                variant="primary"
                className="ml-2 text-xs"
              >
                {data.sets}
              </ThemedText>
            </View>

            <View className="ml-4 flex-row items-center">
              <Clock size={12} color={colors.app.brand} />
              <ThemedText
                type="default"
                variant="primary"
                className="ml-2 text-xs"
              >
                {data.duration}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      <View
        className="absolute px-4 py-1"
        style={{
          backgroundColor: colors.app.brand,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          right: 16,
        }}
      >
        <ThemedText type="default" color="white" className="text-xs">
          {data.level}
        </ThemedText>
      </View>
    </View>
  );
}
