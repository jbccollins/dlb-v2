import buildModCombinations from "@/generation/helpers/buildModCombinations/buildModCombinations";
import createLogger from "@/lib/logger";
import { stringify } from "@/lib/utils";
import { promises as fs } from 'fs';
import path from "path";

const logger = createLogger('generateModCombinations');

export default async function generateModCombinations() {
  logger.info("Start...");

  const modCombinations = buildModCombinations();

  const paretoOptimalFilePath = path.join(...['.', 'src', 'generation', 'generated', 'paretoOptimalModCombinations.json']);
  const zeroWastedStatsFilePath = path.join(...['.', 'src', 'generation', 'generated', 'zeroWastedStatsModCombinations.json']);

  logger.info('Writing mod combinations to file...');

  await fs.writeFile(path.resolve(paretoOptimalFilePath), stringify(modCombinations.paretoOptimalRequiredModMapping));
  await fs.writeFile(path.resolve(zeroWastedStatsFilePath), stringify(modCombinations.zeroWastedStatsRequiredModMapping));

  logger.info("Done!");
}