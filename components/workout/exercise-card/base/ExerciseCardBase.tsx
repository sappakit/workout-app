import { AppButton } from "@/components/custom-ui/AppButton";
import Thumbnail from "@/components/custom-ui/Thumbnail";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  exerciseTypeFieldConfig,
  getVisibleFields,
} from "@/lib/workout/config";
import {
  formatRepsRange,
  parseRepsRange,
  secondsToHMS,
} from "@/lib/workout/mappers";
import { calculateExerciseDuration } from "@/lib/workout/utils";
import {
  DifficultyLabel,
  ExerciseTypeLabel,
} from "@/types/workout/response/exercise.types";
import { WorkoutExerciseItem } from "@/types/workout/response/workout.types";
import clsx from "clsx";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Dumbbell,
  FileText,
  LucideIcon,
} from "lucide-react-native";
import { ReactNode } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { DifficultyBadge } from "./DifficultyBadge";
import {
  ExerciseInfoCard,
  ExerciseInfoCardEquipment,
} from "./ExerciseInfoCard";
import { ExerciseStat } from "./ExerciseStat";

type ExerciseInfoItem = {
  key: string;
  label: string;
  value: string;
};

type ExerciseStatItem = {
  key: string;
  label: string;
  icon: LucideIcon;
};

interface ExerciseCardBaseProps {
  data: WorkoutExerciseItem;
  expanded: boolean;
  onToggleExpanded: () => void;
  className?: string;
  isEditMode?: boolean;
  editContent?: ReactNode;
  topRightContent?: ReactNode;
}

export default function ExerciseCardBase({
  data,
  expanded,
  onToggleExpanded,
  className,
  isEditMode = false,
  editContent,
  topRightContent,
}: ExerciseCardBaseProps) {
  const { colors } = useAppTheme();

  const typeConfig = exerciseTypeFieldConfig[data.exercise.exerciseType];
  const visibleFields = getVisibleFields(typeConfig);

  // Sets
  const sets = data.plannedSets ?? data.exercise.defaultSets ?? 0;

  // Reps range
  const fallbackReps = parseRepsRange(data.exercise.defaultRepsRange ?? null);
  const parsedPlannedReps = parseRepsRange(data.plannedRepsRange ?? null);

  const repsMin = parsedPlannedReps.minReps ?? fallbackReps.minReps;
  const repsMax = parsedPlannedReps.maxReps ?? fallbackReps.maxReps;
  const reps = formatRepsRange({ minReps: repsMin, maxReps: repsMax });

  // Rest time
  const totalRestSeconds =
    data.plannedRestTime ?? data.exercise.defaultRestTime ?? 0;
  const rest = secondsToHMS(totalRestSeconds);

  // Duration
  const duration = calculateExerciseDuration(data);

  // Equipment
  const equipment = (data.exercise.equipmentLinks ?? []).map(
    (link) => link.equipment.name,
  );

  const infoData: ExerciseInfoItem[] = [
    ...(visibleFields.has("plannedSets")
      ? [{ key: "sets", label: "Total Sets", value: `${sets}` }]
      : []),

    ...(visibleFields.has("plannedRepsRange")
      ? [{ key: "reps", label: "Reps per Set", value: reps ?? "-" }]
      : []),

    ...(visibleFields.has("plannedWeight")
      ? [
          {
            key: "weight",
            label: "Load",
            value:
              data.plannedWeight != null ? `${data.plannedWeight} kg` : "-",
          },
        ]
      : []),

    ...(visibleFields.has("plannedDistance")
      ? [
          {
            key: "distance",
            label: "Target Distance",
            value:
              data.plannedDistance != null ? `${data.plannedDistance}` : "-",
          },
        ]
      : []),

    ...(visibleFields.has("plannedRestTime")
      ? [
          {
            key: "rest",
            label: "Rest Between Sets",
            value: `${rest.minutes} min ${rest.seconds} sec`,
          },
        ]
      : []),

    {
      key: "time",
      label: "Estimated Duration",
      value: `${duration} min`,
    },
  ];

  const stats: ExerciseStatItem[] = [
    ...(visibleFields.has("plannedSets")
      ? [
          {
            key: "sets",
            label: `${sets} ${sets !== 1 ? "Sets" : "Set"}`,
            icon: Dumbbell,
          },
        ]
      : []),
    {
      key: "duration",
      label: `${duration} min`,
      icon: Clock,
    },
  ];

  return (
    <View
      className={twMerge(clsx("overflow-hidden rounded-2xl border", className))}
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      {/* Top right */}
      <View className="absolute right-0 top-0 z-10 flex-row gap-2 p-2">
        {topRightContent ?? (
          <DifficultyBadge
            label={DifficultyLabel[data.exercise.difficultyLevel]}
          />
        )}
      </View>

      {/* Main content */}
      <View className="flex-row p-2">
        {/* TODO: add image */}
        {/* <Thumbnail image={data.image} /> */}
        <Thumbnail />

        <View className="ml-4" style={{ justifyContent: "flex-end" }}>
          {/* Subtitle */}
          <ThemedText type="default" variant="accent" className="text-xs">
            {ExerciseTypeLabel[data.exercise.exerciseType]}
          </ThemedText>

          {/* Title */}
          <ThemedText
            type="default"
            variant="brand"
            className="text-xl font-medium"
          >
            {data.exercise.name}
          </ThemedText>

          {/* Exercise stats */}
          <View className="flex-row gap-2">
            {stats.map((item) => (
              <ExerciseStat
                key={item.key}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </View>

          {/* Expand / edit state */}
          {isEditMode ? (
            <ThemedText
              type="default"
              variant="primary"
              className="mt-2 text-xs"
            >
              Editing ...
            </ThemedText>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onToggleExpanded}
              className="mt-2 flex-row items-center gap-1"
            >
              <ThemedText type="default" variant="primary" className="text-xs">
                {expanded ? "Show less" : "Show more"}
              </ThemedText>

              {expanded ? (
                <ChevronUp size={12} color={colors.app.textPrimary} />
              ) : (
                <ChevronDown size={12} color={colors.app.textPrimary} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Bottom content */}
      {isEditMode ? (
        <View style={{ padding: 8, paddingTop: 0 }}>{editContent}</View>
      ) : (
        expanded && (
          <View style={{ padding: 8, paddingTop: 0 }}>
            <FlatList
              data={infoData}
              numColumns={3}
              keyExtractor={(item) => item.key}
              scrollEnabled={false}
              columnWrapperStyle={{ gap: 8 }}
              contentContainerStyle={{ gap: 8 }}
              renderItem={({ item }) => (
                <View style={{ flex: 1 }}>
                  <ExerciseInfoCard label={item.label} value={item.value} />
                </View>
              )}
            />

            {/* Equipment card */}
            <ExerciseInfoCardEquipment equipment={equipment} className="mt-2" />

            {/* More detail button */}
            <AppButton
              title="More detail"
              variant="secondary"
              icon={FileText}
              className="mt-2 rounded-md"
              textClassName="font-medium"
              // onPress={}
            />
          </View>
        )
      )}
    </View>
  );
}
