import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import WheelPicker from "@quidone/react-native-wheel-picker";
import { useMemo } from "react";
import { View } from "react-native";

type PickerItem = {
  label: string;
  value: number;
};

export type DurationValue = {
  hours: number;
  minutes: number;
  seconds: number;
};

type DurationWheelPickerProps = {
  value: DurationValue;
  onChange: (value: DurationValue) => void;
};

function buildNumberData(min: number, max: number): PickerItem[] {
  return Array.from({ length: max - min + 1 }, (_, index) => {
    const itemValue = min + index;

    return {
      label: String(itemValue).padStart(2, "0"),
      value: itemValue,
    };
  });
}

function DurationColumn({
  unit,
  value,
  data,
  onChange,
}: {
  unit: string;
  value: number;
  data: PickerItem[];
  onChange: (value: number) => void;
}) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-1 items-center">
      {/* <ThemedText type="default" variant="secondary" className="mb-2">
        {unit}
      </ThemedText> */}

      <View className="relative w-full">
        <WheelPicker
          data={data}
          value={value}
          visibleItemCount={3}
          onValueChanged={({ item }) => onChange(item.value)}
          enableScrollByTapOnItem={true}
          // overlayItemStyle={{
          //   backgroundColor: colors.app.brand,
          // }}
          renderOverlay={() => null}
          itemTextStyle={{
            textAlign: "left",
            paddingLeft: 16,
            color: colors.app.textAccent,
          }}
        />

        <View
          className="absolute bottom-0 right-0 top-0 justify-center p-4"
          pointerEvents="none"
        >
          <ThemedText type="default" variant="primary">
            {unit}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

export function DurationWheelPicker({
  value,
  onChange,
}: DurationWheelPickerProps) {
  const { colors } = useAppTheme();

  const hourData = useMemo(() => buildNumberData(0, 23), []);
  const minuteData = useMemo(() => buildNumberData(0, 59), []);
  const secondData = useMemo(() => buildNumberData(0, 59), []);

  return (
    <View className="relative">
      <View className="flex-row items-start gap-3 px-4">
        <DurationColumn
          unit="Hour"
          value={value.hours}
          data={hourData}
          onChange={(hours) => onChange({ ...value, hours })}
        />

        <DurationColumn
          unit="Min"
          value={value.minutes}
          data={minuteData}
          onChange={(minutes) => onChange({ ...value, minutes })}
        />

        <DurationColumn
          unit="Sec"
          value={value.seconds}
          data={secondData}
          onChange={(seconds) => onChange({ ...value, seconds })}
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0 top-0 justify-center px-4">
        <View
          className="-z-10 h-14 rounded-xl opacity-10"
          pointerEvents="none"
          style={{
            backgroundColor: colors.app.brand,
          }}
        />
      </View>
    </View>
  );
}
