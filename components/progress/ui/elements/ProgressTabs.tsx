import { ProgressTab } from "@/components/progress/ProgressContent";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { History, LayoutDashboard, LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface ProgressTabsProps {
  activeTab: ProgressTab;
  onChangeTab: (tab: ProgressTab) => void;
}

export function ProgressTabs({ activeTab, onChangeTab }: ProgressTabsProps) {
  const { colors } = useAppTheme();

  const tabs: { label: string; value: ProgressTab; icon: LucideIcon }[] = [
    { label: "Overview", value: "overview", icon: LayoutDashboard },
    { label: "History", value: "history", icon: History },
  ];

  return (
    <View
      className="flex-row overflow-hidden rounded-xl border"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        const Icon = tab.icon;
        const textColor = isActive
          ? colors.app.textWhite
          : colors.app.textPrimary;

        return (
          <Pressable
            key={tab.value}
            onPress={() => onChangeTab(tab.value)}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-xl px-4 py-2.5"
            style={{
              backgroundColor: isActive ? colors.app.brand : "transparent",
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
