import { AppButton } from "@/components/custom-ui/AppButton";
import { CONTENT_PADDING_HORIZONTAL } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { WORKOUT_IMAGE } from "@/constants/images";
import { hexWithOpacity } from "@/constants/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import {
  CircleAlert,
  Dumbbell,
  Heart,
  LucideIcon,
  RefreshCw,
} from "lucide-react-native";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { WorkoutCardItem, WorkoutMetaPill } from "../workout-card/WorkoutCard";
import { MuscleCategoryFilter } from "./muscle-category-filter/MuscleCategoryFilter";
import { WorkoutPreviewSectionSkeleton } from "./WorkoutPreviewSectionSkeleton";

export interface WorkoutPreviewCardItem extends WorkoutCardItem {
  action: () => void;
  favoriteAction: () => void;
}

export interface WorkoutPreviewSectionProps {
  items: WorkoutPreviewCardItem[];
  selectedMuscleIds: number[];
  onChangeMuscleIds: (muscleIds: number[]) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function WorkoutPreviewSection({
  items,
  selectedMuscleIds,
  onChangeMuscleIds,
  isLoading = false,
  isError = false,
  onRetry,
}: WorkoutPreviewSectionProps) {
  const isEmpty = items.length === 0;

  return (
    <View
      className="gap-3"
      style={{ marginHorizontal: -CONTENT_PADDING_HORIZONTAL }}
    >
      <MuscleCategoryFilter
        selectedMuscleIds={selectedMuscleIds}
        onChange={onChangeMuscleIds}
      />

      {isLoading ? (
        <WorkoutPreviewSectionSkeleton
          showHeader={false}
          showCategories={false}
          withHorizontalPadding
        />
      ) : isError ? (
        <WorkoutPreviewError onRetry={onRetry} />
      ) : isEmpty ? (
        <WorkoutPreviewEmpty />
      ) : (
        <WorkoutPreviewCardList items={items} />
      )}
    </View>
  );
}

type WorkoutPreviewFeedbackProps = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  action?: {
    title: string;
    icon?: LucideIcon;
    onPress: () => void;
  };
};

function WorkoutPreviewFeedback({
  icon: Icon,
  title,
  subtitle,
  action,
}: WorkoutPreviewFeedbackProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className="items-center justify-center gap-3 rounded-2xl px-4 py-6"
      style={{ backgroundColor: colors.app.cardPrimary }}
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-2xl"
        style={{ backgroundColor: colors.app.cardSecondary }}
      >
        <Icon size={20} color={colors.app.textAccent} />
      </View>

      <View className="items-center">
        <ThemedText type="default" variant="accent">
          {title}
        </ThemedText>

        <ThemedText type="small" variant="primary" className="text-center">
          {subtitle}
        </ThemedText>
      </View>

      {action ? (
        <AppButton
          title={action.title}
          icon={action.icon}
          variant="outline"
          className="w-28"
          onPress={action.onPress}
        />
      ) : null}
    </View>
  );
}

function WorkoutPreviewEmpty() {
  return (
    <WorkoutPreviewFeedback
      icon={Dumbbell}
      title="No workouts found"
      subtitle="Explore another muscle group to find a workout."
    />
  );
}

function WorkoutPreviewError({ onRetry }: { onRetry?: () => void }) {
  return (
    <WorkoutPreviewFeedback
      icon={CircleAlert}
      title="Failed to load workouts"
      subtitle="Something went wrong. Please try again."
      action={
        onRetry
          ? {
              title: "Retry",
              icon: RefreshCw,
              onPress: onRetry,
            }
          : undefined
      }
    />
  );
}

function WorkoutPreviewCardList({
  items,
}: {
  items: WorkoutPreviewCardItem[];
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: 12,
        paddingHorizontal: CONTENT_PADDING_HORIZONTAL,
      }}
    >
      {items.map((workout) => (
        <WorkoutPreviewCard key={workout.id} item={workout} />
      ))}
    </ScrollView>
  );
}

export function WorkoutPreviewCard({ item }: { item: WorkoutPreviewCardItem }) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      className="w-56 overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.app.cardPrimary }}
      onPress={item.action}
    >
      <View className="relative h-32">
        <Image
          source={{ uri: item.imageUrl ?? WORKOUT_IMAGE }}
          className="h-full w-full"
          resizeMode="cover"
        />

        <LinearGradient
          colors={["transparent", hexWithOpacity(colors.app.black, 80)]}
          locations={[0.4, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <View className="absolute bottom-0 left-0 right-0 p-2">
          {item.metaItems && item.metaItems.length > 0 ? (
            <View className="flex-row flex-wrap gap-2">
              {item.metaItems.map((metaItem) => (
                <WorkoutMetaPill
                  key={metaItem.label}
                  icon={metaItem.icon}
                  label={metaItem.label}
                  variant="overlay"
                />
              ))}
            </View>
          ) : null}
        </View>
      </View>

      <View className="flex-row items-end justify-between gap-2 p-3">
        <View className="flex-1">
          {item.subtitle ? (
            <ThemedText type="extraSmall" variant="primary" numberOfLines={1}>
              {item.subtitle}
            </ThemedText>
          ) : null}

          <ThemedText type="default" variant="accent" numberOfLines={1}>
            {item.title}
          </ThemedText>
        </View>

        <AppButton
          variant="tertiary"
          icon={Heart}
          className="h-9 w-9"
          shape="pill"
          onPress={item.favoriteAction}
        />
      </View>
    </Pressable>
  );
}
