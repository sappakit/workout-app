import { AppButton } from "@/components/custom-ui/AppButton";
import { PageLayout } from "@/components/layout/PageLayout";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useWorkoutSessionStore } from "@/stores/workoutSessionStore";
import { WorkoutSessionModel } from "@/types/workout/model/workout.types";
import { useRouter } from "expo-router";
import { Check, GripVertical, Trash2, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
  useReorderableDrag,
} from "react-native-reorderable-list";

type SessionExerciseItem = WorkoutSessionModel["sessionExercises"][number];

export default function ManageSessionExercisesPage() {
  const router = useRouter();

  const session = useWorkoutSessionStore((state) => state.session);
  const updateSession = useWorkoutSessionStore((state) => state.updateSession);
  const removePerformanceByExerciseId = useWorkoutSessionStore(
    (state) => state.removePerformanceByExerciseId,
  );

  const initialItems = useMemo(
    () => normalizeOrderIndex(session?.sessionExercises ?? []),
    [session?.sessionExercises],
  );

  const [items, setItems] = useState<SessionExerciseItem[]>(initialItems);

  const doneDisabled =
    initialItems.length === items.length &&
    initialItems.every(
      (item, index) => item.clientId === items[index]?.clientId,
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
    if (!session) {
      router.back();
      return;
    }

    const removedExerciseIds = initialItems
      .filter(
        (initialItem) =>
          !items.some((item) => item.clientId === initialItem.clientId),
      )
      .map((item) => item.exercise.id);

    updateSession((prev) => ({
      ...prev,
      sessionExercises: normalizeOrderIndex(items),
    }));

    removedExerciseIds.forEach((exerciseId) => {
      removePerformanceByExerciseId(exerciseId);
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

  if (!session) {
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
          No active workout session found.
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
          Drag to reorder or remove exercises from this workout session.
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
          ListEmptyComponent={
            <View className="items-center justify-center px-6 py-10">
              <ThemedText type="default" variant="secondary">
                No exercises in this workout session.
              </ThemedText>
            </View>
          }
          renderItem={({ item }) => (
            <ManageSessionExerciseRow
              item={item}
              onRemove={() => handleRemove(item.clientId)}
            />
          )}
        />
      </View>
    </PageLayout>
  );
}

interface ManageSessionExerciseRowProps {
  item: SessionExerciseItem;
  onRemove: () => void;
}

function ManageSessionExerciseRow({
  item,
  onRemove,
}: ManageSessionExerciseRowProps) {
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

function normalizeOrderIndex(items: SessionExerciseItem[]) {
  return items.map((item, index) => ({
    ...item,
    orderIndex: index + 1,
  }));
}
