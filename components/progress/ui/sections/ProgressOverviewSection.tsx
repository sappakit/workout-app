import { ProgressPageData } from "@/components/progress/ProgressContent";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  Award,
  CalendarDays,
  Clock3,
  Layers3,
  TrendingUp,
} from "lucide-react-native";
import React from "react";
import { FlatList, View } from "react-native";

type WeeklySummaryStatItem = {
  key: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  value: string;
  label: string;
};

interface ProgressOverviewSectionProps {
  weeklySummary: ProgressPageData["weeklySummary"];
  weeklyVolume: ProgressPageData["weeklyVolume"];
  personalRecords: ProgressPageData["personalRecords"];
}

export function ProgressOverviewSection({
  weeklySummary,
  weeklyVolume,
  personalRecords,
}: ProgressOverviewSectionProps) {
  return (
    <>
      <View>
        <ThemedText type="title" variant="accent">
          May 1-7, 2026
        </ThemedText>

        <ThemedText type="default" variant="primary" className="text-sm">
          Your weekly training summary
        </ThemedText>
      </View>

      <WeeklySummarySection data={weeklySummary} />

      <WeeklyVolumeSection data={weeklyVolume} />

      <PersonalRecordsSection data={personalRecords} />
    </>
  );
}

function WeeklySummarySection({
  data,
}: {
  data: ProgressPageData["weeklySummary"];
}) {
  const summaryStats: WeeklySummaryStatItem[] = [
    {
      key: "workouts",
      icon: CalendarDays,
      value: String(data.workoutsCompleted),
      label: "Workouts",
    },
    {
      key: "volume",
      icon: TrendingUp,
      value: `${formatNumber(data.totalVolumeKg)} kg`,
      label: "Volume",
    },
    {
      key: "sets",
      icon: Layers3,
      value: String(data.completedSets),
      label: "Sets",
    },
    {
      key: "time",
      icon: Clock3,
      value: formatDurationShort(data.totalDurationSeconds),
      label: "Time",
    },
  ];

  return (
    <FlatList
      data={summaryStats}
      keyExtractor={(item) => item.key}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperClassName="gap-3"
      contentContainerClassName="gap-3"
      renderItem={({ item }) => (
        <ProgressStatCard
          icon={item.icon}
          value={item.value}
          label={item.label}
        />
      )}
    />
  );
}

function WeeklyVolumeSection({
  data,
}: {
  data: ProgressPageData["weeklyVolume"];
}) {
  const { colors } = useAppTheme();
  const maxVolume = Math.max(...data.map((item) => item.volumeKg), 1);

  return (
    <ProgressSection>
      <SectionHeader
        title="Weekly Volume"
        subtitle="Total completed volume by day"
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

function PersonalRecordsSection({
  data,
}: {
  data: ProgressPageData["personalRecords"];
}) {
  return (
    <ProgressSection>
      <SectionHeader
        title="Personal Records"
        subtitle="Your best exercise performances"
      />

      <View className="mt-3 gap-3">
        {data.map((record) => (
          <PersonalRecordCard key={record.exerciseName} record={record} />
        ))}
      </View>
    </ProgressSection>
  );
}

function ProgressStatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  value: string;
  label: string;
}) {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-1 flex-row items-center gap-3 rounded-2xl border p-3"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-2xl"
        style={{ backgroundColor: colors.app.cardSecondary }}
      >
        <Icon size={18} color={colors.app.brand} />
      </View>

      <View className="flex-1">
        <ThemedText
          type="default"
          variant="accent"
          className="text-xl font-semibold"
        >
          {value}
        </ThemedText>

        <ThemedText type="default" variant="primary" className="text-xs">
          {label}
        </ThemedText>
      </View>
    </View>
  );
}

function PersonalRecordCard({
  record,
}: {
  record: ProgressPageData["personalRecords"][number];
}) {
  const { colors } = useAppTheme();

  return (
    <View
      className="rounded-2xl border p-4"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      <View className="flex-row items-start gap-3">
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.app.cardSecondary }}
        >
          <Award size={20} color={colors.app.brand} />
        </View>

        <View className="flex-1">
          <ThemedText type="defaultSemiBold" variant="accent">
            {record.exerciseName}
          </ThemedText>

          <ThemedText
            type="default"
            variant="secondary"
            className="mt-1 text-sm"
          >
            Best set: {record.bestSetLabel}
          </ThemedText>

          <View className="mt-3 flex-row gap-2">
            <MiniMetric
              label="Best Weight"
              value={`${record.bestWeightKg} kg`}
            />

            <MiniMetric
              label="Best Volume"
              value={`${formatNumber(record.bestSetVolumeKg)} kg`}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function ProgressSection({ children }: { children: React.ReactNode }) {
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

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View>
      <ThemedText type="defaultSemiBold" variant="accent" className="text-lg">
        {title}
      </ThemedText>

      {subtitle && (
        <ThemedText type="default" variant="primary" className="text-sm">
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-1 rounded-xl px-3 py-2"
      style={{ backgroundColor: colors.app.background }}
    >
      <ThemedText type="defaultSemiBold" variant="accent" className="text-sm">
        {value}
      </ThemedText>

      <ThemedText type="default" variant="secondary" className="mt-0.5 text-xs">
        {label}
      </ThemedText>
    </View>
  );
}

function formatNumber(value: number) {
  return Intl.NumberFormat("en-US").format(value);
}

function formatDurationShort(totalSeconds: number) {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) return `${minutes}m`;

  return `${hours}h ${minutes}m`;
}
