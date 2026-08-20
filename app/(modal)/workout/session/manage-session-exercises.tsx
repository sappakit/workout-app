import { PageLayout } from "@/components/layout/PageLayout";
import { ManageExercisesContent } from "@/components/manage-exercises/ManageExercisesContent";
import { normalizeOrderIndex } from "@/components/manage-exercises/utils/manage-exercises.utils";
import { ErrorState } from "@/components/state/ErrorState";
import { useWorkoutSessionStore } from "@/stores/workoutSessionStore";
import type { WorkoutSessionModel } from "@/types/workout/model/workout.types";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  type ReorderableListReorderEvent,
  reorderItems,
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

  // Disable Done if there are no changes
  const doneDisabled =
    initialItems.length === items.length &&
    initialItems.every(
      (item, index) => item.clientId === items[index].clientId,
    );

  const handleRemove = (clientIdToRemove: string) => {
    setItems((previousItems) =>
      previousItems.filter((item) => item.clientId !== clientIdToRemove),
    );
  };

  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    setItems((currentItems) => reorderItems(currentItems, from, to));
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

    updateSession((previousSession) => ({
      ...previousSession,
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

  if (!session) {
    return (
      <PageLayout scrollable={false}>
        <ErrorState
          icon="details"
          title="No active workout session found"
          message="We couldn't find the workout session you were editing."
          primaryAction={{
            hidden: true,
          }}
        />
      </PageLayout>
    );
  }

  return (
    <ManageExercisesContent
      items={items}
      description="Drag to reorder or remove exercises from this workout session."
      doneDisabled={doneDisabled}
      emptyText="No exercises in this workout session."
      onRemove={handleRemove}
      onReorder={handleReorder}
      onDone={handleDone}
      onCancel={handleCancel}
    />
  );
}
