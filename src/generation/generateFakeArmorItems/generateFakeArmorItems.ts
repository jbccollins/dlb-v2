import { ArmorItem } from "@/definitions/ArmorItem";
import { EArmorSlotId } from "@/definitions/ArmorSlot";
import buildFakeArmorItem from "@/generation/helpers/buildFakeArmorItem/buildFakeArmorItem";
import createLogger from '@/lib/logger';
import { stringify } from "@/lib/utils";
import { promises as fs } from 'fs';
import path from 'path';

const logger = createLogger('generateFakeArmorItems');

const ARMOR_SLOTS: EArmorSlotId[] = [EArmorSlotId.Head, EArmorSlotId.Chest, EArmorSlotId.Arms, EArmorSlotId.Legs];

export default async function generateFakeArmorItems() {
  logger.info("Start...")
  const armorItems: Record<string, ArmorItem> = {};
  for (let i = 0; i < 200; i++) {
    for (const armorSlot of ARMOR_SLOTS) {
      const armorItem = buildFakeArmorItem({ armorSlot });
      armorItems[armorItem.id] = armorItem;
    }
  }

  const filePath = path.join(...['.', 'src', 'generation', 'generated', 'fakeArmorItems.json']);

  logger.info('Writing fake armor items to file...');

  const data = stringify(armorItems);
  await fs.writeFile(path.resolve(filePath), data);

  logger.info('Done!');
}