import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { Pencil, User } from "lucide-react-native";
import { Image, TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";

type ProfileAvatarProps = {
  image?: string | null;
  className?: string;
  onPressEdit?: () => void;
  showEditIcon?: boolean;
};

export function ProfileAvatar({
  image,
  className,
  onPressEdit,
  showEditIcon = false,
}: ProfileAvatarProps) {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPressEdit}
      activeOpacity={0.8}
      className={twMerge(clsx("relative", className))}
    >
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

      {showEditIcon ? (
        <View
          className="absolute bottom-0 right-0 h-10 w-10 translate-y-1/4 items-center justify-center rounded-full border-4"
          style={{
            backgroundColor: colors.app.brand,
            borderColor: colors.app.background,
          }}
        >
          <Pencil size={14} color={colors.app.white} />
        </View>
      ) : null}
    </TouchableOpacity>
  );
}
