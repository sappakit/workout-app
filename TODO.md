# TODO

- Add keyboard focus
- Migrate ExerciseTypeFieldConfig from frontend to db

# BUG

- some cardio shouldn't have distance (jump rope, boxing)
  Fix: add fieldConfigOverride in exercise-level

- Extract 'exercise' part from ExerciseCardBase so we can send only 'exercise' instead of whole 'WorkoutExerciseItem' (or make different ui for add exercise)
- text input still leaves blank space