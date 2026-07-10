import { ReactNode, useEffect, useRef } from "react";
import { View } from "react-native";
import PagerView from "react-native-pager-view";
import { ProgressTab } from "../../elements/ProgressTabs";

const PROGRESS_TABS: ProgressTab[] = ["overview", "history"];

type ProgressPagerProps = {
  activeTab: ProgressTab;
  onChangeTab: (tab: ProgressTab) => void;
  overviewContent: ReactNode;
  historyContent: ReactNode;
};

export function ProgressPager({
  activeTab,
  onChangeTab,
  overviewContent,
  historyContent,
}: ProgressPagerProps) {
  const pagerRef = useRef<PagerView>(null);

  const activeTabIndex = PROGRESS_TABS.indexOf(activeTab);

  useEffect(() => {
    if (activeTabIndex < 0) return;

    pagerRef.current?.setPage(activeTabIndex);
  }, [activeTabIndex]);

  return (
    <PagerView
      ref={pagerRef}
      initialPage={activeTabIndex}
      style={{ flex: 1 }}
      onPageSelected={(event) => {
        const nextTab = PROGRESS_TABS[event.nativeEvent.position];

        if (!nextTab || nextTab === activeTab) return;

        onChangeTab(nextTab);
      }}
    >
      <View key="overview" className="flex-1">
        {overviewContent}
      </View>

      <View key="history" className="flex-1">
        {historyContent}
      </View>
    </PagerView>
  );
}
