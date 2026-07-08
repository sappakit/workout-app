import {
  DifficultyLevel,
  ExerciseType,
} from "@/types/workout/response/exercise.types";
import { EquipmentCategory } from "@/types/workout/response/shared.types";
import { z } from "zod";

const muscleSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const equipmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.enum(EquipmentCategory),
});

const exerciseMuscleItemSchema = z.object({
  id: z.number(),
  muscle: muscleSchema,
});

const exerciseEquipmentLinkSchema = z.object({
  id: z.number(),
  equipment: equipmentSchema,
});

export const exerciseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),

  exerciseType: z.enum(ExerciseType),
  difficultyLevel: z.enum(DifficultyLevel),

  defaultCaloriesBurned: z.number().nullable(),
  defaultDuration: z.number().nullable(),
  defaultRestTime: z.number().nullable(),
  defaultRepsRange: z.string().nullable(),
  defaultSets: z.number().nullable(),

  demoLink: z.string().nullable(),
  howToPerform: z.string().nullable(),

  muscles: z.array(exerciseMuscleItemSchema).nullish(),
  equipmentLinks: z.array(exerciseEquipmentLinkSchema).nullish(),
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
