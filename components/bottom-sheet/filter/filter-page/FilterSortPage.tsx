import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppColors";
import { cn } from "@/lib/utils";
import { Pressable, ScrollView, View } from "react-native";
import { OptionPickerPageHeader } from "../../picker/option-picker/OptionPickerPage";

export type SortDirection = "ASC" | "DESC";

export type SortOption<TValue extends string = string> = {
  value: TValue;
  label: string;
  icon?: AppIconName;
  ascLabel?: string;
  descLabel?: string;
};

type FilterSortPageProps<TValue extends string = string> = {
  title: string;
  options: SortOption<TValue>[];
  selectedSortBy: TValue | null;
  sortDirection: SortDirection;
  onBack: () => void;
  onChangeSortBy: (value: TValue) => void;
  onChangeSortDirection: (direction: SortDirection) => void;
  bottomContentInset?: number;
};

export function FilterSortPage<TValue extends string = string>({
  title,
  options,
  selectedSortBy,
  sortDirection,
  onBack,
  onChangeSortBy,
  onChangeSortDirection,
  bottomContentInset = 0,
}: FilterSortPageProps<TValue>) {
  const colors = useAppColors();

  const handleToggleDirection = () => {
    onChangeSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
  };

  return (
    <View className="flex-1 gap-4">
      <OptionPickerPageHeader title={title} onBack={onBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: bottomContentInset,
        }}
      >
        <View className="overflow-hidden rounded-2xl bg-secondary">
          {options.map((option, index) => {
            const selected = selectedSortBy === option.value;

            const isFirstItem = index === 0;
            const isLastItem = index === options.length - 1;

            return (
              <View
                key={option.value}
                className={cn(
                  "flex-row items-center gap-3 bg-secondary px-4 py-4",
                  !isFirstItem && "border-t border-border",
                  isFirstItem && "rounded-t-2xl",
                  isLastItem && "rounded-b-2xl",
                )}
              >
                <Pressable
                  onPress={() => onChangeSortBy(option.value)}
                  className="flex-1 flex-row items-center gap-3 active:opacity-80"
                >
                  {option.icon ? (
                    <AppIcon
                      name={option.icon}
                      variant="outline"
                      size="md"
                      color={selected ? colors.primary : colors.mutedForeground}
                    />
                  ) : null}

                  <ThemedText
                    type="body"
                    tone={selected ? "primary" : "default"}
                    className="flex-1"
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>

                {selected ? (
                  <Pressable
                    hitSlop={12}
                    onPress={handleToggleDirection}
                    className="flex-row items-center gap-1 rounded-full active:opacity-80"
                  >
                    <ThemedText type="small" tone="muted">
                      {getSortDirectionLabel(option, sortDirection)}
                    </ThemedText>

                    <AppIcon
                      name={
                        sortDirection === "ASC" ? "chevron-up" : "chevron-down"
                      }
                      size="sm"
                      color={colors.primary}
                    />
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

export function getSortDirectionLabel<TValue extends string>(
  option: SortOption<TValue>,
  direction: SortDirection,
) {
  if (direction === "ASC") {
    return option.ascLabel ?? "Low to high";
  }

  return option.descLabel ?? "High to low";
}
