import { PageLayout } from "@/components/layout/PageLayout";
import { ManageExercisesContent } from "@/components/manage-exercises/ManageExercisesContent";
import { normalizeOrderIndex } from "@/components/manage-exercises/utils/manage-exercises.utils";
import { ErrorState } from "@/components/state/ErrorState";
import type { EditPlanForm } from "@/schemas/edit-plan.schema";
import { usePlanFormDraftStore } from "@/stores/planFormDraftStore";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  type ReorderableListReorderEvent,
  reorderItems,
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
    setItems((previousItems) =>
      previousItems.filter((item) => item.clientId !== clientIdToRemove),
    );
  };

  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    setItems((currentItems) => reorderItems(currentItems, from, to));
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

  if (!draft) {
    return (
      <PageLayout scrollable={false}>
        <ErrorState
          icon="details"
          title="No plan draft found"
          message="We couldn't find the workout plan you were editing."
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
      description="Drag to reorder or remove exercises from this workout plan."
      doneDisabled={doneDisabled}
      emptyText="No exercises in this workout plan."
      onRemove={handleRemove}
      onReorder={handleReorder}
      onDone={handleDone}
      onCancel={handleCancel}
    />
  );
}
