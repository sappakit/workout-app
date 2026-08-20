import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { CONTENT_PADDING_HORIZONTAL } from "@/components/layout/PageLayout";
import { useAppColors } from "@/hooks/useAppTheme";
import { cn } from "@/lib/utils";
import { WorkoutWeeklyPlanDayType } from "@/types/workout/response/workout.types";
import { useEffect, useRef } from "react";
import { FlatList, Pressable } from "react-native";
import type { WeeklyPlanDay } from "../model/weekly-plan.mapper";

interface WeeklyPlanDaySelectorProps {
  weeklyPlan: WeeklyPlanDay[];
  selectedDayOfWeek: number;
  onSelectDay: (dayOfWeek: number) => void;
}

export function WeeklyPlanDaySelector({
  weeklyPlan,
  selectedDayOfWeek,
  onSelectDay,
}: WeeklyPlanDaySelectorProps) {
  const listRef = useRef<FlatList<WeeklyPlanDay>>(null);

  useEffect(() => {
    const selectedIndex = weeklyPlan.findIndex(
      (day) => day.dayOfWeek === selectedDayOfWeek,
    );

    if (selectedIndex < 0) {
      return;
    }

    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({
        index: selectedIndex,
        animated: true,
        viewPosition: 0.5,
      });
    });
  }, [selectedDayOfWeek, weeklyPlan]);

  return (
    <FlatList
      ref={listRef}
      horizontal
      data={weeklyPlan}
      keyExtractor={(item) => String(item.dayOfWeek)}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2"
      style={{
        marginHorizontal: -CONTENT_PADDING_HORIZONTAL,
      }}
      contentContainerStyle={{
        paddingHorizontal: CONTENT_PADDING_HORIZONTAL,
      }}
      onScrollToIndexFailed={(info) => {
        requestAnimationFrame(() => {
          listRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        });
      }}
      renderItem={({ item }) => (
        <DayPill
          day={item}
          isSelected={item.dayOfWeek === selectedDayOfWeek}
          onPress={() => onSelectDay(item.dayOfWeek)}
        />
      )}
    />
  );
}

interface DayPillProps {
  day: WeeklyPlanDay;
  isSelected: boolean;
  onPress: () => void;
}

function DayPill({ day, isSelected, onPress }: DayPillProps) {
  const colors = useAppColors();

  const isAssigned = day.dayType !== WorkoutWeeklyPlanDayType.UNASSIGNED;

  const iconName =
    day.dayType === WorkoutWeeklyPlanDayType.WORKOUT
      ? "workout"
      : day.dayType === WorkoutWeeklyPlanDayType.REST
        ? "recovery"
        : "unassigned";

  const contentColor = isSelected
    ? colors.primaryForeground
    : isAssigned
      ? colors.foreground
      : colors.mutedForeground;

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "h-24 w-[68px] items-center justify-center gap-2 rounded-full border active:opacity-80",

        isSelected && "border-primary bg-primary",

        !isSelected && isAssigned && "border-secondary bg-secondary",

        !isSelected && !isAssigned && "border-border bg-card",
      )}
    >
      <AppIcon
        name={iconName}
        variant="outline"
        size="md"
        color={contentColor}
      />

      <ThemedText
        type="small"
        style={{
          color: contentColor,
        }}
      >
        {day.shortLabel}
      </ThemedText>
    </Pressable>
  );
}
