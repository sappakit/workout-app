import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { LinearGradient } from "expo-linear-gradient";
import { ChartBar, LucideIcon } from "lucide-react-native";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { twMerge } from "tailwind-merge";

interface SimpleStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function SimpleStatCard({
  icon: Icon,
  label,
  value,
  className,
  style,
}: SimpleStatCardProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className={twMerge(clsx("rounded-2xl p-4", className))}
      style={[{ backgroundColor: colors.app.cardPrimary }, style]}
    >
      <View className="flex-row items-center gap-3">
        <StatIcon icon={Icon} />

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
  icon?: LucideIcon;
  label?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  barMaxHeight?: number;
  barWidth?: number;
}

export function VolumeStatCard({
  value,
  volumeTrend,
  icon: Icon = ChartBar,
  label = "Volume",
  className,
  style,
  barMaxHeight = 36,
  barWidth = 20,
}: VolumeStatCardProps) {
  const { colors } = useAppTheme();

  const maxValue = Math.max(...volumeTrend.map((item) => item.value), 0);

  return (
    <View
      className={twMerge(
        clsx("justify-between gap-4 rounded-2xl p-4", className),
      )}
      style={[{ backgroundColor: colors.app.cardPrimary }, style]}
    >
      <View className="flex-row items-center gap-3">
        <StatIcon icon={Icon} />

        <StatValue label={label} value={value} />
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
                  backgroundColor: colors.app.brand,
                }}
              />

              <ThemedText type="small" variant="primary">
                {item.label}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function StatIcon({ icon: Icon }: { icon: LucideIcon }) {
  const { colors } = useAppTheme();

  return (
    <View
      className="h-11 w-11 items-center justify-center overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.app.brand }}
    >
      <LinearGradient
        colors={[colors.app.brandLight, colors.app.brand, colors.app.brandDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View>
        <Icon size={20} color={colors.app.textWhite} />
      </View>
    </View>
  );
}

function StatValue({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <ThemedText type="extraSmall" variant="primary">
        {label}
      </ThemedText>

      <ThemedText type="subtitle" variant="accent">
        {value}
      </ThemedText>
    </View>
  );
}
