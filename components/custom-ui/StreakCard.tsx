import { useAppTheme } from "@/hooks/useAppTheme";
import { Dumbbell } from "lucide-react-native";
import { Text, View } from "react-native";
import { ThemedText } from "../themed-text";
import { AppButton } from "./AppButton";

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

      <AppButton
        title="WORK OUT"
        variant="primary"
        icon={Dumbbell}
        className="rounded-full px-5"
        textClassName="font-bold"
        // onPress={handleSubmit(onSubmit)}
        // loading={isPending}
      />
    </View>
  );
}
