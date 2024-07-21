import buildAllDistanceModCombinations from "@/generation/helpers/buildAllDistanceModCombinations/buildAllDistanceModCombinations";
import { MAX_POTENTIAL_STAT_BOOST, MIN_POTENTIAL_STAT_BOOST } from "@/lib/constants";
import createLogger from "@/lib/logger";
import { stringify } from "@/lib/utils";
import { promises as fs } from 'fs';
import path from "path";

const logger = createLogger('generateAllDistanceModCombinations');

export default async function generateAllDistanceModCombinations() {
  logger.info("Start...");
  for (let i = MIN_POTENTIAL_STAT_BOOST; i <= MAX_POTENTIAL_STAT_BOOST; i++) {



    const data = buildAllDistanceModCombinations(i);

    const filePath = path.join(...['.', 'src', 'generation', 'generated', 'allDistanceModCombinations', `${i}.json`]);

    logger.info(`Writing all mod combinations for distance ${i} to file...`);

    await fs.writeFile(path.resolve(filePath), stringify(data));
  }

  logger.info("Done!");
}