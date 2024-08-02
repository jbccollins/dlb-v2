// This generates a json file that contains all the possible 
// ways to sum to a number using 6 integers.
// This is useful as it effectively generates all possible distances that can occur
// from a set of starting stat values to the set of possible desired stat tiers
import buildIntegerSumList from "@/generation/helpers/buildIntegerSumList/buildIntegerSumList";
import { MAX_POTENTIAL_STAT_BOOST } from "@/lib/constants";
import createLogger from '@/lib/logger';
import { stringify } from "@/lib/utils";
import { promises as fs } from 'fs';
import { gzip } from 'pako';
import path from 'path';

const logger = createLogger('generateIntegerSumLists');

export default async function generateIntegerSumLists() {
  // TODO: The logger does not handle objects correctly
  // logger.info('Start...', { derp: 'herp' });
  // logger.info({ derp: 'herp' });
  // logger.info('Test', [1, 2, 3], true, { derp: 'herp' })
  logger.info("Start...")
  const integerSumLists: Record<number, number[][]> = {};
  for (let i = 0; i <= MAX_POTENTIAL_STAT_BOOST; i++) {
    integerSumLists[i] = buildIntegerSumList(i, 6);
  }

  const filePath = path.join(...['.', 'src', 'generation', 'generated', 'integerSumLists.json']);
  const compressedFilePath = filePath + '.gz';

  logger.info('Writing integer sum lists to file...');

  const data = stringify(integerSumLists);
  await fs.writeFile(path.resolve(filePath), data);

  logger.info('Compressing integer sum lists...');
  const compressedData = gzip(data);
  await fs.writeFile(path.resolve(compressedFilePath), compressedData);

  logger.info('Done!');
}