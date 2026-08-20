import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppTheme";
import { View } from "react-native";
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
}

export function ProgressMetricCard({ item }: ProgressMetricCardProps) {
  return (
    <View className="overflow-hidden rounded-2xl bg-card">
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
      </View>

      <View className="gap-2 p-4 pt-2">
        {item.list.map((metric) => (
          <MetricRow
            key={metric.label}
            label={metric.label}
            value={metric.value}
            icon={metric.icon}
          />
        ))}
      </View>
    </View>
  );
}

function MetricRow({
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
    <View className="flex-row items-center gap-2 rounded-xl bg-secondary px-4 py-3">
      <AppIcon name={icon} size="md" color={colors.primary} />

      <View className="flex-1 flex-row items-center justify-between">
        <ThemedText type="body" tone="muted" numberOfLines={1}>
          {label}
        </ThemedText>

        <ThemedText type="bodyStrong" numberOfLines={1}>
          {value}
        </ThemedText>
      </View>
    </View>
  );
}
