import { HapticTab } from "@/components/haptic-tab";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Tabs } from "expo-router";
import {
  ChartNoAxesColumnIncreasing,
  Dumbbell,
  Home,
  User,
} from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,

        // Active/inactive icon + label colors
        tabBarActiveTintColor: colors.app.brand,
        tabBarInactiveTintColor: colors.app.textPrimary,

        // Tab bar container styling
        tabBarStyle: {
          backgroundColor: colors.app.cardPrimary,
          borderTopColor: colors.border,

          // Disable library shadow
          shadowColor: "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,

          // remove separator line
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Workout",
          tabBarIcon: ({ color, size }) => (
            <Dumbbell color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size }) => (
            <ChartNoAxesColumnIncreasing color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
