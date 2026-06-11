import { AppButton } from "@/components/custom-ui/AppButton";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ThemedText } from "@/components/themed-text";
import { WORKOUT_UNASSIGNED_IMAGE } from "@/constants/images";
import { hexWithOpacity } from "@/constants/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import { CalendarCog, CalendarPlus } from "lucide-react-native";
import { ImageBackground, StyleSheet, View } from "react-native";

export function UnassignedPlanSection() {
  const { colors } = useAppTheme();

  return (
    <View className="gap-3">
      <SectionHeader
        title="No Plan Assigned"
        subtitle="This weekday does not have a plan yet. Set a day plan, choose a workout, or build your own."
      />

      <View className="overflow-hidden rounded-3xl">
        <ImageBackground
          source={{ uri: WORKOUT_UNASSIGNED_IMAGE }}
          resizeMode="cover"
          className="h-60 justify-between overflow-hidden p-5"
        >
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: hexWithOpacity(colors.app.black, 35) },
            ]}
          />

          <LinearGradient
            colors={["transparent", hexWithOpacity(colors.app.black, 85)]}
            locations={[0.4, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          <View
            className="h-16 w-16 items-center justify-center rounded-2xl border"
            style={{
              borderColor: colors.app.white,
            }}
          >
            <CalendarPlus size={28} color={colors.app.white} />
          </View>

          <View className="gap-2">
            <ThemedText type="title" variant="white" className="text-2xl">
              Build your routine
            </ThemedText>

            <ThemedText
              type="small"
              style={{ color: colors.app.textWhiteMuted }}
            >
              Assign a workout to this weekday, pick one to train, or start
              freely with an empty workout.
            </ThemedText>
          </View>
        </ImageBackground>
      </View>

      <AppButton
        title="Assign weekday plan"
        icon={CalendarCog}
        variant="primary"
        //   onPress={onStartTodayPlan}
        //   loading={isStarting}
      />
    </View>
  );
}
