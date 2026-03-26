import { AppButton } from "@/components/custom-ui/AppButton";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { EditPlanForm } from "@/schemas/edit-plan.schema";
import { useEditPlanDraftStore } from "@/stores/editPlanDraftStore";
import { useRouter } from "expo-router";
import { Check, GripVertical, Trash2, X } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
  useReorderableDrag,
} from "react-native-reorderable-list";

type WorkoutExerciseDraftItem = EditPlanForm["workoutExercises"][number];

export default function ManageExercisesPage() {
  const router = useRouter();

  const draftWorkoutId = useEditPlanDraftStore((state) => state.workoutId);
  const draft = useEditPlanDraftStore((state) => state.draft);
  const replaceDraft = useEditPlanDraftStore((state) => state.replaceDraft);

  const initialItems = useMemo(
    () => normalizeOrderIndex(draft?.workoutExercises ?? []),
    [draft],
  );

  const [items, setItems] = useState<WorkoutExerciseDraftItem[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleRemove = (clientIdToRemove: string) => {
    setItems((prev) =>
      prev.filter((item) => item.clientId !== clientIdToRemove),
    );
  };

  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    setItems((current) => reorderItems(current, from, to));
  };

  const handleDone = () => {
    if (!draft || !draftWorkoutId) {
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
      <PageLayout
        scrollable={false}
        showHeader={false}
        stickyFooter={{
          content: (
            <AppButton
              title="Back"
              variant="secondary"
              className="flex-1"
              onPress={handleCancel}
            />
          ),
          options: { addBottomInset: true },
        }}
      >
        <ThemedText type="title" variant="accent">
          Manage Exercises
        </ThemedText>

        <ThemedText type="default" variant="secondary" className="mt-4">
          No edit draft found.
        </ThemedText>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      className="px-0"
      scrollable={false}
      showHeader={false}
      stickyFooter={{
        content: footer,
        options: { addBottomInset: true },
      }}
    >
      <View className="px-4">
        <ThemedText type="title" variant="accent">
          Manage Exercises
        </ThemedText>

        <ThemedText type="default" variant="primary" className="mt-2">
          Drag to reorder or remove exercises from this workout plan.
        </ThemedText>
      </View>

      <View className="mt-4 flex-1">
        <ReorderableList
          data={items}
          keyExtractor={(item) => item.clientId}
          onReorder={handleReorder}
          cellAnimations={{
            opacity: 1,
          }}
          renderItem={({ item }) => (
            <ManageExerciseRow
              item={item}
              onRemove={() => handleRemove(item.clientId)}
            />
          )}
        />
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
    <View className="mb-2 px-4">
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
    </View>
  );
}

function normalizeOrderIndex(items: WorkoutExerciseDraftItem[]) {
  return items.map((item, index) => ({
    ...item,
    orderIndex: index + 1,
  }));
}
