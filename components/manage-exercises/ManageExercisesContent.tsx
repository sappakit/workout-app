import { AppButton } from "@/components/custom-ui/app-button";
import { AppIcon } from "@/components/custom-ui/app-icon/AppIcon";
import { ThemedText } from "@/components/custom-ui/themed-text";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ContentFeedback } from "@/components/state/ContentFeedback";
import { useAppColors } from "@/hooks/useAppTheme";
import { Pressable, View } from "react-native";
import ReorderableList, {
  type ReorderableListReorderEvent,
  useReorderableDrag,
} from "react-native-reorderable-list";

type ManageExerciseItem = {
  clientId: string;
  exercise: {
    name: string;
  };
};

type ManageExercisesContentProps<TItem extends ManageExerciseItem> = {
  items: TItem[];
  description: string;
  doneDisabled?: boolean;
  emptyText?: string;
  onRemove: (clientId: string) => void;
  onReorder: (event: ReorderableListReorderEvent) => void;
  onDone: () => void;
  onCancel: () => void;
};

export function ManageExercisesContent<TItem extends ManageExerciseItem>({
  items,
  description,
  doneDisabled = false,
  emptyText = "No exercises found.",
  onRemove,
  onReorder,
  onDone,
  onCancel,
}: ManageExercisesContentProps<TItem>) {
  const footer = (
    <>
      <AppButton
        title="Done"
        variant="primary"
        className="flex-1"
        icon={{
          name: "check",
          size: "sm",
        }}
        onPress={onDone}
        disabled={doneDisabled}
      />

      <AppButton
        title="Cancel"
        variant="secondary"
        className="w-36"
        icon={{
          name: "close",
          size: "sm",
        }}
        onPress={onCancel}
      />
    </>
  );

  return (
    <PageLayout scrollable={false} stickyFooter={footer} includeInsets>
      <SectionHeader title="Manage Exercises" subtitle={description} />

      <View className="mt-2 flex-1">
        <ReorderableList
          data={items}
          keyExtractor={(item) => item.clientId}
          onReorder={onReorder}
          cellAnimations={{
            opacity: 1,
          }}
          ListEmptyComponent={
            <ContentFeedback
              icon="exercise"
              title="No exercises"
              subtitle={emptyText}
              className="mt-2"
            />
          }
          renderItem={({ item }) => (
            <View className="mt-2">
              <ManageExerciseRow
                item={item}
                onRemove={() => onRemove(item.clientId)}
              />
            </View>
          )}
        />
      </View>
    </PageLayout>
  );
}

type ManageExerciseRowProps = {
  item: ManageExerciseItem;
  onRemove: () => void;
};

function ManageExerciseRow({ item, onRemove }: ManageExerciseRowProps) {
  const colors = useAppColors();
  const drag = useReorderableDrag();

  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-2">
      <AppButton
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full"
        icon={{
          name: "delete",
          size: "sm",
          color: colors.destructive,
        }}
        onPress={onRemove}
      />

      <View className="min-w-0 flex-1">
        <ThemedText type="bodyStrong" numberOfLines={1}>
          {item.exercise.name}
        </ThemedText>
      </View>

      <Pressable onPressIn={drag} hitSlop={8} className="p-2 active:opacity-80">
        <AppIcon name="reorder" size="md" color={colors.mutedForeground} />
      </Pressable>
    </View>
  );
}
