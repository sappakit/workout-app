import {
  DropdownItem,
  MenuSectionLabel,
  OptionsMenu,
} from "@/components/options-menu/OptionsMenu";
import { ThemedText } from "@/components/themed-text";
import { Repeat, Settings2 } from "lucide-react-native";
import React from "react";
import { ImageBackground, Pressable, View } from "react-native";

export type WorkoutHeroCardItem = {
  id: number;
  title: string;
  exerciseCount: number;
  setCount: number;
  durationLabel: string;
  imageUrl: string | null;
};

const FALLBACK_WORKOUT_IMAGE =
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop";

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
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="overflow-hidden rounded-2xl bg-neutral-900"
    >
      <ImageBackground
        source={{ uri: item.imageUrl ?? FALLBACK_WORKOUT_IMAGE }}
        resizeMode="cover"
        className="h-60 justify-end overflow-hidden"
      >
        <View className="absolute inset-0 bg-black/20" />

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

        <View
          className="p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
        >
          <ThemedText type="title" variant="white">
            {item.title}
          </ThemedText>

          <ThemedText type="small" variant="white" className="mt-1 opacity-80">
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
