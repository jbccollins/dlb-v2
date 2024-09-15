import { ArmorItem } from "@/definitions/ArmorItem";
import { EArmorSlotId } from "@/definitions/ArmorSlot";
import fakeArmorItemsJSON from "@/generation/generated/fakeArmorItems.json";

const fakeArmorItems = fakeArmorItemsJSON as unknown as Record<string, ArmorItem>;


export const groupedArmorItems: Record<EArmorSlotId, ArmorItem[]> = Object.values(fakeArmorItems)
  .slice(0, 140)
  .reduce(
    (acc, armorItem) => {
      if (!acc[armorItem.armorSlot]) {
        acc[armorItem.armorSlot] = [];
      }
      acc[armorItem.armorSlot].push(armorItem);
      return acc;
    },
    {} as Record<EArmorSlotId, ArmorItem[]>
  );

export const numCombinations =
  groupedArmorItems[EArmorSlotId.Head].length *
  groupedArmorItems[EArmorSlotId.Arms].length *
  groupedArmorItems[EArmorSlotId.Chest].length *
  groupedArmorItems[EArmorSlotId.Legs].length;


