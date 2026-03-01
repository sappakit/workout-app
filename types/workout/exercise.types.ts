import { Equipment, Muscle } from "./shared.types";

export enum ExerciseType {
  WEIGHT = "weight",
  CARDIO = "cardio",
  CALISTHENICS = "calisthenics",
}

export const ExerciseTypeLabel: Record<ExerciseType, string> = {
  [ExerciseType.WEIGHT]: "Strength",
  [ExerciseType.CARDIO]: "Cardio Training",
  [ExerciseType.CALISTHENICS]: "Bodyweight",
};

export interface ExerciseMuscleItem {
  id: number;
  muscle: Muscle;
}

export interface ExerciseEquipmentLink {
  id: number;
  equipment: Equipment;
}

export interface Exercise {
  id: number;
  name: string;
  description: string;

  exerciseType: ExerciseType;

  defaultCaloriesBurned: number;
  defaultDuration: number;
  defaultRestTime: number;
  defaultRepsRange: string;
  defaultSets: number;

  demoLink: string;
  howToPerform: string;

  muscles: ExerciseMuscleItem[];
  equipmentLinks: ExerciseEquipmentLink[];
}
