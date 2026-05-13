import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";

export function ExerciseInfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
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

export function ExerciseInfoCardEquipment({
  equipment,
  className,
}: {
  equipment: string[];
  className?: string;
}) {
  const { colors } = useAppTheme();

  return (
    <View
      className={twMerge(clsx("rounded-lg p-2", className))}
      style={{ backgroundColor: colors.app.cardSecondary }}
    >
      <ThemedText type="default" variant="primary" className="text-xs">
        Equipment
      </ThemedText>

      {equipment.length === 0 ? (
        <ThemedText type="default" variant="primary" className="mt-1">
          No equipment required
        </ThemedText>
      ) : (
        <View className="mt-1 flex-row flex-wrap gap-2">
          {equipment.map((item) => (
            <View
              key={item}
              className="items-center justify-center rounded-full px-4 py-1"
              style={{ backgroundColor: colors.app.cardTertiary }}
            >
              <ThemedText type="default" variant="accent" className="text-xs">
                {item}
              </ThemedText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
