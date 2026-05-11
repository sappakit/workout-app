import { SectionHeader } from "@/components/layout/SectionHeader";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { WorkoutProgressOverview } from "@/types/workout/response/workout.types";
import { ReactNode } from "react";
import { View } from "react-native";

interface ProgressVolumeTrendSectionProps {
  data: WorkoutProgressOverview["volumeTrend"];
}

export function ProgressVolumeTrendSection({
  data,
}: ProgressVolumeTrendSectionProps) {
  const { colors } = useAppTheme();
  const maxVolume = Math.max(...data.map((item) => item.volumeKg), 1);

  return (
    <ProgressSection>
      <SectionHeader
        title="Volume Trend"
        subtitle="Total completed volume by day"
        size="small"
      />

      <View className="mt-5 h-40 flex-row items-end justify-between gap-2">
        {data.map((item) => {
          const heightPercent = item.volumeKg / maxVolume;
          const barHeight = Math.max(8, heightPercent * 120);

          return (
            <View key={item.label} className="flex-1 items-center gap-2">
              <View className="h-28 justify-end">
                <View
                  className="w-7 rounded-full"
                  style={{
                    height: barHeight,
                    backgroundColor:
                      item.volumeKg > 0
                        ? colors.app.brand
                        : colors.app.cardSecondary,
                  }}
                />
              </View>

              <ThemedText
                type="default"
                variant="secondary"
                className="text-xs"
              >
                {item.label}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </ProgressSection>
  );
}

function ProgressSection({ children }: { children: ReactNode }) {
  const { colors } = useAppTheme();

  return (
    <View
      className="rounded-3xl border p-4"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      {children}
    </View>
  );
}
