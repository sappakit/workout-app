import { Equipment, Muscle } from "./shared.types";

export enum ExerciseType {
  STRENGTH = "strength",
  CARDIO = "cardio",
  CALISTHENICS = "calisthenics",
}

export const ExerciseTypeLabel: Record<ExerciseType, string> = {
  [ExerciseType.STRENGTH]: "Strength",
  [ExerciseType.CARDIO]: "Cardio Training",
  [ExerciseType.CALISTHENICS]: "Bodyweight",
};

export enum DifficultyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export const DifficultyLabel: Record<DifficultyLevel, string> = {
  [DifficultyLevel.BEGINNER]: "Beginner",
  [DifficultyLevel.INTERMEDIATE]: "Intermediate",
  [DifficultyLevel.ADVANCED]: "Advanced",
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
  difficultyLevel: DifficultyLevel;

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
