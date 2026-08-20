import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { useAppColors } from "@/hooks/useAppTheme";
import { cn } from "@/lib/utils";
import { Image, Pressable, View } from "react-native";

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
  const colors = useAppColors();

  return (
    <Pressable
      onPress={onPressEdit}
      disabled={!onPressEdit}
      className={cn("relative", className)}
    >
      <View className="h-24 w-24 overflow-hidden rounded-full bg-secondary">
        {image ? (
          <Image
            source={{ uri: image }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <AppIcon
              name="profile"
              variant="filled"
              size="xl"
              color={colors.secondaryForeground}
            />
          </View>
        )}
      </View>

      {showEditIcon ? (
        <View
          className="absolute bottom-0 right-0 h-10 w-10 translate-y-1/4 items-center justify-center rounded-full border-4 bg-primary"
          style={{
            borderColor: colors.background,
          }}
        >
          <AppIcon name="edit" size="sm" color={colors.primaryForeground} />
        </View>
      ) : null}
    </Pressable>
  );
}
