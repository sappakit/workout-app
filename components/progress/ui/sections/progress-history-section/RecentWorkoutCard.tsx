import { AppButton } from "@/components/custom-ui/AppButton";
import { Separator } from "@/components/custom-ui/Separator";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ArrowUpRight, ImageIcon, LucideIcon } from "lucide-react-native";
import React from "react";
import { Image, Pressable, View } from "react-native";

interface ListItem {
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface RecentWorkoutCardItem {
  id: number | string;
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  list: ListItem[];
  action: () => void;
}

interface RecentWorkoutCardProps {
  item: RecentWorkoutCardItem;
}

export function RecentWorkoutCard({ item }: RecentWorkoutCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      className="overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.app.cardPrimaryDark }}
    >
      <View
        className="flex-row items-center gap-3 p-4"
        style={{ backgroundColor: colors.app.cardPrimary }}
      >
        <View
          className="h-14 w-14 items-center justify-center overflow-hidden rounded-full"
          style={{ backgroundColor: colors.app.cardTertiary }}
        >
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <ImageIcon size={28} color={colors.app.cardPrimary} />
          )}
        </View>

        <View className="flex-1">
          <ThemedText type="subtitle" variant="accent">
            {item.title}
          </ThemedText>

          <ThemedText type="extraSmall" variant="primary">
            {item.subtitle}
          </ThemedText>
        </View>

        <AppButton
          variant="tertiary"
          icon={ArrowUpRight}
          className="h-9 w-9 self-start"
          shape="pill"
          onPress={item.action}
        />
      </View>

      <View className="flex-row items-center justify-between p-4">
        {item.list.map((metric, index) => (
          <React.Fragment key={metric.label}>
            {index > 0 && <Separator className="h-8" />}

            <RecentMetric
              icon={metric.icon}
              label={metric.label}
              value={metric.value}
            />
          </React.Fragment>
        ))}
      </View>
    </Pressable>
  );
}

type RecentMetricProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function RecentMetric({ icon: Icon, label, value }: RecentMetricProps) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-row items-center gap-4">
      <Icon size={24} color={colors.app.brand} />

      <View>
        <ThemedText type="extraSmall" variant="primary">
          {label}
        </ThemedText>
        <ThemedText type="default" variant="accent">
          {value}
        </ThemedText>
      </View>
    </View>
  );
}
