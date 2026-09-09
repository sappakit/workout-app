import { AppButton } from "@/components/custom-ui/app-button";
import { CONTENT_PADDING_HORIZONTAL } from "@/constants/page-layout.constants";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PickerBottomSheet } from "../PickerBottomSheet";
import {
  type OptionPickerOption,
  type OptionPickerValue,
} from "./OptionPickerPage";
import {
  RemoteOptionPickerPage,
  type RemoteOptionPickerPageProps,
} from "./RemoteOptionPickerPage";

export type RemoteOptionPickerBottomSheetProps<
  TItem,
  TValue extends OptionPickerValue,
> = RemoteOptionPickerPageProps<TItem, TValue> & {
  trigger: (props: {
    open: () => void;
    selectedOption: OptionPickerOption<TValue> | undefined;
    selectedOptions: OptionPickerOption<TValue>[];
  }) => ReactNode;

  doneText?: string;
};

export function RemoteOptionPickerBottomSheet<
  TItem,
  TValue extends OptionPickerValue = number,
>({
  trigger,
  doneText = "Done",
  ...pickerProps
}: RemoteOptionPickerBottomSheetProps<TItem, TValue>) {
  const insets = useSafeAreaInsets();

  const [options, setOptions] = useState<OptionPickerOption<TValue>[]>([]);
  const [footerHeight, setFooterHeight] = useState(0);

  const handleOptionsChange = useCallback(
    (nextOptions: OptionPickerOption<TValue>[]) => {
      setOptions(nextOptions);
    },
    [],
  );

  const selectedOptions = useMemo(() => {
    if (pickerProps.selectionMode === "multiple") {
      const selectedValues = new Set(pickerProps.value);

      return options.filter((option) => selectedValues.has(option.value));
    }

    if (pickerProps.value === null) {
      return [];
    }

    const selectedOption = options.find(
      (option) => option.value === pickerProps.value,
    );

    return selectedOption ? [selectedOption] : [];
  }, [options, pickerProps]);

  const selectedOption = selectedOptions[0];

  const bottomContentInset =
    footerHeight > 0 ? footerHeight + CONTENT_PADDING_HORIZONTAL : 0;

  return (
    <PickerBottomSheet
      trigger={({ open }) =>
        trigger({
          open,
          selectedOption,
          selectedOptions,
        })
      }
      footer={({ close, isReady }) => (
        <View
          className="bg-popover px-4 pt-3"
          style={{
            paddingBottom: insets.bottom + CONTENT_PADDING_HORIZONTAL,
          }}
          onLayout={(event) => {
            setFooterHeight(event.nativeEvent.layout.height);
          }}
        >
          <AppButton
            title={doneText}
            variant="primary"
            icon={{
              name: "check",
              size: "sm",
            }}
            disabled={!isReady}
            onPress={close}
          />
        </View>
      )}
    >
      <View className="flex-1 px-4">
        {pickerProps.selectionMode === "multiple" ? (
          <RemoteOptionPickerPage
            {...pickerProps}
            selectionMode="multiple"
            bottomContentInset={bottomContentInset}
            onOptionsChange={handleOptionsChange}
          />
        ) : (
          <RemoteOptionPickerPage
            {...pickerProps}
            selectionMode="single"
            bottomContentInset={bottomContentInset}
            onOptionsChange={handleOptionsChange}
          />
        )}
      </View>
    </PickerBottomSheet>
  );
}
