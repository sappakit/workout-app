import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { User as UserResponse } from "@/types/user/response/user.types";
import { useRouter } from "expo-router";
import {
  Activity,
  BarChart3,
  CircleHelp,
  Dumbbell,
  LockKeyhole,
  LogOut,
  Mail,
  MessageCircle,
  Shield,
  User,
} from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { ProfileAvatar } from "./ui/ProfileAvatar";
import { ProfileMenuItem, ProfileSection } from "./ui/ProfileMenu";
import { StatCard } from "./ui/StatCard";

interface ProfileContentProps {
  data: UserResponse;
}

export default function ProfileContent({ data }: ProfileContentProps) {
  const { colors } = useAppTheme();
  const { signOut } = useAuth();
  const router = useRouter();

  const fullName =
    `${data.profile?.firstName} ${data.profile?.lastName}`.trim();

  return (
    <PageLayout
      topInset={0}
      headerProps={{
        variant: "title",
        title: "Profile",
      }}
    >
      <View className="gap-4">
        {/* Profile header */}
        <View className="items-center">
          <View className="p-6">
            <ProfileAvatar
              image={data.profile?.imageUrl}
              onPressEdit={() => router.push("/(pages)/profile/edit")}
            />
          </View>

          <View className="items-center">
            <ThemedText type="subtitle" variant="accent">
              {fullName}
            </ThemedText>

            <View className="flex-row items-center gap-2">
              <Mail size={14} color={colors.app.textPrimary} />

              <ThemedText
                type="default"
                variant="secondary"
                className="text-sm"
                style={{
                  color: colors.app.textPrimary,
                }}
              >
                {data.email}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-2">
          <StatCard value="170 cm" label="Height" />
          <StatCard value="52" label="Weight" />
          <StatCard value="26" label="Age" />
        </View>

        <View className="gap-4">
          <ProfileSection title="Account">
            <ProfileMenuItem
              label="Personal Info"
              icon={User}
              onPress={() => {
                router.push("/(pages)/profile/edit");
              }}
            />

            {/* TODO: add more menu */}
            <ProfileMenuItem
              label="Change Password"
              icon={LockKeyhole}
              onPress={() => {
                // router.push("/(pages)/profile/change-password");
              }}
            />

            <ProfileMenuItem
              label="Daily Activity"
              icon={Activity}
              onPress={() => {
                // router.push("/(pages)/profile/daily-activity");
              }}
            />

            <ProfileMenuItem
              label="Progress"
              icon={BarChart3}
              onPress={() => {
                // router.push("/(pages)/profile/progress");
              }}
            />
          </ProfileSection>

          <ProfileSection title="Training">
            <ProfileMenuItem
              label="Workout Preferences"
              icon={Dumbbell}
              onPress={() => {
                // router.push("/(pages)/profile/workout-preferences");
              }}
            />

            <ProfileMenuItem
              label="Privacy & Data"
              icon={Shield}
              onPress={() => {
                // router.push("/(pages)/profile/privacy");
              }}
            />
          </ProfileSection>

          <ProfileSection title="Help">
            <ProfileMenuItem
              label="Live Support"
              icon={MessageCircle}
              onPress={() => {
                // router.push("/(pages)/profile/support");
              }}
            />

            <ProfileMenuItem
              label="FAQ"
              icon={CircleHelp}
              onPress={() => {
                // router.push("/(pages)/profile/faq");
              }}
            />
          </ProfileSection>

          <ProfileSection>
            <ProfileMenuItem
              label="Sign Out"
              icon={LogOut}
              destructive
              onPress={signOut}
            />
          </ProfileSection>
        </View>
      </View>
    </PageLayout>
  );
}
