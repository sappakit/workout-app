import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LucideIcon } from "lucide-react-native";
import { View } from "react-native";

interface ExerciseStatProps {
  label: string;
  icon?: LucideIcon;
}

export function ExerciseStat({ label, icon: Icon }: ExerciseStatProps) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-row items-center gap-2">
      {Icon && <Icon size={12} color={colors.app.brand} />}

      <ThemedText type="default" variant="primary" className="text-xs">
        {label}
      </ThemedText>
    </View>
  );
}
