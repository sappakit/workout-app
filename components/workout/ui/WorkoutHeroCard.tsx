import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import {
  DropdownItem,
  MenuSectionLabel,
  OptionsMenu,
} from "@/components/options-menu/OptionsMenu";
import { WORKOUT_IMAGE } from "@/constants/images";
import { useAppColors } from "@/hooks/useAppTheme";
import { hexWithOpacity } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, Pressable, StyleSheet, View } from "react-native";
import type { WorkoutCardItem } from "./workout-card/WorkoutCard";

export type WorkoutHeroStatusIcon = "scheduled" | "completed";

interface WorkoutHeroCardProps {
  item: WorkoutCardItem;
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
  const colors = useAppColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="overflow-hidden rounded-3xl"
    >
      <ImageBackground
        source={{
          uri: item.imageUrl ?? WORKOUT_IMAGE,
        }}
        resizeMode="cover"
        className="h-56 justify-between overflow-hidden p-5"
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

        <View className="z-10 flex-row justify-between">
          {statusIcon ? <WorkoutHeroStatus icon={statusIcon} /> : <View />}

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
          <View>
            {item.subtitle ? (
              <ThemedText type="small" className="text-white opacity-80">
                {item.subtitle}
              </ThemedText>
            ) : null}

            <ThemedText type="title" className="text-white">
              {item.title}
            </ThemedText>
          </View>

          {item.metaItems && item.metaItems.length > 0 ? (
            <View className="flex-row flex-wrap items-center gap-3">
              {item.metaItems.map((metaItem) => (
                <WorkoutHeroMetaItem
                  key={String(metaItem.key)}
                  icon={metaItem.icon}
                  label={metaItem.label}
                />
              ))}
            </View>
          ) : null}
        </View>
      </ImageBackground>
    </Pressable>
  );
}

type WorkoutHeroStatusProps = {
  icon: WorkoutHeroStatusIcon;
};

function WorkoutHeroStatus({ icon }: WorkoutHeroStatusProps) {
  const colors = useAppColors();

  const iconName: AppIconName =
    icon === "completed" ? "calendar-completed" : "calendar-scheduled";

  return (
    <View
      className="h-16 w-16 items-center justify-center rounded-2xl border"
      style={{
        backgroundColor: hexWithOpacity(colors.imageOverlayStrong, 35),
        borderColor: hexWithOpacity(colors.primaryForeground, 35),
      }}
    >
      <AppIcon name={iconName} size="xl" color={colors.primaryForeground} />
    </View>
  );
}

type WorkoutHeroMetaItemProps = {
  icon?: AppIconName;
  label: string;
};

function WorkoutHeroMetaItem({ icon, label }: WorkoutHeroMetaItemProps) {
  const colors = useAppColors();

  return (
    <View className="flex-row items-center gap-1.5">
      {icon ? <AppIcon name={icon} size="xs" color={colors.primary} /> : null}

      <ThemedText type="small" className="text-white opacity-80">
        {label}
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
        icon="settings"
        onSelect={actions.onEditPlan}
      />

      <DropdownItem
        label="Switch workout"
        icon="switch"
        onSelect={actions.onSwitchPlan}
      />

      <DropdownItem
        label="Edit weekly plan"
        icon="weekly-plan"
        onSelect={actions.onWeeklyPlan}
      />
    </OptionsMenu>
  );
}
