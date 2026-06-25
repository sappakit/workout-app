import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import clsx from "clsx";
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { FilterOptionPageHeader } from "./option-page/FilterOptionPage";

export type SortDirection = "ASC" | "DESC";

export type SortOption<TValue extends string = string> = {
  value: TValue;
  label: string;
  icon?: LucideIcon;
  ascLabel?: string;
  descLabel?: string;
};

type FilterSortPageProps<TValue extends string = string> = {
  title: string;
  options: SortOption<TValue>[];
  selectedSortBy: TValue | null;
  sortDirection: SortDirection;
  bottomInset: number;
  onBack: () => void;
  onChangeSortBy: (value: TValue) => void;
  onChangeSortDirection: (direction: SortDirection) => void;
};

export function FilterSortPage<TValue extends string = string>({
  title,
  options,
  selectedSortBy,
  sortDirection,
  bottomInset,
  onBack,
  onChangeSortBy,
  onChangeSortDirection,
}: FilterSortPageProps<TValue>) {
  const { colors } = useAppTheme();

  const handleToggleDirection = () => {
    onChangeSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
  };

  return (
    <View className="gap-4 px-4" style={{ paddingBottom: bottomInset + 20 }}>
      <FilterOptionPageHeader title={title} onBack={onBack} />

      <View
        className="overflow-hidden rounded-2xl"
        style={{ backgroundColor: colors.app.cardSecondary }}
      >
        {options.map((option, index) => {
          const selected = selectedSortBy === option.value;
          const Icon = option.icon;
          const isFirstItem = index === 0;
          const isLastItem = index === options.length - 1;

          return (
            <View
              key={option.value}
              className={clsx(
                "flex-row items-center gap-3 px-4 py-4",
                !isFirstItem && "border-t",
                isFirstItem && "rounded-t-2xl",
                isLastItem && "rounded-b-2xl",
              )}
              style={{
                backgroundColor: colors.app.cardSecondary,
                borderColor: colors.app.borderPrimary,
              }}
            >
              <Pressable
                onPress={() => onChangeSortBy(option.value)}
                className="flex-1 flex-row items-center gap-3"
              >
                {Icon ? (
                  <Icon
                    size={20}
                    color={
                      selected ? colors.app.brand : colors.app.textSecondary
                    }
                  />
                ) : null}

                <ThemedText
                  type="default"
                  variant={selected ? "brand" : "accent"}
                  className="flex-1"
                >
                  {option.label}
                </ThemedText>
              </Pressable>

              {selected ? (
                <Pressable
                  hitSlop={12}
                  onPress={handleToggleDirection}
                  className="flex-row items-center gap-1 rounded-full"
                >
                  <ThemedText type="small" variant="secondary">
                    {getSortDirectionLabel(option, sortDirection)}
                  </ThemedText>

                  {sortDirection === "ASC" ? (
                    <ArrowUp size={16} color={colors.app.brand} />
                  ) : (
                    <ArrowDown size={16} color={colors.app.brand} />
                  )}
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </View>
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
