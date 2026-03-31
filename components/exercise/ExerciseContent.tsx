import { useAppTheme } from "@/hooks/useAppTheme";
import { Exercise } from "@/types/workout/response/exercise.types";
import { useRouter } from "expo-router";
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
    <PageLayout
      headerProps={{
        variant: "title",
        title: `${data.name}`,
        showBackButton: true,
      }}
    >
      <ThemedText type="default" variant="primary">
        Exercise: {data.name}
      </ThemedText>
    </PageLayout>
  );
}
