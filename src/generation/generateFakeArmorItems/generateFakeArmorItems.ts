import { ArmorItem } from "@/definitions/ArmorItem";
import buildFakeArmorItem from "@/generation/helpers/buildFakeArmorItem/buildFakeArmorItem";
import createLogger from '@/lib/logger';
import { stringify } from "@/lib/utils";
import { promises as fs } from 'fs';
import path from 'path';

const logger = createLogger('generateFakeArmorItems');

export default async function generateFakeArmorItems() {
  logger.info("Start...")
  const armorItems: ArmorItem[] = [];
  for (let i = 0; i < 700; i++) {
    armorItems.push(buildFakeArmorItem());
  }

  const filePath = path.join(...['.', 'src', 'generation', 'generated', 'fakeArmorItems.json']);

  logger.info('Writing fake armor items to file...');

  const data = stringify(armorItems);
  await fs.writeFile(path.resolve(filePath), data);

  logger.info('Done!');
}