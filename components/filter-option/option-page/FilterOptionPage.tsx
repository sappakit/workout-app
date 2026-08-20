import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import FormCheckbox from "@/components/form/FormCheckbox";
import { useAppColors } from "@/hooks/useAppTheme";
import { cn } from "@/lib/utils";
import type { ListRenderItem } from "react-native";
import { Pressable, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export type FilterOption<TId extends string | number = number> = {
  id: TId;
  label: string;
};

type BaseFilterOptionPageProps<TId extends string | number = number> = {
  title: string;
  options: FilterOption<TId>[];
  bottomInset: number;
  onBack: () => void;
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
};

export type FilterOptionPageProps<TId extends string | number = number> =
  | (BaseFilterOptionPageProps<TId> & {
      selectionMode: "multiple";
      selectedIds: TId[];
      onChangeSelectedIds: (ids: TId[]) => void;
    })
  | (BaseFilterOptionPageProps<TId> & {
      selectionMode: "single";
      selectedId: TId | null;
      onChangeSelectedId: (id: TId | null) => void;
    });

export function FilterOptionPage<TId extends string | number = number>(
  props: FilterOptionPageProps<TId>,
) {
  const handleSelect = (id: TId) => {
    if (props.selectionMode === "multiple") {
      const nextSelectedIds = props.selectedIds.includes(id)
        ? props.selectedIds.filter((selectedId) => selectedId !== id)
        : [...props.selectedIds, id];

      props.onChangeSelectedIds(nextSelectedIds);
      return;
    }

    props.onChangeSelectedId(id);
  };

  const isSelected = (id: TId) => {
    if (props.selectionMode === "multiple") {
      return props.selectedIds.includes(id);
    }

    return props.selectedId === id;
  };

  const renderItem: ListRenderItem<FilterOption<TId>> = ({ item, index }) => {
    const selected = isSelected(item.id);

    const isFirstItem = index === 0;
    const isLastItem = index === props.options.length - 1;

    return (
      <Pressable
        onPress={() => handleSelect(item.id)}
        className={cn(
          "flex-row items-center gap-3 bg-secondary px-4 py-4 active:opacity-80",
          index > 0 && "border-t border-border",
          isFirstItem && "rounded-t-2xl",
          isLastItem && "rounded-b-2xl",
        )}
      >
        <FormCheckbox
          value={selected}
          onChange={() => handleSelect(item.id)}
          selectionMode={props.selectionMode}
          className="pointer-events-none"
        />

        <ThemedText
          type="small"
          tone={selected ? "primary" : "default"}
          className="flex-1"
        >
          {item.label}
        </ThemedText>
      </Pressable>
    );
  };

  const listFooterComponent = props.isFetchingNextPage ? (
    <View className="py-4">
      <ThemedText type="small" tone="muted" className="text-center">
        Loading more...
      </ThemedText>
    </View>
  ) : null;

  return (
    <View className="gap-4 px-4">
      <FilterOptionPageHeader title={props.title} onBack={props.onBack} />

      <FlatList
        data={props.options}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReached={props.onEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={listFooterComponent}
        contentContainerStyle={{
          paddingBottom: props.bottomInset + 20,
        }}
      />
    </View>
  );
}

export function FilterOptionPageHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  const colors = useAppColors();

  return (
    <Pressable
      onPress={onBack}
      className="flex-row items-center gap-2 self-start active:opacity-80"
    >
      <AppIcon name="back" size="md" color={colors.foreground} />

      <ThemedText type="heading">{title}</ThemedText>
    </Pressable>
  );
}
