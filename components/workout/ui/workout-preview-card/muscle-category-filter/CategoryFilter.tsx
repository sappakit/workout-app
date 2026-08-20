import { AppButton } from "@/components/custom-ui/app-button";
import { CONTENT_PADDING_HORIZONTAL } from "@/components/layout/PageLayout";
import { ScrollView } from "react-native";

export type CategoryFilterOption<TValue extends string | number = number> = {
  label: string;
  value: TValue;
};

interface CategoryFilterProps<TValue extends string | number = number> {
  options: CategoryFilterOption<TValue>[];
  selectedValues: TValue[];
  onChange: (values: TValue[]) => void;
  allLabel?: string;
}

export function CategoryFilter<TValue extends string | number = number>({
  options,
  selectedValues,
  onChange,
  allLabel = "All",
}: CategoryFilterProps<TValue>) {
  const isAllActive = selectedValues.length === 0;

  const handleSelect = (value: TValue) => {
    const isSelected = selectedValues.includes(value);

    if (isSelected) return;

    onChange([value]);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: 8,
        paddingHorizontal: CONTENT_PADDING_HORIZONTAL,
      }}
    >
      <AppButton
        title={allLabel}
        variant={isAllActive ? "contrast" : "secondary"}
        size="sm"
        className="h-8 rounded-full px-6"
        onPress={() => onChange([])}
      />

      {options.map((option) => {
        const isActive = selectedValues.includes(option.value);

        return (
          <AppButton
            key={String(option.value)}
            title={option.label}
            variant={isActive ? "contrast" : "secondary"}
            size="sm"
            className="h-8 rounded-full px-6"
            onPress={() => handleSelect(option.value)}
          />
        );
      })}
    </ScrollView>
  );
}
