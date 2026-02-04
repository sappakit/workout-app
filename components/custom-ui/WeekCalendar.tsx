import { useAppTheme } from "@/hooks/useAppTheme";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

type WeekCalendarProps = {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
};

export function WeekCalendar({
  selectedDate,
  onDateChange,
}: WeekCalendarProps) {
  const { colors } = useAppTheme();

  const today = dayjs();
  const [currentDate, setCurrentDate] = useState(
    selectedDate ? dayjs(selectedDate) : today,
  );

  const weekStart = currentDate.startOf("week");

  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => weekStart.add(i, "day"));
  }, [weekStart]);

  function handleSelect(date: dayjs.Dayjs) {
    setCurrentDate(date);
    onDateChange?.(date.format("YYYY-MM-DD"));
  }

  return (
    <View
      className="rounded-2xl border px-2 py-4"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      <View className="flex-row justify-between">
        {days.map((item) => {
          const isSelected = item.isSame(currentDate, "day");

          return (
            <WeekDayItem
              key={item.format("YYYY-MM-DD")}
              date={item}
              isSelected={isSelected}
              onPress={handleSelect}
            />
          );
        })}
      </View>
    </View>
  );
}

type WeekDayItemProps = {
  date: dayjs.Dayjs;
  isSelected: boolean;
  onPress: (date: dayjs.Dayjs) => void;
};

function WeekDayItem({ date, isSelected, onPress }: WeekDayItemProps) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity onPress={() => onPress(date)} className="items-center">
      {/* Day name */}
      <View className="items-center justify-center">
        {/* Dot */}
        <View
          className="h-1 w-1 items-center justify-center"
          style={{ backgroundColor: colors.app.brand, borderRadius: 999 }}
        />

        <ThemedText
          type="default"
          variant="primary"
          className="mt-2 text-xs"
          style={isSelected && { color: colors.app.brand }}
        >
          {date.format("ddd")}
        </ThemedText>
      </View>

      {/* Date */}
      <View
        className="mt-3 h-10 w-10 items-center justify-center"
        style={
          isSelected && {
            borderColor: colors.app.brand,
            borderRadius: 999,
            borderWidth: 1,
          }
        }
      >
        <ThemedText
          type="default"
          variant="primary"
          className="text-xs"
          style={
            isSelected
              ? { color: colors.app.brand }
              : { color: colors.app.textPrimary }
          }
        >
          {date.date()}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}
