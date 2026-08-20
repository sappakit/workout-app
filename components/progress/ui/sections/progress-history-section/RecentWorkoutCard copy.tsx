import { AppButton } from "@/components/custom-ui/app-button";
import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { WORKOUT_IMAGE } from "@/constants/images";
import { useAppColors } from "@/hooks/useAppTheme";
import { FlatList, Image, Pressable, View } from "react-native";

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
      className="overflow-hidden rounded-2xl bg-card"
      onPress={item.action}
    >
      <View className="flex-row items-center gap-3 p-4 pb-2">
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

export function RecentMetricList({
  list,
  className = "p-2",
}: RecentMetricListProps) {
  return (
    <View className={className}>
      <View className="flex-row items-center justify-between  p-2">
        {/* {list.map((metric, index) => (
          <Fragment key={metric.label}>
            {index > 0 ? <Separator className="h-8" /> : null}

            <RecentMetric
              icon={metric.icon}
              label={metric.label}
              value={metric.value}
            />
          </Fragment>
        ))} */}

        <FlatList
          data={list}
          keyExtractor={(item) => item.label}
          numColumns={3}
          scrollEnabled={false}
          columnWrapperClassName="gap-2"
          contentContainerClassName="gap-2"
          renderItem={({ item }) => (
            <RecentMetric
              label={item.label}
              value={item.value}
              icon={item.icon}
            />
          )}
        />
      </View>
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
    <View className="flex-1 items-center justify-center gap-3 rounded-lg bg-secondary py-3">
      <AppIcon name={icon} size="lg" color={colors.primary} />

      <View className="items-center">
        <ThemedText type="bodyStrong" numberOfLines={1}>
          {value}
        </ThemedText>

        <ThemedText type="caption" tone="muted" numberOfLines={1}>
          {label}
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
