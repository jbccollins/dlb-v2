import { ArmorStatIdList } from '@/definitions/ArmorStat';
import { DistanceToIntegerSumListsMappping, integerSumLists, paretoOptimalModCombinations } from '@/generation/definitions';

import { getAllValidStatModCombos } from '@/generation/helpers/getAllValidStatModCombos/getAllValidStatModCombos';
import { MAX_POTENTIAL_STAT_BOOST, MIN_POTENTIAL_STAT_BOOST } from '@/lib/constants';
import { getArmorStatMappingFromStatList } from '@/lib/utils';

export default function buildAllDistanceModCombinations(distance: number) {
  if (distance < MIN_POTENTIAL_STAT_BOOST || distance > MAX_POTENTIAL_STAT_BOOST) {
    throw new Error(`Invalid distance: ${distance}`);
  }
  const result: Record<string, number[][][]> = {};

  const integerSumListItems = integerSumLists[distance as keyof DistanceToIntegerSumListsMappping];
  for (let j = 0; j < integerSumListItems.length; j++) {
    const integerSumListItem = integerSumListItems[j];

    const resultKey = integerSumListItem.join('-');
    result[resultKey] = [];

    const allValidStatModCombos = getAllValidStatModCombos({
      distances: getArmorStatMappingFromStatList(integerSumListItem),
      distanceToModCombinationsMapping: paretoOptimalModCombinations
    });

    if (allValidStatModCombos === null) {
      delete result[resultKey];
      continue;
    }

    allValidStatModCombos.forEach((statModCombo) => {
      const condensedStatModCombo: number[][] = [];
      ArmorStatIdList.forEach((armorStatId) => {
        const { numMajorMods, numMinorMods, numArtificeMods } = statModCombo[armorStatId];
        condensedStatModCombo.push([numMajorMods, numMinorMods, numArtificeMods]);
      });
      result[resultKey].push(condensedStatModCombo);
    })
  }

  return result;
}