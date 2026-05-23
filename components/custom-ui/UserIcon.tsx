import { useAppTheme } from "@/hooks/useAppTheme";
import { User } from "lucide-react-native";
import { View } from "react-native";

export function UserIcon() {
  const { colors } = useAppTheme();

  return (
    <View
      className="items-center justify-center rounded-full border p-2"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      <User className="size-8" color={colors.app.borderPrimary} />
    </View>
  );
}
