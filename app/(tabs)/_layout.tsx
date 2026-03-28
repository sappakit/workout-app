import { HapticTab } from "@/components/haptic-tab";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Tabs } from "expo-router";
import { Dumbbell, Home } from "lucide-react-native";
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
    </Tabs>
  );
}
