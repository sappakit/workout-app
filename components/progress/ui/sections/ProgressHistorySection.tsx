import { SectionHeader } from "@/components/layout/SectionHeader";
import { ProgressMetricCard } from "@/components/progress/ui/elements/ProgressMetricCard";
import { ActivityIndicator, FlatList, View } from "react-native";
import { ProgressMetricCardItem } from "../elements/ProgressMetricCard";

interface ProgressHistorySectionProps {
  data: ProgressMetricCardItem[];
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export function ProgressHistorySection({
  data,
  isFetchingNextPage,
  onLoadMore,
}: ProgressHistorySectionProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      contentContainerClassName="gap-3 px-4 pb-8 pt-3"
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
      ListHeaderComponent={
        <SectionHeader
          title="Recent Workouts"
          subtitle="Your completed workout history"
        />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-4">
            <ActivityIndicator />
          </View>
        ) : null
      }
      renderItem={({ item }) => <ProgressMetricCard item={item} />}
    />
  );
}
