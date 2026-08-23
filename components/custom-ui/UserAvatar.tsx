import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { useAppColors } from "@/hooks/useAppColors";
import { Image, View } from "react-native";

type UserAvatarProps = {
  imageUrl?: string | null;
};

export function UserAvatar({ imageUrl }: UserAvatarProps) {
  const colors = useAppColors();

  return (
    <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-card">
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="h-full w-full"
          resizeMode="cover"
        />
      ) : (
        <AppIcon
          name="profile"
          variant="filled"
          size="lg"
          color={colors.mutedForeground}
        />
      )}
    </View>
  );
}
