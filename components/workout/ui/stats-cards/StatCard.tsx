import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppColors";
import { cn } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

interface SimpleStatCardProps {
  icon: AppIconName;
  label: string;
  value: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function SimpleStatCard({
  icon,
  label,
  value,
  className,
  style,
}: SimpleStatCardProps) {
  return (
    <View className={cn("rounded-2xl bg-card p-4", className)} style={style}>
      <View className="flex-row items-center gap-3">
        <StatIcon icon={icon} />

        <View className="flex-1">
          <StatValue label={label} value={value} />
        </View>
      </View>
    </View>
  );
}

type VolumeStatTrendItem = {
  label: string;
  value: number;
};

interface VolumeStatCardProps {
  value: string;
  volumeTrend: VolumeStatTrendItem[];
  icon?: AppIconName;
  label?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  barMaxHeight?: number;
  barWidth?: number;
}

export function VolumeStatCard({
  value,
  volumeTrend,
  icon = "progress",
  label = "Volume",
  className,
  style,
  barMaxHeight = 36,
  barWidth = 20,
}: VolumeStatCardProps) {
  const colors = useAppColors();

  const maxValue = Math.max(...volumeTrend.map((item) => item.value), 0);

  return (
    <View
      className={cn(
        "justify-between gap-4 rounded-2xl bg-contrast p-4",
        className,
      )}
      style={style}
    >
      <View className="flex-row items-center gap-3">
        <StatIcon icon={icon} />

        <StatValue label={label} value={value} variant="contrast" />
      </View>

      <View className="flex-row items-end justify-between">
        {volumeTrend.map((item, index) => {
          const height =
            maxValue > 0
              ? Math.max(6, (item.value / maxValue) * barMaxHeight)
              : 6;

          return (
            <View key={`${item.label}-${index}`} className="items-center gap-2">
              <View
                className="rounded-md"
                style={{
                  width: barWidth,
                  height,
                  backgroundColor: colors.primary,
                }}
              />

              <ThemedText
                type="caption"
                className="text-contrast-foreground opacity-70"
              >
                {item.label}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

type StatIconProps = {
  icon: AppIconName;
};

function StatIcon({ icon }: StatIconProps) {
  const colors = useAppColors();

  return (
    <View className="h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-primary">
      <LinearGradient
        colors={[colors.primary, colors.primaryHover]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <AppIcon name={icon} size="md" color={colors.primaryForeground} />
    </View>
  );
}

type StatValueProps = {
  label: string;
  value: string;
  variant?: "default" | "contrast";
};

function StatValue({ label, value, variant = "default" }: StatValueProps) {
  const isContrast = variant === "contrast";

  return (
    <View>
      <ThemedText
        type="caption"
        className={
          isContrast ? "text-contrast-foreground opacity-70" : undefined
        }
        tone={isContrast ? undefined : "muted"}
      >
        {label}
      </ThemedText>

      <ThemedText
        type="heading"
        className={isContrast ? "text-contrast-foreground" : undefined}
      >
        {value}
      </ThemedText>
    </View>
  );
}
