import type { AppIconName } from "@/components/custom-ui/app-icon/app-icon.registry";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { useAppColors } from "@/hooks/useAppTheme";
import { Pressable, View } from "react-native";

export type ProgressTab = "overview" | "history";

const tabs: {
  label: string;
  value: ProgressTab;
  icon: AppIconName;
}[] = [
  {
    label: "Overview",
    value: "overview",
    icon: "progress",
  },
  {
    label: "History",
    value: "history",
    icon: "history",
  },
];

interface ProgressTabsProps {
  activeTab: ProgressTab;
  onChangeTab: (tab: ProgressTab) => void;
}

export function ProgressTabs({ activeTab, onChangeTab }: ProgressTabsProps) {
  const colors = useAppColors();

  return (
    <View className="h-12 flex-row">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        const contentColor = isActive ? colors.primary : colors.mutedForeground;

        return (
          <Pressable
            key={tab.value}
            onPress={() => onChangeTab(tab.value)}
            className="flex-1 flex-row items-center justify-center gap-2 border-b-2 active:opacity-80"
            style={{
              borderBottomColor: isActive ? colors.primary : colors.border,
            }}
          >
            <AppIcon name={tab.icon} size="sm" color={contentColor} />

            <ThemedText
              type="label"
              numberOfLines={1}
              style={{
                color: contentColor,
              }}
            >
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}
