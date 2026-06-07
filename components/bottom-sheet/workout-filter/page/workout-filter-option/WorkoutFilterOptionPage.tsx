import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { Check, ChevronLeft } from "lucide-react-native";
import { ListRenderItem, Pressable, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export type FilterOption = {
  id: number;
  label: string;
};

type BaseWorkoutFilterOptionPageProps = {
  title: string;
  options: FilterOption[];
  bottomInset: number;
  onBack: () => void;
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
};

type WorkoutFilterOptionPageProps =
  | (BaseWorkoutFilterOptionPageProps & {
      selectionMode: "multiple";
      selectedIds: number[];
      onChangeSelectedIds: (ids: number[]) => void;
    })
  | (BaseWorkoutFilterOptionPageProps & {
      selectionMode: "single";
      selectedId: number | null;
      onChangeSelectedId: (id: number | null) => void;
    });

export function WorkoutFilterOptionPage(props: WorkoutFilterOptionPageProps) {
  const { colors } = useAppTheme();

  const handleSelect = (id: number) => {
    if (props.selectionMode === "multiple") {
      const nextSelectedIds = props.selectedIds.includes(id)
        ? props.selectedIds.filter((selectedId) => selectedId !== id)
        : [...props.selectedIds, id];

      props.onChangeSelectedIds(nextSelectedIds);
      return;
    }

    props.onChangeSelectedId(id);
  };

  const isSelected = (id: number) => {
    if (props.selectionMode === "multiple") {
      return props.selectedIds.includes(id);
    }

    return props.selectedId === id;
  };

  const renderItem: ListRenderItem<FilterOption> = ({ item, index }) => {
    const selected = isSelected(item.id);
    const isFirstItem = index === 0;
    const isLastItem = index === props.options.length - 1;

    return (
      <Pressable
        onPress={() => handleSelect(item.id)}
        className={clsx(
          "flex-row items-center gap-3 px-4 py-4",
          index > 0 && "border-t",
          isFirstItem && "rounded-t-2xl",
          isLastItem && "rounded-b-2xl",
        )}
        style={{
          backgroundColor: colors.app.cardSecondary,
          borderColor: colors.app.borderPrimary,
        }}
      >
        <View
          className="h-5 w-5 items-center justify-center rounded-full border"
          style={{
            borderColor: selected
              ? colors.app.brand
              : colors.app.borderSecondary,
            backgroundColor: selected ? colors.app.brand : "transparent",
          }}
        >
          {selected && <Check size={13} color={colors.app.textWhite} />}
        </View>

        <ThemedText
          type="default"
          variant={selected ? "brand" : "accent"}
          className="flex-1"
        >
          {item.label}
        </ThemedText>
      </Pressable>
    );
  };

  const listFooterComponent = props.isFetchingNextPage ? (
    <View className="py-4">
      <ThemedText type="small" variant="primary" className="text-center">
        Loading more...
      </ThemedText>
    </View>
  ) : null;

  return (
    <View className="gap-4 px-4">
      <FilterOptionHeader title={props.title} onBack={props.onBack} />

      <FlatList
        data={props.options}
        keyExtractor={(item) => item.id.toString()}
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

export function FilterOptionHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <Pressable onPress={onBack} className="flex-row items-center gap-2">
      <View className="items-center justify-center">
        <ChevronLeft size={22} color={colors.app.textAccent} />
      </View>

      <ThemedText type="subtitle" variant="accent">
        {title}
      </ThemedText>
    </Pressable>
  );
}
