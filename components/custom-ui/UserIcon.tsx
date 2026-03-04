import { useAppTheme } from "@/hooks/useAppTheme";
import { User } from "lucide-react-native";
import { View } from "react-native";

export function UserIcon() {
  const { colors } = useAppTheme();

  return (
    <View
      className="items-center justify-center rounded-full border p-2"
      style={{
        backgroundColor: colors.app.cardSecondary,
        borderColor: colors.app.borderTertiary,
      }}
    >
      <User className="size-8" color={colors.app.borderTertiary} />
    </View>
  );
}
