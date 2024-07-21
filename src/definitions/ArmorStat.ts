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
