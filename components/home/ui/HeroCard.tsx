import heroImage from "@/assets/images/home-screen/hero_image.png";
import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Dumbbell } from "lucide-react-native";
import { Image, StyleSheet, View } from "react-native";

export function HeroCard({ onStartWorkout }: { onStartWorkout: () => void }) {
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
