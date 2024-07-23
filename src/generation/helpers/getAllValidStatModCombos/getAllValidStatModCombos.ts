import { DistanceToModCombinationsMapping, getDefaultGenericRequiredModCombos, SixGRMC, StatList } from "@/generation/definitions";
import getUnfilteredStatModCombos from "@/generation/helpers/getUnfilteredStatModCombos/getUnfilteredStatModCombos";
import { NUM_ARMOR_PIECES, NUM_ARMOR_STATS } from "@/lib/constants";
import { produce } from "immer";

type GetAllValidStatModCombosParams = {
  distances: StatList,
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

  let result: SixGRMC[] = [getDefaultGenericRequiredModCombos()]

  for (let armorStatIndex = 0; armorStatIndex < NUM_ARMOR_STATS; armorStatIndex++) {
    const unfilteredStatModCombo = unfilteredStatModCombos[armorStatIndex];
    // If we don't need any mods for this stat, skip it
    if (unfilteredStatModCombo.length === 0) {
      continue;
    }
    const newResult: SixGRMC[] = [];
    result.forEach((establishedCombo) => {
      let totalEstablishedStatMods = 0;
      let totalEstablishedArtificeMods = 0;
      for (let j = 0; j < establishedCombo.length; j++) {
        const { numMajorMods, numMinorMods, numArtificeMods } =
          establishedCombo[j];
        totalEstablishedStatMods += numMajorMods + numMinorMods;
        totalEstablishedArtificeMods += numArtificeMods;
      }
      unfilteredStatModCombo.forEach((potentialAddition) => {
        const { numMajorMods, numMinorMods, numArtificeMods, exactStatPoints } =
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
        // Merge the established combo's stats at armorStatIndex with the potential addition
        // Note that this is REALLY slow due to the use of immer. It can be much faster if we
        // just use a for loop and manually copy the values over but idfc since this is only run once
        const newCombo = produce(establishedCombo, (draft) => {
          draft[armorStatIndex] = {
            numArtificeMods,
            numMajorMods,
            numMinorMods,
            exactStatPoints,
          };
        });
        newResult.push(newCombo);
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