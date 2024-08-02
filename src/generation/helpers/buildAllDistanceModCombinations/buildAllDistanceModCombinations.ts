import { StatList } from '@/definitions/ArmorStat';
import { DistanceToIntegerSumListsMappping, integerSumLists, paretoOptimalModCombinations } from '@/generation/definitions';

import { getAllValidStatModCombos } from '@/generation/helpers/getAllValidStatModCombos/getAllValidStatModCombos';
import { MAX_POTENTIAL_STAT_BOOST, MIN_POTENTIAL_STAT_BOOST } from '@/lib/constants';

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
      distances: integerSumListItem as StatList,
      distanceToModCombinationsMapping: paretoOptimalModCombinations
    });

    if (allValidStatModCombos === null) {
      delete result[resultKey];
      continue;
    }

    allValidStatModCombos.forEach((statModCombo) => {
      const condensedStatModCombo: number[][] = [];
      statModCombo.forEach((statModComboItem) => {
        const { numMajorMods, numMinorMods, numArtificeMods } = statModComboItem;
        condensedStatModCombo.push([numMajorMods, numMinorMods, numArtificeMods]);
      })
      result[resultKey].push(condensedStatModCombo);
    })
  }

  return result;
}