# TODO

- Add keyboard focus

# BUG

- some cardio shouldn't have distance (jump rope, boxing)
  Fix: add fieldConfigOverride in exercise-level

- text input still leaves blank space
- when on WorkoutExercise card editing state, shouldn't be able to leave the page
  Fix: disable button or alert user when leaving page or replace edit WorkoutExercise ui field with bottomSheet

- Three column input (Estimated duration) too small on ios making it show as '...'
- Allow duplicate exercise in one workout
- Right now, star/cancel session is getting session from today schedule only - so user can't choose other program to work

# OPTIONAL

- Migrate ExerciseTypeFieldConfig from frontend to db
- Tabs: Home, Workout, Stats, History, Profile
- Allow > 1 workout schedule per day
