import { SectionHeader } from "@/components/layout/SectionHeader";
import { ThemedText } from "@/components/themed-text";
import { WORKOUT_REST_IMAGE } from "@/constants/images";
import { hexWithOpacity } from "@/constants/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import { BatteryCharging } from "lucide-react-native";
import { ImageBackground, StyleSheet, View } from "react-native";

export function RestDaySection() {
  const { colors } = useAppTheme();

  return (
    <View className="gap-3">
      <SectionHeader
        title="Rest Day"
        subtitle="No scheduled workout today. Recover, or choose a workout if you feel ready."
      />

      <View className="overflow-hidden rounded-3xl">
        <ImageBackground
          source={{ uri: WORKOUT_REST_IMAGE }}
          resizeMode="cover"
          className="h-60 justify-between overflow-hidden p-5"
        >
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: hexWithOpacity(colors.app.black, 30) },
            ]}
          />

          <LinearGradient
            colors={["transparent", hexWithOpacity(colors.app.black, 80)]}
            locations={[0.4, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          <View
            className="h-16 w-16 items-center justify-center rounded-2xl border"
            style={{
              borderColor: colors.app.white,
            }}
          >
            <BatteryCharging size={28} color={colors.app.white} />
          </View>

          <View className="gap-2">
            <ThemedText type="title" variant="white" className="text-2xl">
              Recharge, then rise
            </ThemedText>

            <ThemedText
              type="small"
              style={{ color: colors.app.textWhiteMuted }}
            >
              Recovery helps your body rebuild. Take it easy today, or move if
              your body feels good.
            </ThemedText>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}
