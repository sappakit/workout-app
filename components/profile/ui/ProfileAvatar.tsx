import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { Pencil, User } from "lucide-react-native";
import { Image, Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";

type ProfileAvatarProps = {
  image?: string | null;
  className?: string;
  onPressEdit?: () => void;
};

export function ProfileAvatar({
  image,
  className,
  onPressEdit,
}: ProfileAvatarProps) {
  const { colors } = useAppTheme();

  return (
    <View className={twMerge(clsx("relative", className))}>
      <View className="h-24 w-24 overflow-hidden rounded-full">
        {image ? (
          <Image
            source={{ uri: image }}
            className="flex-1"
            resizeMode="cover"
          />
        ) : (
          <View
            className="flex-1 items-center justify-center"
            style={{ backgroundColor: colors.app.cardSecondary }}
          >
            <User size={44} color={colors.app.textPrimary} />
          </View>
        )}
      </View>

      <Pressable
        className="absolute bottom-0 right-0 h-9 w-9 translate-y-1/4 items-center justify-center rounded-full border-4"
        style={{
          backgroundColor: colors.app.brand,
          borderColor: colors.app.background,
        }}
        onPress={onPressEdit}
      >
        <Pencil size={14} color={colors.app.textAccent} />
      </Pressable>
    </View>
  );
}
