import WorkoutTimerBottomSheet from "@/components/bottom-sheet/workout-timer/WorkoutTimerBottomSheet";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { HapticTab } from "@/components/haptic-tab";
import { AppLoadingScreen } from "@/components/state/AppLoadingScreen";
import { WorkoutSessionSync } from "@/components/workout-in-progress/WorkoutSessionSync";
import { useAuth } from "@/context/AuthContext";
import { useAppColors } from "@/hooks/useAppColors";
import { Redirect, Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_BASE_HEIGHT = 64;
const WORKOUT_TIMER_SHEET_TAB_OVERLAP = 1;

export default function TabLayout() {
  const { user, loading } = useAuth();
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  const tabBarHeight = TAB_BAR_BASE_HEIGHT + insets.bottom;

  const sheetBottomInset = Math.max(
    0,
    tabBarHeight - WORKOUT_TIMER_SHEET_TAB_OVERLAP,
  );

  // Block tabs before auth is restored
  if (loading) {
    return <AppLoadingScreen />;
  }

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,

          // Active/inactive icon and label colors
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.mutedForeground,

          // Tab bar container
          tabBarStyle: {
            height: tabBarHeight,
            paddingTop: 8,
            paddingBottom: insets.bottom,
            backgroundColor: colors.card,
            borderTopColor: colors.border,

            // Disable library shadow
            shadowColor: "transparent",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,

            // Remove separator line
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused, color }) => (
              <AppIcon
                name="home"
                variant={focused ? "filled" : "outline"}
                color={color}
                size="lg"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="workout"
          options={{
            title: "Workout",
            tabBarIcon: ({ focused, color }) => (
              <AppIcon
                name="workout"
                variant={focused ? "filled" : "outline"}
                color={color}
                size="lg"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="progress"
          options={{
            title: "Progress",
            tabBarIcon: ({ focused, color }) => (
              <AppIcon
                name="progress"
                variant={focused ? "filled" : "outline"}
                color={color}
                size="lg"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused, color }) => (
              <AppIcon
                name="profile"
                variant={focused ? "filled" : "outline"}
                color={color}
                size="lg"
              />
            ),
          }}
        />
      </Tabs>

      <WorkoutSessionSync />

      <WorkoutTimerBottomSheet bottomInset={sheetBottomInset} />
    </>
  );
}
