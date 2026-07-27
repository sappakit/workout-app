# TODO

- Add keyboard focus

# BUG

- some cardio shouldn't have distance (jump rope, boxing)
  Fix: add fieldConfigOverride in exercise-level
- text input still leaves blank space
- bug create schedule multiple times
- validate in-progress workout with zod
  exercise must have at least one set
- fix bug from 'npm run typecheck'
- stop session timer when task is killed

# OPTIONAL

- Migrate ExerciseTypeFieldConfig from frontend to db
- Allow > 1 workout schedule per day
- Add notification
  schedule workout, user afk
- update every fields to use FormField (there's ProfileFormField)
- use gluestack UI
- make stickyFooter (pageLayout) follow keyboard
