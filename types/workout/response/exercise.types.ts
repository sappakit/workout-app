import { Equipment, ExerciseMuscleRole, Muscle } from "./shared.types";
import { ContentStatus } from "./workout.types";

export enum ExerciseOrigin {
  SYSTEM = "system",
  USER = "user",
}

export enum ExerciseMediaType {
  IMAGE = "image",
  VIDEO = "video",
  GIF = "gif",
}

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

// Must match the codes in the database exercise_tracking_types table
export const EXERCISE_TRACKING_TYPE_CODES = [
  "weight_reps",
  "reps",
  "duration",
  "distance_duration",
  "weighted_bodyweight",
  "assisted_bodyweight",
  "weight_distance",
  "weight_duration",
] as const;

export type ExerciseTrackingTypeCode =
  (typeof EXERCISE_TRACKING_TYPE_CODES)[number];

export interface ExerciseTrackingType {
  id: number;
  code: ExerciseTrackingTypeCode;
  name: string;
  description: string | null;
}

export interface Exercise {
  id: number;
  origin: ExerciseOrigin;
  status: ContentStatus;
  name: string;
  description: string | null;

  category?: ExerciseCategory;
  trackingType?: ExerciseTrackingType;

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
