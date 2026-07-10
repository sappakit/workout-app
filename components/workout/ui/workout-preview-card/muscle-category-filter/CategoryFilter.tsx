import { AppButton } from "@/components/custom-ui/AppButton";
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
        className="h-8 px-6"
        title={allLabel}
        variant={isAllActive ? "primary" : "secondary"}
        shape="pill"
        onPress={() => onChange([])}
      />

      {options.map((option) => {
        const isActive = selectedValues.includes(option.value);

        return (
          <AppButton
            key={String(option.value)}
            className="h-8 px-6"
            title={option.label}
            variant={isActive ? "primary" : "secondary"}
            shape="pill"
            onPress={() => handleSelect(option.value)}
          />
        );
      })}
    </ScrollView>
  );
}
