export enum EquipmentCategory {
  FREE_WEIGHT = "free_weight",
  MACHINE = "machine",
  CABLE = "cable",
  BODYWEIGHT = "bodyweight",
  RESISTANCE = "resistance",
  STABILITY = "stability",
  RECOVERY = "recovery",
  ACCESSORY = "accessory",
  OTHER = "other",
}

export enum ExerciseMuscleRole {
  PRIMARY = "primary",
  SECONDARY = "secondary",
}

export interface Muscle {
  id: number;
  code: string;
  name: string;
}

export interface Equipment {
  id: number;
  code: string;
  name: string;
  category: EquipmentCategory;
}
