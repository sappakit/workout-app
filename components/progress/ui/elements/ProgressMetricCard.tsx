import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { LucideIcon } from "lucide-react-native";
import React from "react";
import { FlatList, View } from "react-native";

export interface ProgressMetricCardItem {
  id: number | string;
  title: string;
  subtitle: string;
  rightText?: string;
  icon: LucideIcon;
  list: { label: string; value: string }[];
}

interface ProgressMetricCardProps {
  item: ProgressMetricCardItem;
  columns?: number;
}

export function ProgressMetricCard({
  item,
  columns = 3,
}: ProgressMetricCardProps) {
  const { colors } = useAppTheme();
  const Icon = item.icon;

  return (
    <View
      className="gap-2 rounded-2xl border p-2"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: colors.app.cardSecondary }}
        >
          <Icon size={20} color={colors.app.brand} />
        </View>

        <View className="flex-1">
          <ThemedText type="default" variant="accent" className="text-xs">
            {item.subtitle}
          </ThemedText>

          <ThemedText type="defaultSemiBold" variant="brand">
            {item.title}
          </ThemedText>
        </View>

        {item.rightText ? (
          <ThemedText
            type="defaultSemiBold"
            className="self-start p-1 text-xs"
            style={{ color: colors.app.textPrimary }}
          >
            {item.rightText}
          </ThemedText>
        ) : null}
      </View>

      <ProgressMetricList list={item.list} columns={columns} />
    </View>
  );
}

function ProgressMetricList({
  list,
  columns,
}: {
  list: ProgressMetricCardItem["list"];
  columns: number;
}) {
  return (
    <FlatList
      data={list}
      keyExtractor={(item) => item.label}
      numColumns={columns}
      scrollEnabled={false}
      columnWrapperClassName="gap-2"
      contentContainerClassName="gap-2"
      renderItem={({ item }) => (
        <MiniMetric label={item.label} value={item.value} />
      )}
    />
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-1 rounded-xl px-3 py-2"
      style={{ backgroundColor: colors.app.cardSecondary }}
    >
      <ThemedText type="default" variant="primary" className="text-xs">
        {label}
      </ThemedText>

      <ThemedText type="default" variant="accent">
        {value}
      </ThemedText>
    </View>
  );
}
