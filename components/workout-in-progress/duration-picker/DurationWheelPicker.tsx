import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import WheelPicker from "@quidone/react-native-wheel-picker";
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

const HOUR_DATA = buildNumberData(0, 23);
const MINUTE_DATA = buildNumberData(0, 59);
const SECOND_DATA = buildNumberData(0, 59);

export function DurationWheelPicker({
  value,
  onChange,
}: DurationWheelPickerProps) {
  const { colors } = useAppTheme();

  return (
    <View className="relative">
      {/* Wheel picker */}
      <View className="flex-row items-start gap-3 px-4">
        <DurationColumn
          unit="Hour"
          value={value.hours}
          data={HOUR_DATA}
          onChange={(hours) => onChange({ ...value, hours })}
        />

        <DurationColumn
          unit="Min"
          value={value.minutes}
          data={MINUTE_DATA}
          onChange={(minutes) => onChange({ ...value, minutes })}
        />

        <DurationColumn
          unit="Sec"
          value={value.seconds}
          data={SECOND_DATA}
          onChange={(seconds) => onChange({ ...value, seconds })}
        />
      </View>

      {/* Overlay */}
      <View className="absolute bottom-0 left-0 right-0 top-0 -z-10 justify-center px-4">
        <View
          className="h-14 rounded-xl"
          pointerEvents="none"
          style={{
            backgroundColor: colors.app.brand + 20,
          }}
        />
      </View>
    </View>
  );
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
    <View className="relative w-full flex-1">
      <WheelPicker
        data={data}
        value={value}
        visibleItemCount={3}
        onValueChanged={({ item }) => onChange(item.value)}
        renderOverlay={() => null}
        enableScrollByTapOnItem
        itemTextStyle={{
          textAlign: "left",
          paddingLeft: 16,
          color: colors.app.textAccent,
        }}
      />

      {/* Unit display */}
      <View
        className="absolute bottom-0 right-0 top-0 justify-center p-4"
        pointerEvents="none"
      >
        <ThemedText type="default" variant="primary">
          {unit}
        </ThemedText>
      </View>
    </View>
  );
}

function buildNumberData(min: number, max: number): PickerItem[] {
  return Array.from({ length: max - min + 1 }, (_, index) => {
    const itemValue = min + index;

    return {
      label: String(itemValue),
      value: itemValue,
    };
  });
}
