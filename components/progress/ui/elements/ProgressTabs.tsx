import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { History, LayoutDashboard, LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

export type ProgressTab = "overview" | "history";

const tabs: { label: string; value: ProgressTab; icon: LucideIcon }[] = [
  { label: "Overview", value: "overview", icon: LayoutDashboard },
  { label: "History", value: "history", icon: History },
];

interface ProgressTabsProps {
  activeTab: ProgressTab;
  onChangeTab: (tab: ProgressTab) => void;
}

export function ProgressTabs({ activeTab, onChangeTab }: ProgressTabsProps) {
  const { colors } = useAppTheme();

  return (
    <View className="h-12 flex-row">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        const Icon = tab.icon;
        const textColor = isActive ? colors.app.brand : colors.app.textPrimary;

        return (
          <Pressable
            key={tab.value}
            onPress={() => onChangeTab(tab.value)}
            className="flex-1 flex-row items-center justify-center gap-2 border-b-2"
            style={{
              borderColor: isActive
                ? colors.app.brand
                : colors.app.borderPrimary,
            }}
          >
            <Icon size={16} color={textColor} />

            <ThemedText
              type="defaultSemiBold"
              className="text-sm"
              style={{ color: textColor }}
            >
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}
