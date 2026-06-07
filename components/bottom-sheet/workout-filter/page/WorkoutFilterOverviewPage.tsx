import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import {
  BicepsFlexed,
  ChevronRight,
  ListFilter,
  LucideIcon,
  SlidersHorizontal,
  Sparkles,
  Target,
  Undo2,
} from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";

type WorkoutFilterOverviewPageProps = {
  bottomInset: number;
  selectedFilterCount: number;
  focusSummary: string;
  muscleSummary: string;
  sortSummary: string;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
  onOpenFocus: () => void;
  onOpenMuscle: () => void;
  onOpenSort: () => void;
};

export function WorkoutFilterOverviewPage({
  bottomInset,
  selectedFilterCount,
  focusSummary,
  muscleSummary,
  sortSummary,
  onClose,
  onReset,
  onApply,
  onOpenFocus,
  onOpenMuscle,
  onOpenSort,
}: WorkoutFilterOverviewPageProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-1 gap-4 px-4"
      style={{ paddingBottom: bottomInset + 20 }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View
            className="h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: colors.app.cardSecondary }}
          >
            <SlidersHorizontal size={20} color={colors.app.textAccent} />
          </View>

          <View>
            <ThemedText type="subtitle" variant="accent">
              Workout filters
            </ThemedText>

            <ThemedText type="small" variant="primary">
              {selectedFilterCount > 0
                ? `${selectedFilterCount} filters selected`
                : "Find the right workout faster"}
            </ThemedText>
          </View>
        </View>

        {/* <View className="flex-row items-center gap-2">
          <Pressable
            onPress={onReset}
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.app.cardSecondary }}
          >
            <RotateCcw size={17} color={colors.app.textPrimary} />
          </Pressable>

          <Pressable
            onPress={onClose}
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.app.cardSecondary }}
          >
            <X size={18} color={colors.app.textPrimary} />
          </Pressable>
        </View> */}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        <WorkoutFilterNavigationItem
          icon={Target}
          title="Workout focus"
          description={focusSummary}
          onPress={onOpenFocus}
        />

        <WorkoutFilterNavigationItem
          icon={BicepsFlexed}
          title="Target muscles"
          description={muscleSummary}
          onPress={onOpenMuscle}
        />

        <WorkoutFilterNavigationItem
          icon={Sparkles}
          title="Sort by"
          description={sortSummary}
          onPress={onOpenSort}
        />
      </ScrollView>

      <View className="mt-auto flex-row gap-3">
        <AppButton
          title="Reset"
          icon={Undo2}
          variant="outline"
          className="flex-1"
          onPress={onReset}
        />

        <AppButton
          title="Apply filters"
          icon={ListFilter}
          variant="primary"
          className="flex-1"
          onPress={onApply}
        />
      </View>
    </View>
  );
}

function WorkoutFilterNavigationItem({
  icon: Icon,
  title,
  description,
  onPress,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl p-4"
      style={{ backgroundColor: colors.app.cardSecondary }}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: colors.app.cardPrimary }}
        >
          <Icon size={18} color={colors.app.textAccent} />
        </View>

        <View className="flex-1">
          <ThemedText type="defaultSemiBold" variant="accent">
            {title}
          </ThemedText>

          <ThemedText type="extraSmall" variant="primary" numberOfLines={1}>
            {description}
          </ThemedText>
        </View>

        <ChevronRight size={18} color={colors.app.textPrimary} />
      </View>
    </Pressable>
  );
}
