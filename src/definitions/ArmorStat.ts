import { ValidateEnumList } from "@/lib/utils";
import { EArmorStatId } from "./IdEnums";

export type ArmorStatMapping = {
  [EArmorStatId.Mobility]: number;
  [EArmorStatId.Resilience]: number;
  [EArmorStatId.Recovery]: number;
  [EArmorStatId.Discipline]: number;
  [EArmorStatId.Intellect]: number;
  [EArmorStatId.Strength]: number;
};

export const ArmorStatIdList = ValidateEnumList(Object.values(EArmorStatId), [
  EArmorStatId.Mobility,
  EArmorStatId.Resilience,
  EArmorStatId.Recovery,
  EArmorStatId.Discipline,
  EArmorStatId.Intellect,
  EArmorStatId.Strength,
]);

export const getDefaultArmorStatMapping = (): ArmorStatMapping => ({
  [EArmorStatId.Mobility]: 0,
  [EArmorStatId.Resilience]: 0,
  [EArmorStatId.Recovery]: 0,
  [EArmorStatId.Discipline]: 0,
  [EArmorStatId.Intellect]: 0,
  [EArmorStatId.Strength]: 0,
});

export type StatList = [number, number, number, number, number, number];

export const sumStatList = (statList: StatList): number => {
  return statList.reduce((acc, val) => acc + val, 0);
}

export const getDefaultStatList = (): StatList => [0, 0, 0, 0, 0, 0];

const ArmorStatIdToIndexMapping = {
  [EArmorStatId.Mobility]: 0,
  [EArmorStatId.Resilience]: 1,
  [EArmorStatId.Recovery]: 2,
  [EArmorStatId.Discipline]: 3,
  [EArmorStatId.Intellect]: 4,
  [EArmorStatId.Strength]: 5,
} as const;

export const getArmorStatIndex = (armorStatId: EArmorStatId): number => {
  return ArmorStatIdToIndexMapping[armorStatId];
}

export const getArmorStatId = (index: number): EArmorStatId => {
  return ArmorStatIdList[index];
}

export enum EArmorStatIndex {
  Mobility = 0,
  Resilience = 1,
  Recovery = 2,
  Discipline = 3,
  Intellect = 4,
  Strength = 5,
}