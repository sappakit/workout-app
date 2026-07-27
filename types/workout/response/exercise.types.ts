import { Equipment, ExerciseMuscleRole, Muscle } from "./shared.types";

export enum ExerciseOrigin {
  SYSTEM = "system",
  USER = "user",
}

export enum ExerciseStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  HIDDEN = "hidden",
  ARCHIVED = "archived",
}

export enum DifficultyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export enum ExerciseMediaType {
  IMAGE = "image",
  VIDEO = "video",
  GIF = "gif",
}

export const DifficultyLabel: Record<DifficultyLevel, string> = {
  [DifficultyLevel.BEGINNER]: "Beginner",
  [DifficultyLevel.INTERMEDIATE]: "Intermediate",
  [DifficultyLevel.ADVANCED]: "Advanced",
};

export interface ExerciseCategory {
  id: number;
  code: string;
  name: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface ExerciseSource {
  id: number;
  key: string;
  name: string;
  sourceUrl: string;

  licenseName: string | null;
  licenseUrl: string | null;
  attributionText: string | null;
  sourceVersion: string | null;
  sourceCommitHash: string | null;
  importedAt: string | null;
}

export interface ExerciseMedia {
  id: number;
  mediaType: ExerciseMediaType;
  url: string;

  publicId: string | null;
  sourcePath: string | null;

  displayOrder: number;
  isPrimary: boolean;

  source?: ExerciseSource | null;
}

export interface ExerciseMuscleItem {
  id: number;
  role: ExerciseMuscleRole;
  muscle?: Muscle;
}

export interface ExerciseEquipmentLink {
  id: number;
  equipment?: Equipment;
}

export interface Exercise {
  id: number;
  origin: ExerciseOrigin;
  status: ExerciseStatus;

  name: string;
  description: string | null;

  category?: ExerciseCategory;
  difficultyLevel: DifficultyLevel | null;

  defaultCaloriesBurned: number | null;
  defaultDuration: number | null;
  defaultRestTime: number | null;
  defaultRepsRange: string | null;
  defaultSets: number | null;

  demoLink: string | null;
  howToPerform: string[] | null;

  sourceExternalId: string | null;
  source?: ExerciseSource | null;

  media?: ExerciseMedia[];
  muscles?: ExerciseMuscleItem[];
  equipmentLinks?: ExerciseEquipmentLink[];
}
