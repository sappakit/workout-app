import { useAppTheme } from "@/hooks/useAppTheme";
import { calculateExerciseDuration } from "@/lib/workout/utils";
import {
  DifficultyLabel,
  ExerciseTypeLabel,
} from "@/types/workout/exercise.types";
import { WorkoutExerciseItem } from "@/types/workout/workout.types";
import clsx from "clsx";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Dumbbell,
  FileText,
} from "lucide-react-native";
import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";
import MainButton from "../custom-ui/MainButton";
import Thumbnail from "../custom-ui/Thumbnail";
import { ThemedText } from "../themed-text";

interface ExerciseCardProps {
  data: WorkoutExerciseItem;
  className?: string;
}

type ExerciseInfoItem = {
  key: string;
  label: string;
  value: string;
};

// TODO: handle cardio case (expected no sets, reps, etc, field)
export function ExerciseCard({ data, className }: ExerciseCardProps) {
  const { colors } = useAppTheme();
  const [expanded, setExpanded] = useState(false);

  const sets = data.plannedSets ?? data.exercise.defaultSets;
  const reps = data.plannedRepsRange ?? data.exercise.defaultRepsRange;
  const rest = Math.round(
    (data.plannedRestTime ?? data.exercise.defaultRestTime ?? 0) / 60,
  );
  const equipment = data.exercise.equipmentLinks.map(
    (link) => link.equipment.name,
  );

  const duration = calculateExerciseDuration({ item: data });

  const infoData: ExerciseInfoItem[] = [
    { key: "sets", label: "Total Sets", value: `${sets}` },
    { key: "reps", label: "Reps per Set", value: `${reps}` },
    { key: "rest", label: "Rest time per set", value: `${rest} Minutes` },
    {
      key: "equipment",
      label: "Equipment need",
      value: `${equipment.length ? equipment.join(", ") : "None"}`,
    },
    { key: "time", label: "Total Estimate time", value: `${duration} Minutes` },
  ];

  return (
    <View
      className={twMerge(
        clsx("mt-4 overflow-hidden rounded-2xl border", className),
      )}
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      {/* Level badge */}
      <View
        className="absolute px-4 py-1"
        style={{
          backgroundColor: colors.app.brand,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          right: 16,
        }}
      >
        {/* TODO: Add level */}
        <ThemedText
          type="default"
          className="text-xs"
          style={{ color: colors.app.textWhite }}
        >
          {DifficultyLabel[data.exercise.difficultyLevel]}
        </ThemedText>
      </View>

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

          <View className="flex-row">
            {/* Sets */}
            <View className="flex-row items-center">
              <Dumbbell size={12} color={colors.app.brand} />
              <ThemedText
                type="default"
                variant="primary"
                className="ml-2 text-xs"
              >
                {sets} {sets !== 1 ? "Sets" : "Set"}
              </ThemedText>
            </View>

            {/* Duration */}
            <View className="ml-4 flex-row items-center">
              <Clock size={12} color={colors.app.brand} />
              <ThemedText
                type="default"
                variant="primary"
                className="ml-2 text-xs"
              >
                {duration} min
              </ThemedText>
            </View>
          </View>

          {/* Display info */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setExpanded((prev) => !prev)}
            className="mt-2 flex-row items-center"
          >
            <ThemedText
              type="default"
              variant="primary"
              className="text-xs"
              style={{ marginRight: 3 }}
            >
              {expanded ? "Show less" : "Show more"}
            </ThemedText>

            <View>
              {expanded ? (
                <ChevronUp size={12} color={colors.app.textPrimary} />
              ) : (
                <ChevronDown size={12} color={colors.app.textPrimary} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Info */}
      {expanded && (
        <View className="rounded-xl" style={{ padding: 8, paddingTop: 0 }}>
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

          {/* TODO: add more detail */}
          <MainButton
            className="mt-2 rounded-lg border"
            style={{
              backgroundColor: colors.app.cardSecondary,
              borderColor: colors.app.borderSecondary,
            }}
            textStyle={{ color: colors.app.textAccent }}
            title="More detail"
            icon={
              <FileText
                size={16}
                color={colors.app.textAccent}
                style={{ marginRight: 8 }}
              />
            }
            // onPress={handleSubmit(onSubmit)}
            // loading={loading}
          />
        </View>
      )}
    </View>
  );
}

function ExerciseInfoCard({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();

  return (
    <View
      className="rounded-lg p-2"
      style={{
        backgroundColor: colors.app.cardSecondary,
      }}
    >
      <ThemedText type="default" variant="primary" className="text-xs">
        {label}
      </ThemedText>

      <ThemedText type="default" variant="accent" className="mt-1">
        {value}
      </ThemedText>
    </View>
  );
}
