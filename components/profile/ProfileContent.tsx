import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { useAppColors } from "@/hooks/useAppColors";
import type { User as UserResponse } from "@/types/user/response/user.types";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { ProfileAvatar } from "./ui/ProfileAvatar";
import { ProfileMenuItem, ProfileSection } from "./ui/ProfileMenu";
import { StatCard } from "./ui/StatCard";

interface ProfileContentProps {
  data: UserResponse;
}

export default function ProfileContent({ data }: ProfileContentProps) {
  const colors = useAppColors();
  const { signOut } = useAuth();
  const router = useRouter();

  const fullName =
    `${data.profile?.firstName ?? ""} ${data.profile?.lastName ?? ""}`.trim();

  return (
    <PageLayout
      disableContentPadding={{ top: true }}
      header={{
        props: {
          variant: "title",
          title: "Profile",
        },
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

          <View className="items-center gap-1">
            <ThemedText type="heading">{fullName}</ThemedText>

            <View className="flex-row items-center gap-1.5">
              <AppIcon name="email" size="xs" color={colors.mutedForeground} />

              <ThemedText type="small" tone="muted">
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

        {/* Menu */}
        <View className="gap-4">
          <ProfileSection title="Account">
            <ProfileMenuItem
              label="Personal Info"
              icon="profile"
              onPress={() => {
                router.push("/(pages)/profile/edit");
              }}
            />

            <ProfileMenuItem
              label="Change Password"
              icon="password"
              onPress={() => {
                router.push("/(pages)/profile/change-password");
              }}
            />

            {/* TODO: add more menu */}
            <ProfileMenuItem
              label="Daily Activity"
              icon="activity"
              onPress={() => {
                // router.push("/(pages)/profile/daily-activity");
              }}
            />

            <ProfileMenuItem
              label="Progress"
              icon="progress"
              onPress={() => {
                // router.push("/(pages)/profile/progress");
              }}
            />
          </ProfileSection>

          <ProfileSection title="Training">
            <ProfileMenuItem
              label="Workout Preferences"
              icon="workout"
              onPress={() => {
                // router.push("/(pages)/profile/workout-preferences");
              }}
            />

            <ProfileMenuItem
              label="Privacy & Data"
              icon="privacy"
              onPress={() => {
                // router.push("/(pages)/profile/privacy");
              }}
            />
          </ProfileSection>

          <ProfileSection title="Help">
            <ProfileMenuItem
              label="Live Support"
              icon="support"
              onPress={() => {
                // router.push("/(pages)/profile/support");
              }}
            />

            <ProfileMenuItem
              label="FAQ"
              icon="help"
              onPress={() => {
                // router.push("/(pages)/profile/faq");
              }}
            />
          </ProfileSection>

          <ProfileSection>
            <ProfileMenuItem
              label="Sign Out"
              icon="sign-out"
              destructive
              onPress={signOut}
            />
          </ProfileSection>
        </View>
      </View>
    </PageLayout>
  );
}
