import { AppButton } from "@/components/custom-ui/app-button";
import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { Separator } from "@/components/custom-ui/Separator";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { WORKOUT_IMAGE } from "@/constants/images";
import { useAppColors } from "@/hooks/useAppTheme";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import { Image, Pressable, View } from "react-native";

interface ListItem {
  label: string;
  value: string;
  icon: AppIconName;
}

export interface RecentWorkoutCardItem {
  id: number | string;
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  list: ListItem[];
  action: () => void;
}

interface RecentWorkoutCardProps {
  item: RecentWorkoutCardItem;
}

export function RecentWorkoutCard({ item }: RecentWorkoutCardProps) {
  return (
    <Pressable
      className="gap-3 overflow-hidden rounded-3xl bg-card p-3"
      onPress={item.action}
    >
      <View className="flex-row items-center gap-3">
        <WorkoutImageAvatar imageUrl={item.imageUrl} />

        <View className="flex-1">
          <ThemedText type="bodyStrong" numberOfLines={1}>
            {item.title}
          </ThemedText>

          <ThemedText type="caption" tone="muted" numberOfLines={1}>
            {item.subtitle}
          </ThemedText>
        </View>

        <AppButton
          variant="contrast"
          size="icon"
          className="h-9 w-9 self-start rounded-full"
          icon={{
            name: "open",
            size: "md",
          }}
          onPress={item.action}
        />
      </View>

      <RecentMetricList list={item.list} />
    </Pressable>
  );
}

type RecentMetricListProps = {
  list: ListItem[];
  className?: string;
};

export function RecentMetricList({ list, className }: RecentMetricListProps) {
  return (
    <View
      className={cn(
        "flex-row items-center gap-3 rounded-lg bg-secondary p-3",
        className,
      )}
    >
      {list.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 ? <Separator className="h-8" /> : null}

          <RecentMetric
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        </Fragment>
      ))}
    </View>
  );
}

type RecentMetricProps = {
  icon: AppIconName;
  label: string;
  value: string;
};

function RecentMetric({ icon, label, value }: RecentMetricProps) {
  const colors = useAppColors();

  return (
    <View className="flex-1 flex-row items-center justify-center gap-3">
      <AppIcon name={icon} size="lg" color={colors.primary} />

      <View>
        <ThemedText type="caption" tone="muted" numberOfLines={1}>
          {label}
        </ThemedText>

        <ThemedText type="bodyStrong" numberOfLines={1}>
          {value}
        </ThemedText>
      </View>
    </View>
  );
}

type WorkoutImageAvatarProps = {
  imageUrl?: string | null;
};

export function WorkoutImageAvatar({ imageUrl }: WorkoutImageAvatarProps) {
  return (
    <View className="h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-secondary">
      <Image
        source={{
          uri: imageUrl ?? WORKOUT_IMAGE,
        }}
        className="h-full w-full"
        resizeMode="cover"
      />
    </View>
  );
}
