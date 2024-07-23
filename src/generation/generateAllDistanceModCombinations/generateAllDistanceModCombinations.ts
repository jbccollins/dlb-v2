import buildAllDistanceModCombinations from "@/generation/helpers/buildAllDistanceModCombinations/buildAllDistanceModCombinations";
import { MAX_POTENTIAL_STAT_BOOST, MIN_POTENTIAL_STAT_BOOST } from "@/lib/constants";
import createLogger from "@/lib/logger";
import { stringify } from "@/lib/utils";
import { promises as fs } from 'fs';
import { gzip } from 'pako';
import path from "path";

const logger = createLogger('generateAllDistanceModCombinations');

type Analytics = {
  counts: Record<number, { numKeys: number, numValues: number }>;
  totalNumKeys: number;
  totalNumValues: number;
}

const analytics: Analytics = {
  counts: {},
  totalNumKeys: 0,
  totalNumValues: 0,
};

export default async function generateAllDistanceModCombinations() {
  logger.info("Start...");
  for (let i = MIN_POTENTIAL_STAT_BOOST; i <= MAX_POTENTIAL_STAT_BOOST; i++) {

    const _data = buildAllDistanceModCombinations(i);
    let numValues = 0;
    Object.values(_data).forEach((value) => {
      numValues += value.length;
    });
    const numKeys = Object.keys(_data).length;

    analytics.counts[i] = {
      numKeys,
      numValues,
    }

    analytics.totalNumKeys += numKeys;
    analytics.totalNumValues += numValues;
    const data = stringify(_data);
    console.log(`Distance: ${i} | Num Keys: ${numKeys} | Num Values: ${numValues}`);

    const filePath = path.join(...['.', 'src', 'generation', 'generated', 'allDistanceModCombinations', `${i}.json`]);
    const compressedFilePath = filePath + '.gz';

    logger.info(`Writing all mod combinations for distance ${i} to file...`);

    await fs.writeFile(path.resolve(filePath), data);

    logger.info(`Compressing all mod combinations for distance ${i}...`);
    const compressedData = gzip(data);
    await fs.writeFile(path.resolve(compressedFilePath), compressedData);
  }

  const analyticsFilePath = path.join(...['.', 'src', 'generation', 'generated', 'allDistanceModCombinations', 'analytics.json']);
  const analyticsData = stringify(analytics);
  await fs.writeFile(path.resolve(analyticsFilePath), analyticsData);

  logger.info("Done!");
}