import { ArmorStatIdList, ArmorStatMapping } from "@/definitions/ArmorStat";
import { DistanceToModCombinationsMapping, getDefaultStatModCombo, StatModCombo } from "@/generation/definitions";
import getUnfilteredStatModCombos from "@/generation/helpers/getUnfilteredStatModCombos/getUnfilteredStatModCombos";
import { NUM_ARMOR_PIECES } from "@/lib/constants";

type GetAllValidStatModCombosParams = {
  distances: ArmorStatMapping,
  distanceToModCombinationsMapping: DistanceToModCombinationsMapping;
};

export const getAllValidStatModCombos = ({
  distances,
  distanceToModCombinationsMapping,
}: GetAllValidStatModCombosParams) => {
  const unfilteredStatModCombos = getUnfilteredStatModCombos({
    distances,
    distanceToModCombinationsMapping,
  });

  if (unfilteredStatModCombos === null) {
    return null;
  }

  let result: StatModCombo[] = [getDefaultStatModCombo()];

  for (let i = 0; i < ArmorStatIdList.length; i++) {
    const armorStatId = ArmorStatIdList[i];
    const unfilteredStatModCombo = unfilteredStatModCombos[armorStatId];
    // If we don't need any mods for this stat, skip it
    if (unfilteredStatModCombo.length === 0) {
      continue;
    }
    const newResult: StatModCombo[] = [];
    result.forEach((establishedCombo) => {
      let totalEstablishedStatMods = 0;
      let totalEstablishedArtificeMods = 0;
      ArmorStatIdList.forEach((armorStatId) => {
        const { numMajorMods, numMinorMods, numArtificeMods } =
          establishedCombo[armorStatId];
        totalEstablishedStatMods += numMajorMods + numMinorMods;
        totalEstablishedArtificeMods += numArtificeMods;
      });
      unfilteredStatModCombo.forEach((potentialAddition) => {
        const { numMajorMods, numMinorMods, numArtificeMods } =
          potentialAddition;
        const newStatModCount =
          totalEstablishedStatMods + numMajorMods + numMinorMods;
        const newArtificeModCount =
          totalEstablishedArtificeMods + numArtificeMods;
        if (
          newStatModCount > NUM_ARMOR_PIECES ||
          newArtificeModCount > NUM_ARMOR_PIECES
        ) {
          return;
        }
        newResult.push({
          ...establishedCombo,
          [armorStatId]: potentialAddition,
        });
      });
    });
    // If the result ever becomes empty, we know it's impossible to achieve the desired stats
    // so we can prune the search early
    if (newResult.length === 0) {
      return null;
    }
    // Prune as we go
    result = newResult;
  }
  return result;
}