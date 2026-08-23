import {
  DifficultyLevel,
  ExerciseMediaType,
  ExerciseOrigin,
  ExerciseStatus,
} from "@/types/workout/response/exercise.types";
import {
  EquipmentCategory,
  ExerciseMuscleRole,
} from "@/types/workout/response/shared.types";
import { z } from "zod";

const muscleSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
});

const equipmentSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  category: z.enum(EquipmentCategory),
});

const exerciseCategorySchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  displayOrder: z.number(),
  isActive: z.boolean(),
});

const exerciseSourceSchema = z.object({
  id: z.number(),
  key: z.string(),
  name: z.string(),
  sourceUrl: z.string(),

  licenseName: z.string().nullable(),
  licenseUrl: z.string().nullable(),
  attributionText: z.string().nullable(),
  sourceVersion: z.string().nullable(),
  sourceCommitHash: z.string().nullable(),
  importedAt: z.string().nullable(),
});

const exerciseMediaSchema = z.object({
  id: z.number(),
  mediaType: z.enum(ExerciseMediaType),
  url: z.string(),

  publicId: z.string().nullable(),
  sourcePath: z.string().nullable(),

  displayOrder: z.number(),
  isPrimary: z.boolean(),

  source: exerciseSourceSchema.nullable().optional(),
});

const exerciseMuscleItemSchema = z.object({
  id: z.number(),
  role: z.enum(ExerciseMuscleRole),
  muscle: muscleSchema.optional(),
});

const exerciseEquipmentLinkSchema = z.object({
  id: z.number(),
  equipment: equipmentSchema.optional(),
});

export const exerciseSchema = z.object({
  id: z.number(),
  origin: z.enum(ExerciseOrigin),
  status: z.enum(ExerciseStatus),

  name: z.string(),
  description: z.string().nullable(),

  category: exerciseCategorySchema.optional(),
  difficultyLevel: z.enum(DifficultyLevel).nullable(),

  defaultCaloriesBurned: z.number().nullable(),
  defaultDuration: z.number().nullable(),
  defaultRestTime: z.number().nullable(),
  defaultRepsRange: z.string().nullable(),
  defaultSets: z.number().nullable(),

  demoLink: z.string().nullable(),
  howToPerform: z.array(z.string()).nullable(),

  sourceExternalId: z.string().nullable(),
  source: exerciseSourceSchema.nullable().optional(),

  media: z.array(exerciseMediaSchema).optional(),
  muscles: z.array(exerciseMuscleItemSchema).optional(),
  equipmentLinks: z.array(exerciseEquipmentLinkSchema).optional(),
});

export const workoutExerciseSetFormSchema = z.object({
  id: z.number().nullable(),
  clientId: z.string(),

  setNumber: z.number().min(1, "Set number must be at least 1"),

  reps: z.number().min(0, "Reps cannot be negative").nullable(),
  weight: z.number().min(0, "Weight cannot be negative").nullable(),

  distance: z.number().min(0, "Distance cannot be negative").nullable(),

  durationMinutes: z.number().min(0, "Minutes cannot be negative").nullable(),
  durationSeconds: z
    .number()
    .min(0, "Seconds cannot be negative")
    .max(59, "Seconds must be between 0 and 59")
    .nullable(),
});

export const workoutExerciseFormSchema = z.object({
  id: z.number().nullable(),
  clientId: z.string(),
  orderIndex: z.number(),

  // exercise-level rest time, seconds
  restTime: z.number().min(0, "Rest time cannot be negative").nullable(),

  exercise: exerciseSchema,

  // set-level config
  sets: z.array(workoutExerciseSetFormSchema).min(1, "Add at least one set"),
});

export const editPlanFormSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  workoutFocusTypeId: z.number().nullable(),
  targetMuscles: z
    .array(z.number())
    .min(1, "Select target muscle groups or enable Auto-fill"),

  // plan duration, seconds
  duration: z
    .number()
    .int("Duration must be a whole number")
    .min(0, "Duration cannot be negative"),

  autoFillMuscles: z.boolean(),
  autoFillDuration: z.boolean(),

  workoutExercises: z
    .array(workoutExerciseFormSchema)
    .min(1, "Add at least one exercise"),
});

export type EditPlanForm = z.infer<typeof editPlanFormSchema>;
