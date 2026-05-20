import {
  DropdownItem,
  MenuSectionLabel,
  OptionsMenu,
} from "@/components/options-menu/OptionsMenu";
import { useAppTheme } from "@/hooks/useAppTheme";
import { PanelTopOpen, Settings2, Trash2 } from "lucide-react-native";

type ExerciseListMenuProps = {
  showFullExerciseDetails: boolean;
  actions: {
    toggleShowFullExerciseDetails: () => void;
    handleOpenManageMode: () => void;
    handleRemoveAllExercises: () => void;
  };
  isDisabled?: boolean;
};

export function ExerciseListMenu({
  isDisabled,
  showFullExerciseDetails,
  actions,
}: ExerciseListMenuProps) {
  const { colors } = useAppTheme();

  return (
    <OptionsMenu isDisabled={isDisabled}>
      <MenuSectionLabel label="View" />

      <DropdownItem
        isToggleItem
        label="Show full details"
        icon={PanelTopOpen}
        checked={showFullExerciseDetails}
        onSelect={actions.toggleShowFullExerciseDetails}
      />

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
    </OptionsMenu>
  );
}
