import { Separator } from "@/components/custom-ui/Separator";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  getProgressOverviewDateLabel,
  getProgressOverviewTitle,
} from "@/components/progress/model/progress-overview.mapper";
import { WorkoutProgressOverview } from "@/types/workout/response/workout.types";
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
      />

      <ProgressSummarySection data={data.summary} />
      <ProgressVolumeTrendSection data={data.volumeTrend} />

      <Separator orientation="horizontal" className="my-3" />

      <ProgressBestPerformancesSection data={data.bestPerformances} />
    </>
  );
}
