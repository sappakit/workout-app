import { useAppTheme } from "@/hooks/useAppTheme";
import { Exercise } from "@/types/workout/response/exercise.types";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { AppButton } from "../custom-ui/AppButton";
import { PageLayout } from "../layout/PageLayout";
import { ThemedText } from "../themed-text";

interface ExerciseContentProps {
  data: Exercise;
}

export default function ExerciseContent({ data }: ExerciseContentProps) {
  // TODO: add exercise page
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <PageLayout>
      <View className="my-4">
        <AppButton
          title="Back"
          variant="secondary"
          onPress={() => router.back()}
        />
      </View>

      <ThemedText type="default" variant="primary">
        Exercise: {data.name}
      </ThemedText>
    </PageLayout>
  );
}
