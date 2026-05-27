import { HomeStatsModel } from "@/components/home/model/home-stats.mapper";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import { ChartBar, Dumbbell, LucideIcon, Timer } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

interface HomeStatsCardsProps {
  data: HomeStatsModel;
}

export function HomeStatsCards({ data }: HomeStatsCardsProps) {
  return (
    <View className="flex-row gap-3">
      <VolumeStatCard
        value={data.totalVolumeText}
        volumeTrend={data.volumeTrend}
      />

      <View className="flex-1 gap-3">
        <SimpleStatCard
          icon={Dumbbell}
          label="Workouts"
          value={data.workoutsCompletedText}
        />

        <SimpleStatCard
          icon={Timer}
          label="Time"
          value={data.totalDurationText}
        />
      </View>
    </View>
  );
}

interface SimpleStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function SimpleStatCard({ icon: Icon, label, value }: SimpleStatCardProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className="rounded-2xl p-4"
      style={{ backgroundColor: colors.app.cardPrimary }}
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
}

function VolumeStatCard({ value, volumeTrend }: VolumeStatCardProps) {
  const { colors } = useAppTheme();

  const maxValue = Math.max(...volumeTrend.map((item) => item.value), 0);

  return (
    <View
      className="flex-1 justify-between rounded-2xl p-4"
      style={{ backgroundColor: colors.app.cardPrimary }}
    >
      <View className="flex-row items-center gap-3">
        <StatIcon icon={ChartBar} />

        <StatValue label="Volume" value={value} />
      </View>

      <View className="flex-row items-end justify-between">
        {volumeTrend.map((item, index) => {
          const height =
            maxValue > 0 ? Math.max(6, (item.value / maxValue) * 36) : 6;

          return (
            <View key={`${item.label}-${index}`} className="items-center gap-2">
              <View
                className="w-5 rounded-md"
                style={{
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
