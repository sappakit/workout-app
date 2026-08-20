import { SectionHeader } from "@/components/layout/SectionHeader";
import { useAppColors } from "@/hooks/useAppTheme";
import { ActivityIndicator, FlatList, View } from "react-native";
import {
  RecentWorkoutCard,
  type RecentWorkoutCardItem,
} from "./RecentWorkoutCard";

interface ProgressHistorySectionProps {
  data: RecentWorkoutCardItem[];
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export function ProgressHistorySection({
  data,
  isFetchingNextPage,
  onLoadMore,
}: ProgressHistorySectionProps) {
  const colors = useAppColors();

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      contentContainerClassName="gap-3 p-4"
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <SectionHeader
          title="Recent Workouts"
          subtitle="Your completed workout history"
        />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="items-center py-4">
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null
      }
      renderItem={({ item }) => <RecentWorkoutCard item={item} />}
    />
  );
}
