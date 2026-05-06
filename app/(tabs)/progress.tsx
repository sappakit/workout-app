import ProgressContent, {
  ProgressPageData,
} from "@/components/progress/ProgressContent";
import { useGetQuery } from "@/lib/query/useGetQuery";
import { workoutQueryKeys } from "@/lib/workout/keys";
import { PaginatedResponse } from "@/types/api.types";
import { WorkoutSession } from "@/types/workout/response/workout.types";
import { workoutApi } from "../api/workout.api";

const mockProgressData: ProgressPageData = {
  weeklySummary: {
    workoutsCompleted: 3,
    totalVolumeKg: 12450,
    completedSets: 48,
    totalDurationSeconds: 9300,
  },

  weeklyVolume: [
    { label: "Mon", volumeKg: 3200 },
    { label: "Tue", volumeKg: 4100 },
    { label: "Wed", volumeKg: 0 },
    { label: "Thu", volumeKg: 3850 },
    { label: "Fri", volumeKg: 1300 },
    { label: "Sat", volumeKg: 0 },
    { label: "Sun", volumeKg: 0 },
  ],

  personalRecords: [
    {
      exerciseName: "Bench Press",
      bestWeightKg: 60,
      bestSetVolumeKg: 600,
      bestSetLabel: "60 kg × 10 reps",
    },
    {
      exerciseName: "Lat Pulldown",
      bestWeightKg: 45,
      bestSetVolumeKg: 540,
      bestSetLabel: "45 kg × 12 reps",
    },
    {
      exerciseName: "Incline Dumbbell Press",
      bestWeightKg: 22.5,
      bestSetVolumeKg: 225,
      bestSetLabel: "22.5 kg × 10 reps",
    },
  ],

  recentWorkouts: [
    {
      id: 1,
      workoutName: "Push Day",
      completedAt: "2026-05-04T10:30:00.000Z",
      durationSeconds: 3120,
      volumeKg: 4250,
      completedSets: 18,
      totalSets: 20,
    },
    {
      id: 2,
      workoutName: "Pull Day",
      completedAt: "2026-05-02T11:15:00.000Z",
      durationSeconds: 2760,
      volumeKg: 3900,
      completedSets: 16,
      totalSets: 18,
    },
    {
      id: 3,
      workoutName: "Upper Body",
      completedAt: "2026-04-30T09:45:00.000Z",
      durationSeconds: 3420,
      volumeKg: 4300,
      completedSets: 20,
      totalSets: 22,
    },
  ],
};

export default function ProgressScreen() {
  const url = workoutApi.getSessionHistory();
  const params = { page: 1, limit: 10 };
  const {
    data: testData,
    isLoading,
    isError,
  } = useGetQuery<PaginatedResponse<WorkoutSession>>(
    workoutQueryKeys.sessionHistory(params),
    url,
    { params },
  );

  console.log(testData);

  return <ProgressContent data={mockProgressData} />;
}
