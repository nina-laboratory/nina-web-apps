export type ExerciseInputType = "reps" | "time" | "custom";

export interface ExerciseDefinition {
  id: string;
  label: string;
  inputType: ExerciseInputType;
  defaultValues?: number[]; // For quick select buttons, e.g. [5, 10, 15] for reps
  image?: string;
}

export const EXERCISES: ExerciseDefinition[] = [
  {
    id: "scapular-stretch",
    label: "Scapular Stretch",
    inputType: "reps",
    defaultValues: [5, 10, 15],
    image: "/exercises/scapular-stretch.png",
  },
  {
    id: "pushups",
    label: "Pushups",
    inputType: "reps",
    defaultValues: [5, 10, 15, 20],
    image: "/exercises/pushups.png",
  },
  {
    id: "bycicle-crunches",
    label: "Bycicle Crunches",
    inputType: "reps",
    defaultValues: [10, 20, 30],
    image: "/exercises/bycicle-crunches.png",
  },
  {
    id: "reverse-crunches",
    label: "Reverse Crunches",
    inputType: "reps",
    defaultValues: [10, 20, 30],
    image: "/exercises/reverse-crunches.png",
  },
  {
    id: "squats",
    label: "Squats",
    inputType: "reps",
    defaultValues: [10, 20, 30],
    image: "/exercises/squats.png",
  },
  {
    id: "planks",
    label: "Planks",
    inputType: "time",
    defaultValues: [15, 30, 45, 60],
    image: "/exercises/planks.png",
  },
  {
    id: "calf-raises",
    label: "Calf Raises",
    inputType: "reps",
    defaultValues: [10, 15, 20, 30],
    image: "/exercises/calf-raises.png",
  },
  {
    id: "pull-ups",
    label: "Pull Ups",
    inputType: "reps",
    defaultValues: [1, 3, 5, 10],
    image: "/exercises/pull-ups.png",
  },
  {
    id: "running",
    label: "Running",
    inputType: "time",
    defaultValues: [15, 30, 45, 60],
    image: "/exercises/running.png",
  },
];
