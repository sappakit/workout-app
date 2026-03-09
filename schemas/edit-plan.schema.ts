import { exerciseTypeFieldConfig } from "@/lib/workout/config";
import { DifficultyLevel, ExerciseType } from "@/types/workout/exercise.types";
import { EquipmentCategory } from "@/types/workout/shared.types";
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

export const workoutExerciseSchema = z
  .object({
    id: z.number(),
    orderIndex: z.number(),

    plannedSets: z.number().min(1, "Sets must be at least 1").nullable(),
    plannedRepsRange: z.string().nullable(),
    plannedWeight: z.number().nullable(),
    plannedRestTime: z
      .number()
      .min(0, "Rest time cannot be negative")
      .nullable(),
    plannedDuration: z.number().nullable(),
    plannedDistance: z.number().nullable(),

    exercise: exerciseSchema,
  })
  .superRefine((value, ctx) => {
    const type = value.exercise.exerciseType;
    const config = exerciseTypeFieldConfig[type];

    // Required field rules from config
    // plannedSets
    addRequiredIssueIfMissing(
      ctx,
      config,
      "plannedSets",
      value.plannedSets,
      "Sets is required",
    );

    // plannedRepsRange
    addRequiredIssueIfMissing(
      ctx,
      config,
      "plannedRepsRange",
      value.plannedRepsRange,
      "Reps range is required",
    );

    // plannedRestTime
    addRequiredIssueIfMissing(
      ctx,
      config,
      "plannedRestTime",
      value.plannedRestTime,
      "Rest time is required",
    );

    // plannedDuration
    addRequiredIssueIfMissing(
      ctx,
      config,
      "plannedDuration",
      value.plannedDuration,
      "Duration is required",
    );

    // plannedDistance
    addRequiredIssueIfMissing(
      ctx,
      config,
      "plannedDistance",
      value.plannedDistance,
      "Distance is required",
    );

    // plannedWeight
    addRequiredIssueIfMissing(
      ctx,
      config,
      "plannedWeight",
      value.plannedWeight,
      "Weight is required",
    );

    // Reps format rule
    const repsRange = value.plannedRepsRange;

    if (repsRange) {
      const [minRaw, maxRaw] = repsRange.split("-");
      const min = Number(minRaw);
      const max = Number(maxRaw);

      if (
        Number.isNaN(min) ||
        Number.isNaN(max) ||
        !Number.isFinite(min) ||
        !Number.isFinite(max)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["plannedRepsRange"],
          message: "Reps range must be in min-max format",
        });
      } else if (min < 0 || max < 0) {
        ctx.addIssue({
          code: "custom",
          path: ["plannedRepsRange"],
          message: "Reps cannot be negative",
        });
      } else if (min > max) {
        ctx.addIssue({
          code: "custom",
          path: ["plannedRepsRange"],
          message: "Min reps cannot be greater than max reps",
        });
      }
    }
  });

export const editPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  workoutFocusTypeId: z.number({
    error: "Workout type is required",
  }),
  targetMuscles: z
    .array(z.number())
    .min(1, "Select target muscle groups or enable Auto-fill"),
  durationHours: z
    .number({ error: "Enter 0+ hours or enable Auto-fill" })
    .min(0, { message: "Hours cannot be negative" }),
  durationMinutes: z
    .number({ error: "Enter 0+ minutes or enable Auto-fill" })
    .min(59, { message: "Minutes cannot be negative" }),
  durationSeconds: z
    .number({ error: "Enter 0+ seconds or enable Auto-fill" })
    .min(59, { message: "Seconds cannot be negative" }),
  autoFillMuscles: z.boolean(),
  autoFillDuration: z.boolean(),
  workoutExercises: z.array(workoutExerciseSchema),
});

export type EditPlanForm = z.infer<typeof editPlanSchema>;
