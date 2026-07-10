import { ReactNode } from "react";
import { View } from "react-native";
import { ProgressTab } from "../../elements/ProgressTabs";

type ProgressPagerProps = {
  activeTab: ProgressTab;
  onChangeTab: (tab: ProgressTab) => void;
  overviewContent: ReactNode;
  historyContent: ReactNode;
};

export function ProgressPager({
  activeTab,
  overviewContent,
  historyContent,
}: ProgressPagerProps) {
  return (
    <View className="flex-1">
      {activeTab === "overview" ? overviewContent : historyContent}
    </View>
  );
}
