import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppColors";
import { FlatList, View } from "react-native";
import { WorkoutImageAvatar } from "../sections/progress-history-section/RecentWorkoutCard";

export interface ProgressMetricCardListItem {
  label: string;
  value: string;
  icon: AppIconName;
}

export interface ProgressMetricCardItem {
  id: number | string;
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  list: ProgressMetricCardListItem[];
}

interface ProgressMetricCardProps {
  item: ProgressMetricCardItem;
  columns?: number;
}

export function ProgressMetricCard({
  item,
  columns = 3,
}: ProgressMetricCardProps) {
  return (
    <View className="gap-3 overflow-hidden rounded-2xl bg-card p-3">
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
      </View>

      <ProgressMetricList list={item.list} columns={columns} />
    </View>
  );
}

function ProgressMetricList({
  list,
  columns,
}: {
  list: ProgressMetricCardItem["list"];
  columns: number;
}) {
  return (
    <FlatList
      data={list}
      keyExtractor={(item) => item.label}
      numColumns={columns}
      scrollEnabled={false}
      columnWrapperClassName="gap-2"
      contentContainerClassName="gap-2"
      renderItem={({ item }) => (
        <MiniMetric label={item.label} value={item.value} icon={item.icon} />
      )}
    />
  );
}

function MiniMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: AppIconName;
}) {
  const colors = useAppColors();

  return (
    <View className="flex-1 flex-row items-center gap-3 rounded-lg bg-secondary p-3">
      <AppIcon name={icon} size="md" color={colors.primary} />

      <View className="flex-row items-center justify-between gap-2">
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
