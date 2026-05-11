import { AppButton } from "@/components/custom-ui/AppButton";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Exercise } from "@/types/workout/response/exercise.types";
import { useRouter } from "expo-router";
import { Check, CircleCheck, Info, Plus } from "lucide-react-native";
import { View } from "react-native";
import ExerciseCardBase from "./base/ExerciseCardBase";

type ExercisePickerStatus = "idle" | "selected" | "already-added";

interface ExercisePickerCardProps {
  exercise: Exercise;
  status?: ExercisePickerStatus;
  onPressAdd?: () => void;
}

export function ExercisePickerCard({
  exercise,
  status = "idle",
  onPressAdd,
}: ExercisePickerCardProps) {
  const router = useRouter();
  const { colors } = useAppTheme();

  // const display = useMemo(
  //   () => buildExercisePreviewDisplayModel(exercise),
  //   [exercise],
  // );

  const selected = status === "selected";
  const alreadyAdded = status === "already-added";
  const handleAdd = alreadyAdded ? undefined : onPressAdd;

  // status -> icon mapping
  const icon =
    status === "selected" ? Check : alreadyAdded ? CircleCheck : Plus;

  const muscleChips = (exercise.muscles ?? [])
    .map((item) => item.muscle.name)
    .filter(Boolean)
    .slice(0, 2);

  return (
    <ExerciseCardBase
      exercise={exercise}
      className={alreadyAdded ? "opacity-60" : undefined}
      style={{
        opacity: alreadyAdded ? 0.6 : 1,
        borderColor: selected ? colors.app.brand : colors.app.borderPrimary,
      }}
      // stats={display.stats}
      showDifficultyBadge={true}
      onPress={handleAdd}
      disabled={alreadyAdded}
      footerContent={
        // TODO: add filter chips (target muscle, popular, beginer friendly)
        <View className="mt-2 h-6 flex-row flex-wrap gap-2">
          {muscleChips.map((muscle) => (
            <View
              key={muscle}
              className="rounded-full px-2 py-1"
              style={{ backgroundColor: colors.app.cardSecondary }}
            >
              <ThemedText
                type="default"
                variant="secondary"
                className="text-xs"
              >
                {muscle}
              </ThemedText>
            </View>
          ))}
        </View>
      }
      bottomRightContent={
        <>
          <AppButton
            variant="option"
            icon={Info}
            className="h-8 w-8 self-end rounded-full"
            onPress={() =>
              router.push({
                pathname: "/(pages)/exercise/[id]",
                params: { id: exercise.id },
              })
            }
          />

          <AppButton
            variant="option"
            icon={icon}
            iconSize={16}
            className="h-8 w-8 self-end rounded-full"
            onPress={handleAdd}
            disabled={alreadyAdded}
          />
        </>
      }
    />
  );
}
