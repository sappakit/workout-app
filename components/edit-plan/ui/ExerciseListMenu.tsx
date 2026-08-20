import {
  DropdownItem,
  MenuSectionLabel,
  OptionsMenu,
} from "@/components/options-menu/OptionsMenu";
import { useAppColors } from "@/hooks/useAppTheme";
import { useExerciseDisplayStore } from "@/stores/exerciseDisplayStore";

type ExerciseListMenuProps = {
  actions?: {
    handleOpenManageMode: () => void;
    handleRemoveAllExercises: () => void;
  };
  isDisabled?: boolean;
};

export function ExerciseListMenu({
  isDisabled,
  actions,
}: ExerciseListMenuProps) {
  const colors = useAppColors();

  const showFullExerciseDetails = useExerciseDisplayStore(
    (state) => state.showFullExerciseDetails,
  );

  const toggleShowFullExerciseDetails = useExerciseDisplayStore(
    (state) => state.toggleShowFullExerciseDetails,
  );

  return (
    <OptionsMenu isDisabled={isDisabled}>
      <MenuSectionLabel label="View" />

      <DropdownItem
        isToggleItem
        label="Show full details"
        icon="details"
        checked={showFullExerciseDetails}
        onSelect={toggleShowFullExerciseDetails}
      />

      {actions ? (
        <>
          <MenuSectionLabel label="Actions" />

          <DropdownItem
            label="Manage exercises"
            icon="settings"
            onSelect={actions.handleOpenManageMode}
          />

          <DropdownItem
            label="Remove all"
            icon="delete"
            color={colors.destructive}
            onSelect={actions.handleRemoveAllExercises}
          />
        </>
      ) : null}
    </OptionsMenu>
  );
}
