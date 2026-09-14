import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import FormCheckbox from "@/components/form/FormCheckbox";
import { useAppColors } from "@/hooks/useAppColors";
import { cn } from "@/lib/utils";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import type { ListRenderItem } from "react-native";
import { Pressable, View } from "react-native";

export type OptionPickerValue = string | number;

export type OptionPickerOption<
  TValue extends OptionPickerValue = OptionPickerValue,
> = {
  value: TValue;
  label: string;
};

type BaseOptionPickerPageProps<
  TValue extends OptionPickerValue = OptionPickerValue,
> = {
  title: string;
  options: OptionPickerOption<TValue>[];
  onBack?: () => void;
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
  bottomContentInset?: number;
};

export type OptionPickerPageProps<
  TValue extends OptionPickerValue = OptionPickerValue,
> =
  | (BaseOptionPickerPageProps<TValue> & {
      selectionMode: "multiple";
      value: TValue[];
      onChange: (value: TValue[]) => void;
    })
  | (BaseOptionPickerPageProps<TValue> & {
      selectionMode: "single";
      value: TValue | null;
      onChange: (value: TValue | null) => void;
    });

export function OptionPickerPage<
  TValue extends OptionPickerValue = OptionPickerValue,
>(props: OptionPickerPageProps<TValue>) {
  const handleSelect = (value: TValue) => {
    if (props.selectionMode === "multiple") {
      const nextValue = props.value.includes(value)
        ? props.value.filter((selectedValue) => selectedValue !== value)
        : [...props.value, value];

      props.onChange(nextValue);
      return;
    }

    props.onChange(value);
  };

  const isSelected = (value: TValue) => {
    if (props.selectionMode === "multiple") {
      return props.value.includes(value);
    }

    return props.value === value;
  };

  const renderItem: ListRenderItem<OptionPickerOption<TValue>> = ({
    item,
    index,
  }) => {
    const selected = isSelected(item.value);

    const isFirstItem = index === 0;
    const isLastItem = index === props.options.length - 1;

    return (
      <Pressable
        onPress={() => handleSelect(item.value)}
        className={cn(
          "flex-row items-center gap-3 bg-secondary px-4 py-4 active:opacity-80",
          index > 0 && "border-t border-border",
          isFirstItem && "rounded-t-2xl",
          isLastItem && "rounded-b-2xl",
        )}
      >
        <FormCheckbox
          value={selected}
          onChange={() => handleSelect(item.value)}
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
    <View className="flex-1 gap-4">
      <OptionPickerPageHeader title={props.title} onBack={props.onBack} />

      <BottomSheetFlatList
        data={props.options}
        keyExtractor={(item: OptionPickerOption<TValue>) => String(item.value)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReached={props.onEndReached}
        onEndReachedThreshold={0.4}
        contentContainerStyle={{
          paddingBottom: props.bottomContentInset ?? 0,
        }}
        ListFooterComponent={listFooterComponent}
      />
    </View>
  );
}

export function OptionPickerPageHeader({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  const colors = useAppColors();

  const content = (
    <>
      {onBack && <AppIcon name="back" size="md" color={colors.foreground} />}

      <ThemedText type="heading">{title}</ThemedText>
    </>
  );

  return onBack ? (
    <Pressable
      onPress={onBack}
      className="flex-row items-center gap-2 active:opacity-80"
    >
      {content}
    </Pressable>
  ) : (
    <View className="flex-row items-center gap-2">{content}</View>
  );
}
