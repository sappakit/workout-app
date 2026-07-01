import {
  DropdownItem,
  MenuSectionLabel,
  OptionsMenu,
} from "@/components/options-menu/OptionsMenu";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useExerciseDisplayStore } from "@/stores/exerciseDisplayStore";
import { PanelTopOpen, Settings2, Trash2 } from "lucide-react-native";

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
  const { colors } = useAppTheme();

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
        icon={PanelTopOpen}
        checked={showFullExerciseDetails}
        onSelect={toggleShowFullExerciseDetails}
      />

      {actions ? (
        <>
          <MenuSectionLabel label="Actions" />

          <DropdownItem
            label="Manage exercises"
            icon={Settings2}
            onSelect={actions.handleOpenManageMode}
          />

          <DropdownItem
            label="Remove all"
            color={colors.app.error}
            icon={Trash2}
            onSelect={actions.handleRemoveAllExercises}
          />
        </>
      ) : null}
    </OptionsMenu>
  );
}
