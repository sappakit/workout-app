import {
  DropdownItem,
  MenuSectionLabel,
  OptionsMenu,
} from "@/components/options-menu/OptionsMenu";
import { ThemedText } from "@/components/themed-text";
import { WORKOUT_IMAGE } from "@/constants/images";
import { hexWithOpacity } from "@/constants/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import {
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  Dumbbell,
  Layers,
  LucideIcon,
  Repeat,
  Settings2,
  Timer,
} from "lucide-react-native";
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

export type WorkoutHeroStatusIcon = "scheduled" | "completed";

interface WorkoutHeroCardProps {
  item: WorkoutHeroCardItem;
  statusIcon?: WorkoutHeroStatusIcon;
  onPress?: () => void;
  onEditPlan: () => void;
  onSwitchPlan: () => void;
  onWeeklyPlan: () => void;
  isDisabled?: boolean;
}

export function WorkoutHeroCard({
  item,
  statusIcon,
  onPress,
  onEditPlan,
  onSwitchPlan,
  onWeeklyPlan,
  isDisabled,
}: WorkoutHeroCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="overflow-hidden rounded-3xl"
    >
      <ImageBackground
        source={{ uri: item.imageUrl ?? WORKOUT_IMAGE }}
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

        <View className="z-10 flex-row justify-between">
          {statusIcon ? <WorkoutHeroStatusIcon icon={statusIcon} /> : <View />}

          <WorkoutHeroCardMenu
            isDisabled={isDisabled}
            actions={{
              onEditPlan,
              onSwitchPlan,
              onWeeklyPlan,
            }}
          />
        </View>

        <View className="gap-2">
          <ThemedText type="title" variant="white" className="text-2xl">
            {item.title}
          </ThemedText>

          <View className="flex-row items-center gap-3">
            <WorkoutHeroMetaItem
              icon={Dumbbell}
              text={`${item.exerciseCount} exercises`}
            />

            <WorkoutHeroMetaItem icon={Layers} text={`${item.setCount} sets`} />

            <WorkoutHeroMetaItem icon={Timer} text={item.durationLabel} />
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

type WorkoutHeroStatusIconProps = {
  icon: WorkoutHeroStatusIcon;
};

function WorkoutHeroStatusIcon({ icon }: WorkoutHeroStatusIconProps) {
  const { colors } = useAppTheme();

  const Icon = icon === "completed" ? CalendarCheck : CalendarClock;

  return (
    <View
      className="h-16 w-16 items-center justify-center rounded-2xl border"
      style={{
        borderColor: colors.app.white,
        backgroundColor: hexWithOpacity(colors.app.black, 18),
      }}
    >
      <Icon size={28} color={colors.app.white} />
    </View>
  );
}

type WorkoutHeroMetaItemProps = {
  icon: LucideIcon;
  text: string;
};

function WorkoutHeroMetaItem({ icon: Icon, text }: WorkoutHeroMetaItemProps) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-row items-center gap-1.5">
      <Icon size={14} color={colors.app.brand} />

      <ThemedText type="small" style={{ color: colors.app.textWhiteMuted }}>
        {text}
      </ThemedText>
    </View>
  );
}

type WorkoutHeroCardMenuProps = {
  actions: {
    onEditPlan: () => void;
    onSwitchPlan: () => void;
    onWeeklyPlan: () => void;
  };
  isDisabled?: boolean;
};

export function WorkoutHeroCardMenu({
  isDisabled,
  actions,
}: WorkoutHeroCardMenuProps) {
  return (
    <OptionsMenu isDisabled={isDisabled}>
      <MenuSectionLabel label="Actions" />

      <DropdownItem
        label="Edit workout"
        icon={Settings2}
        onSelect={actions.onEditPlan}
      />

      <DropdownItem
        label="Switch workout"
        icon={Repeat}
        onSelect={actions.onSwitchPlan}
      />

      <DropdownItem
        label="Edit weekly plan"
        icon={CalendarDays}
        onSelect={actions.onWeeklyPlan}
      />
    </OptionsMenu>
  );
}
