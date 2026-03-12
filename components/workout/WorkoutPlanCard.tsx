import { useAppTheme } from "@/hooks/useAppTheme";
import {
  calculateWorkoutCalories,
  calculateWorkoutDuration,
} from "@/lib/workout/utils";
import { WorkoutResponse } from "@/types/workout/response/workout.types";
import clsx from "clsx";
import {
  ArrowUpDown,
  BicepsFlexed,
  Flame,
  LucideIcon,
  PanelTopOpen,
  Pencil,
  Repeat,
  Timer,
  Trash2,
  UserPlus,
} from "lucide-react-native";
import { Fragment, useState } from "react";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Separator } from "../custom-ui/Separator";
import {
  DropdownItem,
  MenuSectionLabel,
  OptionsMenu,
} from "../optionsMenu/OptionsMenu";
import { ThemedText } from "../themed-text";

type WorkoutPlanCardProps = {
  data: WorkoutResponse;
};

type BaseDisplayProps = {
  text: string;
  className?: string;
};

type WorkoutStatItem = {
  key: string;
  text: string;
  icon: LucideIcon;
};

export function WorkoutPlanCard({ data }: WorkoutPlanCardProps) {
  const { colors } = useAppTheme();
  const totalExercises = data.workoutExercises.length;
  const duration = calculateWorkoutDuration(data);
  const calories = calculateWorkoutCalories(data);

  const WorkoutStats: WorkoutStatItem[] = [
    {
      key: "exercise",
      text: `${totalExercises} ${totalExercises !== 1 ? "Exercises" : "Exercise"}`,
      icon: BicepsFlexed,
    },
    {
      key: "duration",
      text: `${duration} min`,
      icon: Timer,
    },
    {
      key: "calories",
      text: `${calories} kcal`,
      icon: Flame,
    },
  ];

  return (
    <View
      className="items-center justify-center rounded-3xl border p-4"
      style={{
        borderColor: colors.app.brand,
        backgroundColor: colors.app.cardPrimary,
      }}
    >
      {/* Options menu */}
      <View className="absolute right-4 top-4">
        <WorkoutCardMenu />
      </View>

      <ThemedText type="default" variant="primary" className="text-sm">
        {data.workoutFocusType.name}
      </ThemedText>

      <ThemedText type="title" variant="brand" className="mt-1">
        {data.name}
      </ThemedText>

      {/* Muscle list */}
      <View className="mt-2 w-full flex-row items-center justify-center gap-2">
        {data.muscles.map(({ muscle }) => (
          <MuscleBadge key={muscle.id} text={muscle.name} />
        ))}
      </View>

      {/* Workout detail */}
      <View className="mt-4 w-full flex-row items-center justify-between px-2">
        {WorkoutStats.map((workout, index) => (
          <Fragment key={workout.key}>
            {index > 0 && <Separator />}

            <WorkoutDetail text={workout.text} icon={workout.icon} />
          </Fragment>
        ))}
      </View>
    </View>
  );
}

function MuscleBadge({ text, className }: BaseDisplayProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className={twMerge(clsx("rounded-full border px-4 py-1", className))}
      style={{
        backgroundColor: colors.app.cardSecondary,
        borderColor: colors.app.borderTertiary,
      }}
    >
      <ThemedText type="default" variant="primary" className="text-xs">
        {text}
      </ThemedText>
    </View>
  );
}

function WorkoutDetail({
  text,
  className,
  icon: Icon,
}: BaseDisplayProps & {
  icon?: LucideIcon;
}) {
  const { colors } = useAppTheme();

  return (
    <View className={twMerge(clsx("flex-row items-center", className))}>
      {Icon && <Icon size={12} color={colors.app.textAccent} />}

      <ThemedText type="default" variant="primary" className="ml-2 text-sm">
        {text}
      </ThemedText>
    </View>
  );
}

export function WorkoutCardMenu() {
  const { colors } = useAppTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <OptionsMenu>
      <MenuSectionLabel label="Actions" />

      <DropdownItem label="Edit" icon={Pencil} />
      <DropdownItem label="Delete" icon={Trash2} />
      <DropdownItem label="Switch plan" icon={Repeat} />
      <DropdownItem label="Change order" icon={ArrowUpDown} />
      <DropdownItem
        label="Show full details"
        icon={PanelTopOpen}
        checked={expanded}
        onSelect={() => {
          setExpanded((prev) => !prev);

          // Prevent menu closing
          return false;
        }}
      />

      <Separator
        orientation="horizontal"
        style={{ backgroundColor: colors.app.borderTertiary }}
      />

      <MenuSectionLabel label="Team" />

      <DropdownItem label="Invite Users" icon={UserPlus} />
    </OptionsMenu>
  );
}
