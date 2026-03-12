export enum EquipmentCategory {
  FREE_WEIGHT = "free_weight",
  MACHINE = "machine",
  BODYWEIGHT = "bodyweight",
  ACCESSORY = "accessory",
}

export interface Muscle {
  id: number;
  name: string;
}

export interface Equipment {
  id: number;
  name: string;
  category: EquipmentCategory;
}
