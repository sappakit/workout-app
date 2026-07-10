import { AppButton } from "@/components/custom-ui/AppButton";
import { PageLayout } from "@/components/layout/PageLayout";
import { ErrorState } from "@/components/state/ErrorState";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { EditPlanForm } from "@/schemas/edit-plan.schema";
import { usePlanFormDraftStore } from "@/stores/planFormDraftStore";
import { useRouter } from "expo-router";
import {
  Check,
  FileQuestion,
  GripVertical,
  Trash2,
  X,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
  useReorderableDrag,
} from "react-native-reorderable-list";

type WorkoutExerciseDraftItem = EditPlanForm["workoutExercises"][number];

export default function ManageExercisesPage() {
  const router = useRouter();

  const draft = usePlanFormDraftStore((state) => state.draft);
  const replaceDraft = usePlanFormDraftStore((state) => state.replaceDraft);

  const initialItems = useMemo(
    () => normalizeOrderIndex(draft?.workoutExercises ?? []),
    [draft],
  );

  const [items, setItems] = useState<WorkoutExerciseDraftItem[]>(initialItems);

  // Disable Done if there are no changes
  const doneDisabled =
    initialItems.length === items.length &&
    initialItems.every(
      (item, index) => item.clientId === items[index].clientId,
    );

  const handleRemove = (clientIdToRemove: string) => {
    setItems((prev) =>
      prev.filter((item) => item.clientId !== clientIdToRemove),
    );
  };

  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    setItems((current) => reorderItems(current, from, to));
  };

  const handleDone = () => {
    if (!draft) {
      router.back();
      return;
    }

    replaceDraft({
      ...draft,
      workoutExercises: normalizeOrderIndex(items),
    });

    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const footer = (
    <>
      <AppButton
        title="Done"
        variant="primary"
        icon={Check}
        className="flex-1"
        textClassName="font-medium"
        onPress={handleDone}
        disabled={doneDisabled}
      />

      <AppButton
        title="Cancel"
        variant="secondary"
        icon={X}
        className="w-36"
        onPress={handleCancel}
      />
    </>
  );

  if (!draft) {
    return (
      <PageLayout scrollable={false}>
        <ErrorState
          title="No plan draft found"
          message="We couldn't find the workout plan you were editing."
          icon={FileQuestion}
          primaryAction={{ hidden: true }}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout scrollable={false} stickyFooter={footer}>
      <View className="flex-1 gap-1">
        <View>
          <ThemedText type="title" variant="accent">
            Manage Exercises
          </ThemedText>

          <ThemedText type="default" variant="primary">
            Drag to reorder or remove exercises from this workout plan.
          </ThemedText>
        </View>

        <View className="flex-1">
          <ReorderableList
            data={items}
            keyExtractor={(item) => item.clientId}
            onReorder={handleReorder}
            cellAnimations={{ opacity: 1 }}
            renderItem={({ item }) => (
              <View className="mt-3">
                <ManageExerciseRow
                  item={item}
                  onRemove={() => handleRemove(item.clientId)}
                />
              </View>
            )}
          />
        </View>
      </View>
    </PageLayout>
  );
}

interface ManageExerciseRowProps {
  item: WorkoutExerciseDraftItem;
  onRemove: () => void;
}

function ManageExerciseRow({ item, onRemove }: ManageExerciseRowProps) {
  const { colors } = useAppTheme();
  const drag = useReorderableDrag();

  return (
    <View
      className="flex-row items-center gap-3 rounded-2xl border p-2"
      style={{
        backgroundColor: colors.app.cardPrimary,
        borderColor: colors.app.borderPrimary,
      }}
    >
      <AppButton
        variant="option"
        icon={Trash2}
        className="h-10 w-10"
        onPress={onRemove}
      />

      <View className="flex-1">
        <ThemedText type="default" variant="primary" className="font-medium">
          {item.exercise.name}
        </ThemedText>
      </View>

      <Pressable onPressIn={drag} className="p-2">
        <GripVertical color={colors.app.textPrimary} size={18} />
      </Pressable>
    </View>
  );
}

function normalizeOrderIndex(items: WorkoutExerciseDraftItem[]) {
  return items.map((item, index) => ({
    ...item,
    orderIndex: index + 1,
  }));
}
