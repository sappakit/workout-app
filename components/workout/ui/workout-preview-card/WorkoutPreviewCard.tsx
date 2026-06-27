import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { WORKOUT_IMAGE } from "@/constants/images";
import { hexWithOpacity } from "@/constants/theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Heart, RefreshCw } from "lucide-react-native";
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
  return (
    <View className="gap-3">
      <MuscleCategoryFilter
        selectedMuscleIds={selectedMuscleIds}
        onChange={onChangeMuscleIds}
      />

      {isLoading ? (
        <WorkoutPreviewSectionSkeleton
          showHeader={false}
          showCategories={false}
        />
      ) : isError ? (
        <WorkoutPreviewError onRetry={onRetry} />
      ) : (
        <WorkoutPreviewCardList items={items} />
      )}
    </View>
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
      contentContainerClassName="gap-3"
    >
      {items.map((workout) => (
        <WorkoutPreviewCard key={workout.id} item={workout} />
      ))}
    </ScrollView>
  );
}

function WorkoutPreviewError({ onRetry }: { onRetry?: () => void }) {
  return (
    <View className="items-center justify-center gap-2 rounded-2xl py-4">
      <ThemedText type="small" variant="accent" className="text-center">
        Failed to load workouts.
      </ThemedText>

      {onRetry ? (
        <AppButton
          title="Retry"
          icon={RefreshCw}
          variant="secondary"
          className="w-28"
          onPress={onRetry}
        />
      ) : null}
    </View>
  );
}

interface WorkoutPreviewCardProps {
  item: WorkoutPreviewCardItem;
}

export function WorkoutPreviewCard({ item }: WorkoutPreviewCardProps) {
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

        {/* TODO: add favorite */}
        <AppButton
          variant="tertiary"
          icon={Heart}
          className="h-9 w-9"
          shape="pill"
          onPress={item.favoriteAction}
        />

        {/* <AppButton
          variant="tertiary"
          icon={ArrowUpRight}
          className="h-9 w-9 self-end"
          shape="pill"
          onPress={item.action}
        /> */}
      </View>
    </Pressable>
  );
}
