import { useAppTheme } from "@/hooks/useAppTheme";
import { Dumbbell } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

export function StreakCard() {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-row items-center justify-between rounded-full border py-2 pl-2 pr-4"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.brand,
      }}
    >
      <View className="flex-row items-center">
        <View
          className="mr-3 items-center justify-center rounded-full border p-2"
          style={{
            backgroundColor: colors.app.cardSecondary,
            borderColor: colors.app.borderTertiary,
          }}
        >
          <Text className="text-[2rem]">🔥</Text>
        </View>
        <View>
          <ThemedText
            type="defaultSemiBold"
            variant="brand"
            className="text-lg"
          >
            <ThemedText
              type="defaultSemiBold"
              variant="brand"
              className="text-xl"
            >
              4-day
            </ThemedText>{" "}
            streak
          </ThemedText>

          <ThemedText type="default" className="text-xs">
            Keep the progress!
          </ThemedText>
        </View>
      </View>

      <WorkoutButton />
    </View>
  );
}

export function WorkoutButton() {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex-row items-center rounded-full border px-5 py-2"
      style={{
        backgroundColor: colors.app.brand,
        borderColor: colors.app.brandLight,
      }}
    >
      <Dumbbell size={18} color={colors.app.textWhite} />
      <ThemedText
        type="default"
        className="ml-2 text-xs font-bold"
        style={{ color: colors.app.textWhite }}
      >
        WORK OUT
      </ThemedText>
    </TouchableOpacity>
  );
}
