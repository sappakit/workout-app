import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LucideIcon } from "lucide-react-native";
import React from "react";
import { FlatList, View } from "react-native";
import { WorkoutImageAvatar } from "../sections/progress-history-section/RecentWorkoutCard";

export interface ProgressMetricCardListItem {
  label: string;
  value: string;
  icon: LucideIcon;
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
  const { colors } = useAppTheme();

  return (
    <View
      className="overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.app.cardPrimary }}
    >
      <View className="flex-1 flex-row items-center gap-3 p-4">
        <WorkoutImageAvatar imageUrl={item.imageUrl} />

        <View className="flex-1">
          <ThemedText type="subtitle" variant="accent" numberOfLines={1}>
            {item.title}
          </ThemedText>

          <ThemedText type="extraSmall" variant="primary" numberOfLines={1}>
            {item.subtitle}
          </ThemedText>
        </View>
      </View>

      <View
        className="p-4"
        style={{ backgroundColor: colors.app.cardPrimaryDark }}
      >
        <ProgressMetricList list={item.list} columns={columns} />
      </View>
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
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-1 flex-row items-center gap-3 rounded-xl p-2"
      style={{ backgroundColor: colors.app.cardSecondary }}
    >
      <View
        className="rounded-xl p-3"
        style={{ backgroundColor: colors.app.cardPrimary }}
      >
        <Icon size={18} color={colors.app.brand} />
      </View>

      <View className="flex-1">
        <ThemedText type="extraSmall" variant="primary" numberOfLines={1}>
          {label}
        </ThemedText>

        <ThemedText type="default" variant="accent" numberOfLines={1}>
          {value}
        </ThemedText>
      </View>
    </View>
  );
}
