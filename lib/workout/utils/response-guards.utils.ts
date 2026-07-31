import {
  Exercise,
  ExerciseEquipmentLink,
  ExerciseMuscleItem,
} from "@/types/workout/response/exercise.types";
import { Equipment, Muscle } from "@/types/workout/response/shared.types";
import {
  WorkoutExerciseItem,
  WorkoutExerciseSet,
  WorkoutMuscleItem,
  WorkoutResponse,
  WorkoutSchedule,
  WorkoutSession,
  WorkoutSessionExercise,
  WorkoutSessionExerciseSet,
} from "@/types/workout/response/workout.types";

// TODO: separate file

export function requireWorkoutExercises(
  workout: WorkoutResponse,
): WorkoutExerciseItem[] {
  if (!workout.workoutExercises) {
    throw new Error(
      `Workout exercises relation was not loaded for workout ${workout.id}.`,
    );
  }

  return workout.workoutExercises;
}

export function requireWorkoutExercise(
  workoutExercise: WorkoutExerciseItem,
): Exercise {
  if (!workoutExercise.exercise) {
    throw new Error(
      `Exercise relation was not loaded for workout exercise ${workoutExercise.id}.`,
    );
  }

  return workoutExercise.exercise;
}

export function requireScheduleWorkout(
  schedule: WorkoutSchedule,
): WorkoutResponse {
  if (!schedule.workout) {
    throw new Error(
      `Workout relation was not loaded for workout schedule ${schedule.id}.`,
    );
  }

  return schedule.workout;
}

export function requireWorkoutExerciseSets(
  workoutExercise: WorkoutExerciseItem,
): WorkoutExerciseSet[] {
  if (!workoutExercise.sets) {
    throw new Error(
      `Sets relation was not loaded for workout exercise ${workoutExercise.id}.`,
    );
  }

  return workoutExercise.sets;
}

export function requireSessionExercises(
  session: WorkoutSession,
): WorkoutSessionExercise[] {
  if (!session.sessionExercises) {
    throw new Error(
      `Session exercises relation was not loaded for workout session ${session.id}.`,
    );
  }

  return session.sessionExercises;
}

export function requireSessionExerciseSets(
  sessionExercise: WorkoutSessionExercise,
): WorkoutSessionExerciseSet[] {
  if (!sessionExercise.sets) {
    throw new Error(
      `Sets relation was not loaded for workout session exercise ${sessionExercise.id}.`,
    );
  }

  return sessionExercise.sets;
}

export function requireWorkoutMuscles(
  workout: WorkoutResponse,
): WorkoutMuscleItem[] {
  if (!workout.muscles) {
    throw new Error(
      `Workout muscles relation was not loaded for workout ${workout.id}.`,
    );
  }

  return workout.muscles;
}

export function requireWorkoutMuscle(workoutMuscle: WorkoutMuscleItem): Muscle {
  if (!workoutMuscle.muscle) {
    throw new Error(
      `Muscle relation was not loaded for workout muscle ${workoutMuscle.id}.`,
    );
  }

  return workoutMuscle.muscle;
}

export function requireExerciseEquipmentLinks(
  exercise: Exercise,
): ExerciseEquipmentLink[] {
  if (!exercise.equipmentLinks) {
    throw new Error(
      `Equipment links relation was not loaded for exercise ${exercise.id}.`,
    );
  }

  return exercise.equipmentLinks;
}

export function requireExerciseEquipment(
  equipmentLink: ExerciseEquipmentLink,
): Equipment {
  if (!equipmentLink.equipment) {
    throw new Error(
      `Equipment relation was not loaded for exercise equipment link ${equipmentLink.id}.`,
    );
  }

  return equipmentLink.equipment;
}

export function requireExerciseMuscles(
  exercise: Exercise,
): ExerciseMuscleItem[] {
  if (!exercise.muscles) {
    throw new Error(
      `Muscles relation was not loaded for exercise ${exercise.id}.`,
    );
  }

  return exercise.muscles;
}

export function requireExerciseMuscle(
  exerciseMuscle: ExerciseMuscleItem,
): Muscle {
  if (!exerciseMuscle.muscle) {
    throw new Error(
      `Muscle relation was not loaded for exercise muscle ${exerciseMuscle.id}.`,
    );
  }

  return exerciseMuscle.muscle;
}

export function requireSessionExercise(
  sessionExercise: WorkoutSessionExercise,
): Exercise {
  if (!sessionExercise.exercise) {
    throw new Error(
      `Exercise relation was not loaded for workout session exercise ${sessionExercise.id}.`,
    );
  }

  return sessionExercise.exercise;
}
