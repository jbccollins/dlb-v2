import { ArmorItem } from "@/definitions/ArmorItem";
import { StatList } from "@/definitions/ArmorStat";
import { StatMod } from "@/definitions/Mod";

export interface WorkerInput {
  armorItems: ArmorItem[];
  desiredStats: StatList;
}

export interface WorkerOutput {
  mods: StatMod[];
}