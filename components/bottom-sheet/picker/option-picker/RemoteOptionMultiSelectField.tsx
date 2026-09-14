import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { MetaPill, MetaPillList } from "@/components/custom-ui/MetaPill";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { FormSelectTrigger } from "@/components/form/FormSelectTrigger";
import { useAppColors } from "@/hooks/useAppColors";
import { useState } from "react";
import { Pressable, View } from "react-native";
import type { OptionPickerValue } from "./OptionPickerPage";
import {
  RemoteOptionPickerBottomSheet,
  type RemoteOptionPickerBottomSheetProps,
} from "./RemoteOptionPickerBottomSheet";

const MAX_VISIBLE_SELECTED_OPTIONS = 3;

type RemoteOptionMultiSelectFieldProps<
  TItem,
  TValue extends OptionPickerValue = number,
> = Omit<
  Extract<
    RemoteOptionPickerBottomSheetProps<TItem, TValue>,
    { selectionMode: "multiple" }
  >,
  "selectionMode" | "trigger"
> & {
  placeholder?: string;
  selectedSingularLabel?: string;
  selectedPluralLabel?: string;
  disabled?: boolean;
  error?: boolean;
};

export function RemoteOptionMultiSelectField<
  TItem,
  TValue extends OptionPickerValue = number,
>({
  value,
  onChange,
  placeholder = "Select options",
  selectedSingularLabel = "option selected",
  selectedPluralLabel = "options selected",
  disabled = false,
  error = false,
  ...pickerProps
}: RemoteOptionMultiSelectFieldProps<TItem, TValue>) {
  const colors = useAppColors();

  const [showAll, setShowAll] = useState(false);

  const handleRemove = (optionValue: TValue) => {
    if (disabled) {
      return;
    }

    onChange(value.filter((item) => item !== optionValue));
  };

  return (
    <RemoteOptionPickerBottomSheet<TItem, TValue>
      {...pickerProps}
      selectionMode="multiple"
      value={value}
      onChange={onChange}
      trigger={({ open, selectedOptions }) => {
        const selectedPillOptions = selectedOptions.map((option) => ({
          ...option,
          key: option.value,
        }));

        const selectedLabel =
          selectedOptions.length === 0
            ? placeholder
            : selectedOptions.length === 1
              ? `1 ${selectedSingularLabel}`
              : `${selectedOptions.length} ${selectedPluralLabel}`;

        const visibleCount = showAll
          ? selectedPillOptions.length
          : MAX_VISIBLE_SELECTED_OPTIONS;

        return (
          <View className="gap-2">
            <FormSelectTrigger
              label={selectedLabel}
              placeholder={selectedOptions.length === 0}
              onPress={open}
              disabled={disabled}
              error={error}
            />

            {selectedOptions.length > 0 ? (
              <View>
                {selectedOptions.length > MAX_VISIBLE_SELECTED_OPTIONS ? (
                  <Pressable
                    className="mb-2 flex-row items-center gap-1 self-start active:opacity-80"
                    onPress={() => setShowAll((previous) => !previous)}
                  >
                    <ThemedText type="small" tone="muted">
                      {showAll ? "Show less" : "Show all"}
                    </ThemedText>

                    <AppIcon
                      name={showAll ? "chevron-up" : "chevron-down"}
                      size="xs"
                      color={colors.mutedForeground}
                    />
                  </Pressable>
                ) : null}

                <MetaPillList
                  items={selectedPillOptions}
                  maxVisibleItems={visibleCount}
                  className={showAll ? "flex-wrap overflow-visible" : undefined}
                  renderItem={(option) => (
                    <MetaPill
                      label={option.label}
                      disabled={disabled}
                      onRemove={() => handleRemove(option.value)}
                    />
                  )}
                />
              </View>
            ) : null}
          </View>
        );
      }}
    />
  );
}
