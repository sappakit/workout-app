import { AppButton } from "@/components/custom-ui/app-button";
import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { useAppColors } from "@/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, StyleSheet, View } from "react-native";

type WorkoutDayStateSectionProps = {
  sectionTitle: string;
  sectionSubtitle: string;

  imageUrl: string;
  icon: AppIconName;
  title: string;
  description: string;

  actionTitle: string;
  actionIcon?: AppIconName;
  onAction: () => void;
};

export function WorkoutDayStateSection({
  sectionTitle,
  sectionSubtitle,
  imageUrl,
  icon,
  title,
  description,
  actionTitle,
  actionIcon = "calendar",
  onAction,
}: WorkoutDayStateSectionProps) {
  const colors = useAppColors();

  return (
    <View className="gap-3">
      <SectionHeader title={sectionTitle} subtitle={sectionSubtitle} />

      <View className="overflow-hidden rounded-3xl">
        <ImageBackground
          source={{ uri: imageUrl }}
          resizeMode="cover"
          className="h-60 justify-between overflow-hidden p-5"
        >
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: colors.imageOverlay,
              },
            ]}
          />

          <LinearGradient
            colors={["transparent", colors.imageOverlayStrong]}
            locations={[0.4, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          <View className="h-16 w-16 items-center justify-center rounded-2xl border border-white">
            <AppIcon name={icon} size="xl" color="#FFFFFF" />
          </View>

          <View className="gap-2">
            <ThemedText type="title" className="text-white">
              {title}
            </ThemedText>

            <ThemedText type="small" className="text-white opacity-80">
              {description}
            </ThemedText>
          </View>
        </ImageBackground>
      </View>

      <AppButton
        title={actionTitle}
        variant="primary"
        icon={{
          name: actionIcon,
          size: "sm",
        }}
        onPress={onAction}
      />
    </View>
  );
}
