import { useAppTheme } from "@/hooks/useAppTheme";
import {
  BicepsFlexed,
  Flame,
  Timer,
  type LucideIcon,
} from "lucide-react-native";
import { FlatList, View } from "react-native";
import { ThemedText } from "../themed-text";

type StatItem = {
  key: string;
  value: string;
  label: string;
  icon: LucideIcon;
};

const stats: StatItem[] = [
  {
    key: "completed",
    value: "23",
    label: "Completed\nWorkouts",
    icon: BicepsFlexed,
  },
  { key: "minutes", value: "240", label: "Minutes\nTotal time", icon: Timer },
  { key: "calories", value: "325", label: "Calories\nBurned", icon: Flame },
];

export function StatsGrid() {
  return (
    <FlatList
      data={stats}
      numColumns={3}
      keyExtractor={(item) => item.key}
      scrollEnabled={false}
      contentContainerStyle={{ gap: 12 }}
      columnWrapperStyle={{ gap: 12 }}
      renderItem={({ item }) => (
        <View style={{ flex: 1 }}>
          <StatCard value={item.value} label={item.label} icon={item.icon} />
        </View>
      )}
    />
  );
}

type StatCardProps = {
  value: string;
  label: string;
  icon: LucideIcon;
};

function StatCard({ value, label, icon: Icon }: StatCardProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className="items-center rounded-2xl border p-4"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      <Icon size={24} color={colors.app.brand} />

      <ThemedText type="title" variant="accent" className="mt-2">
        {value}
      </ThemedText>

      <ThemedText
        type="default"
        variant="primary"
        className="mt-1 text-center text-xs"
      >
        {label}
      </ThemedText>
    </View>
  );
}
