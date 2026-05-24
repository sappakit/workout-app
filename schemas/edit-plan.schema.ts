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
  description: z.string().nullish(),
  imageUrl: z.string().nullish(),

  exerciseType: z.enum(ExerciseType),
  difficultyLevel: z.enum(DifficultyLevel),

  defaultCaloriesBurned: z.number().nullish(),
  defaultDuration: z.number().nullish(),
  defaultRestTime: z.number().nullish(),
  defaultRepsRange: z.string().nullish(),
  defaultSets: z.number().nullish(),

  demoLink: z.string().nullish(),
  howToPerform: z.string().nullish(),

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

export const editPlanFormSchema = z
  .object({
    name: z.string().min(1, "Plan name is required"),
    workoutFocusTypeId: z.number().nullable(),
    targetMuscles: z
      .array(z.number())
      .min(1, "Select target muscle groups or enable Auto-fill"),

    durationHours: z
      .number()
      .min(0, { message: "Hours cannot be negative" })
      .nullable(),
    durationMinutes: z
      .number()
      .min(0, { message: "Minutes cannot be negative" })
      .max(59, { message: "Minutes must be between 0 and 59" })
      .nullable(),
    durationSeconds: z
      .number()
      .min(0, { message: "Seconds cannot be negative" })
      .max(59, { message: "Seconds must be between 0 and 59" })
      .nullable(),

    autoFillMuscles: z.boolean(),
    autoFillDuration: z.boolean(),

    workoutExercises: z.array(workoutExerciseFormSchema),
  })
  .superRefine((value, ctx) => {
    if (value.durationHours == null) {
      ctx.addIssue({
        code: "custom",
        path: ["durationHours"],
        message: "Enter hours (0 if none)",
      });
    }

    if (value.durationMinutes == null) {
      ctx.addIssue({
        code: "custom",
        path: ["durationMinutes"],
        message: "Enter minutes (0 if none)",
      });
    }

    if (value.durationSeconds == null) {
      ctx.addIssue({
        code: "custom",
        path: ["durationSeconds"],
        message: "Enter seconds (0 if none)",
      });
    }
  });

export type EditPlanForm = z.infer<typeof editPlanFormSchema>;
