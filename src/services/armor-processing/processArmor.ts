import { EArmorSlotId } from "@/definitions/ArmorSlot";
import { StatList } from "@/definitions/ArmorStat";
import { StatMod } from "@/definitions/Mod";
import { groupedArmorItems } from "./armor";
import processArmorItemsCombination from "./processArmorItemsCombination";

interface ProcessArmorParams {
  desiredStats: StatList;
}

export default async function processArmor(params: ProcessArmorParams): Promise<Record<string, StatMod[]> | null> {
  const { desiredStats } = params;
  const result: Record<string, StatMod[]> = {};
  groupedArmorItems[EArmorSlotId.Head].forEach(async (head) => {
    groupedArmorItems[EArmorSlotId.Arms].forEach(async (arms) => {
      groupedArmorItems[EArmorSlotId.Chest].forEach(async (chest) => {
        groupedArmorItems[EArmorSlotId.Legs].forEach(async (legs) => {
          const statMods = await processArmorItemsCombination({
            armorItems: [head, arms, chest, legs],
            desiredStats,
          });
          if (statMods === null) {
            return;
          }
          result[`${head.id}-${arms.id}-${chest.id}-${legs.id}`] = statMods;
        });
      });
    });
  });

  // If we never found a valid set of stat mods, return null
  if (Object.keys(result).length === 0) {
    return null;
  }
  return result;
}