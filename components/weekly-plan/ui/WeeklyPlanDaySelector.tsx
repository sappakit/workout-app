import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { WorkoutWeeklyPlanDayType } from "@/types/workout/response/workout.types";
import { CircleDashed, Dumbbell, Moon } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { FlatList, Pressable } from "react-native";
import { WeeklyPlanDay } from "../model/weekly-plan.mapper";

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

    if (selectedIndex < 0) return;

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
  const { colors } = useAppTheme();

  const textColor = isSelected ? colors.app.textWhite : colors.app.textPrimary;

  return (
    <Pressable
      onPress={onPress}
      className="w-20 items-center justify-between gap-3 rounded-3xl p-4"
      style={{
        backgroundColor: isSelected ? colors.app.brand : colors.app.cardPrimary,
      }}
    >
      {day.dayType === WorkoutWeeklyPlanDayType.WORKOUT ? (
        <Dumbbell size={20} color={textColor} />
      ) : day.dayType === WorkoutWeeklyPlanDayType.REST ? (
        <Moon size={20} color={textColor} />
      ) : (
        <CircleDashed size={20} color={textColor} />
      )}

      <ThemedText
        type="defaultSemiBold"
        style={{
          color: textColor,
        }}
      >
        {day.shortLabel}
      </ThemedText>
    </Pressable>
  );
}
