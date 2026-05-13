import { exerciseTypeFieldConfig } from "@/lib/workout/config";
import {
  DifficultyLevel,
  ExerciseType,
} from "@/types/workout/response/exercise.types";
import { EquipmentCategory } from "@/types/workout/response/shared.types";
import { z } from "zod";

// helper: add validation error based on exercise-type
function addRequiredIssueIfMissing(
  ctx: z.RefinementCtx,
  config: { requiredFields: string[] },
  field: string,
  value: unknown,
  message: string,
) {
  const isMissing = value == null || value === "";

  if (config.requiredFields.includes(field) && isMissing) {
    ctx.addIssue({
      code: "custom",
      path: [field],
      message,
    });
  }
}

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

export const workoutExerciseFormSchema = z
  .object({
    id: z.number().nullable(),
    clientId: z.string(), // for manage exercises page
    orderIndex: z.number(),

    plannedSets: z.number().min(1, "Sets must be at least 1").nullable(),

    // plannedRepsRange
    plannedRepsMin: z.number().min(0, "Min reps cannot be negative").nullable(),
    plannedRepsMax: z.number().min(0, "Max reps cannot be negative").nullable(),

    plannedWeight: z.number().min(0, "Weight cannot be negative").nullable(),

    // plannedRest
    plannedRestMinutes: z
      .number()
      .min(0, "Minutes cannot be negative")
      .nullable(),
    plannedRestSeconds: z
      .number()
      .min(0, "Seconds cannot be negative")
      .max(59, "Seconds must be between 0 and 59")
      .nullable(),

    // plannedDuration
    plannedDurationMinutes: z
      .number()
      .min(0, "Minutes cannot be negative")
      .nullable(),
    plannedDurationSeconds: z
      .number()
      .min(0, "Seconds cannot be negative")
      .max(59, "Seconds must be between 0 and 59")
      .nullable(),

    plannedDistance: z.number().nullable(),

    exercise: exerciseSchema,
  })
  .superRefine((value, ctx) => {
    const type = value.exercise.exerciseType;
    const config = exerciseTypeFieldConfig[type];

    // plannedSets
    addRequiredIssueIfMissing(
      ctx,
      config,
      "plannedSets",
      value.plannedSets,
      "Sets is required",
    );

    // plannedWeight
    addRequiredIssueIfMissing(
      ctx,
      config,
      "plannedWeight",
      value.plannedWeight,
      "Weight is required",
    );

    // plannedDistance
    addRequiredIssueIfMissing(
      ctx,
      config,
      "plannedDistance",
      value.plannedDistance,
      "Distance is required",
    );

    // plannedRepsRange (split fields)
    if (config.requiredFields.includes("plannedRepsRange")) {
      if (value.plannedRepsMin == null) {
        ctx.addIssue({
          code: "custom",
          path: ["plannedRepsMin"],
          message: "Enter minimum reps",
        });
      }

      if (value.plannedRepsMax == null) {
        ctx.addIssue({
          code: "custom",
          path: ["plannedRepsMax"],
          message: "Enter maximum reps",
        });
      }
    }

    if (
      value.plannedRepsMin != null &&
      value.plannedRepsMax != null &&
      value.plannedRepsMin > value.plannedRepsMax
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["plannedRepsMin"],
        message: "Min reps cannot be greater than max reps",
      });

      ctx.addIssue({
        code: "custom",
        path: ["plannedRepsMax"],
        message: "Max reps must be at least min reps",
      });
    }

    // plannedRestTime (split fields)
    if (config.requiredFields.includes("plannedRestTime")) {
      if (value.plannedRestMinutes == null) {
        ctx.addIssue({
          code: "custom",
          path: ["plannedRestMinutes"],
          message: "Enter rest minutes (0 if none)",
        });
      }

      if (value.plannedRestSeconds == null) {
        ctx.addIssue({
          code: "custom",
          path: ["plannedRestSeconds"],
          message: "Enter rest seconds (0 if none)",
        });
      }
    }

    // plannedDuration (split fields)
    if (config.requiredFields.includes("plannedDuration")) {
      if (value.plannedDurationMinutes == null) {
        ctx.addIssue({
          code: "custom",
          path: ["plannedDurationMinutes"],
          message: "Enter duration minutes (0 if none)",
        });
      }

      if (value.plannedDurationSeconds == null) {
        ctx.addIssue({
          code: "custom",
          path: ["plannedDurationSeconds"],
          message: "Enter duration seconds (0 if none)",
        });
      }
    }
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
