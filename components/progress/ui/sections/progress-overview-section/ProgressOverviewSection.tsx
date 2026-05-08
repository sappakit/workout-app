import { Separator } from "@/components/custom-ui/Separator";
import {
  getProgressOverviewDateLabel,
  getProgressOverviewTitle,
} from "@/components/progress/model/progress-overview.mapper";
import { ThemedText } from "@/components/themed-text";
import { WorkoutProgressOverview } from "@/types/workout/response/workout.types";
import clsx from "clsx";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { ProgressBestPerformancesSection } from "./ProgressBestPerformancesSection";
import { ProgressSummarySection } from "./ProgressSummarySection";
import { ProgressVolumeTrendSection } from "./ProgressVolumeTrendSection";

interface ProgressOverviewSectionProps {
  data: WorkoutProgressOverview;
}

export function ProgressOverviewSection({
  data,
}: ProgressOverviewSectionProps) {
  return (
    <>
      <SectionHeader
        title={getProgressOverviewTitle(data.type)}
        subtitle={getProgressOverviewDateLabel({
          type: data.type,
          startDate: data.startDate,
          endDate: data.endDate,
        })}
        titleClassName="text-xl"
      />

      <ProgressSummarySection data={data.summary} />
      <ProgressVolumeTrendSection data={data.volumeTrend} />

      <Separator orientation="horizontal" className="my-3" />

      <SectionHeader
        title="Best Performances"
        subtitle="Your strongest completed sets this week"
        titleClassName="text-xl"
      />

      <ProgressBestPerformancesSection data={data.bestPerformances} />
    </>
  );
}

function SectionHeader({
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
}: {
  title: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}) {
  return (
    <View>
      <ThemedText
        type="defaultSemiBold"
        variant="accent"
        className={twMerge(clsx("text-lg", titleClassName))}
      >
        {title}
      </ThemedText>

      {subtitle && (
        <ThemedText
          type="default"
          variant="primary"
          className={twMerge(clsx("text-sm", subtitleClassName))}
        >
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}
