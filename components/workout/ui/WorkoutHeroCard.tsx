import {
  DropdownItem,
  MenuSectionLabel,
  OptionsMenu,
} from "@/components/options-menu/OptionsMenu";
import { ThemedText } from "@/components/themed-text";
import { FALLBACK_WORKOUT_IMAGE } from "@/constants/images";
import { hexWithOpacity } from "@/constants/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Repeat, Settings2 } from "lucide-react-native";
import React from "react";
import { ImageBackground, Pressable, StyleSheet, View } from "react-native";

export type WorkoutHeroCardItem = {
  id: number;
  title: string;
  exerciseCount: number;
  setCount: number;
  durationLabel: string;
  imageUrl: string | null;
};

interface WorkoutHeroCardProps {
  item: WorkoutHeroCardItem;
  onPress?: () => void;
  onEditPlan: () => void;
  onSwitchPlan: () => void;
  isDisabled?: boolean;
}

export function WorkoutHeroCard({
  item,
  onPress,
  onEditPlan,
  onSwitchPlan,
  isDisabled,
}: WorkoutHeroCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="overflow-hidden rounded-2xl"
    >
      <ImageBackground
        source={{ uri: item.imageUrl ?? FALLBACK_WORKOUT_IMAGE }}
        resizeMode="cover"
        className="h-60 justify-end overflow-hidden"
      >
        <LinearGradient
          colors={["transparent", hexWithOpacity(colors.app.black, 80)]}
          locations={[0.4, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Options menu */}
        <View className="absolute right-4 top-4 z-10">
          <WorkoutHeroCardMenu
            isDisabled={isDisabled}
            actions={{
              onEditPlan,
              onSwitchPlan,
            }}
          />
        </View>

        <View className="p-4">
          <ThemedText type="title" variant="white" className="text-2xl">
            {item.title}
          </ThemedText>

          <ThemedText type="small" variant="primary">
            {item.exerciseCount} exercises | {item.setCount} sets |{" "}
            {item.durationLabel}
          </ThemedText>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

type WorkoutHeroCardMenuProps = {
  actions: {
    onEditPlan: () => void;
    onSwitchPlan: () => void;
  };
  isDisabled?: boolean;
};

function WorkoutHeroCardMenu({
  isDisabled,
  actions,
}: WorkoutHeroCardMenuProps) {
  return (
    <OptionsMenu isDisabled={isDisabled}>
      <MenuSectionLabel label="Actions" />

      <DropdownItem
        label="Edit plan"
        icon={Settings2}
        onSelect={actions.onEditPlan}
      />

      <DropdownItem
        label="Switch plan"
        icon={Repeat}
        onSelect={actions.onSwitchPlan}
      />
    </OptionsMenu>
  );
}
