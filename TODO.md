# TODO

- Add keyboard focus
- migrate from Lucide icons -> AppIcon

# BUG

- some cardio shouldn't have distance (jump rope, boxing)
  Fix: add fieldConfigOverride in exercise-level
- text input still leaves blank space
- validate in-progress workout with zod
  exercise must have at least one set
- stop session timer when task is killed
- add empty state for recent workout
- add set row/header for all exercise category (Stretching, Powerlifting, etc.)
- workout in progress - add exercise ui padding bug
- exercise card show all muscle tags
  fix: show only 2-3

# OPTIONAL

- Migrate ExerciseTypeFieldConfig from frontend to db
- Allow > 1 workout schedule per day
- Add notification
  schedule workout, user afk
- update every fields to use FormField (there's ProfileFormField)
- make stickyFooter (pageLayout) follow keyboard
