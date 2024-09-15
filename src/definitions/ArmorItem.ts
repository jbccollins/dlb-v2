import { EArmorSlotId } from "./ArmorSlot";
import { StatList } from "./ArmorStat";

export interface ArmorItem {
  statList: StatList;
  isArtifice: boolean;
  armorSlot: EArmorSlotId;
  id: string;
}

export function getDefaultArmorItem(): ArmorItem {
  return {
    statList: [0, 0, 0, 0, 0, 0],
    isArtifice: false,
    armorSlot: EArmorSlotId.Head,
    id: "0",
  }
}