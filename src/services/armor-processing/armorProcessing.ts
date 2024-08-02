import { ArmorItem } from "@/definitions/ArmorItem";
import { ArmorStatIdList, StatList } from "@/definitions/ArmorStat";
import { EArmorStatId } from "@/definitions/IdEnums";
import { ArmorStatToStatModsMapping, StatMod } from "@/definitions/Mod";
import { MAX_POTENTIAL_STAT_BOOST } from "@/lib/constants";
import { StatModGroup } from "@/services/idb/definitions";
import { getValueFromDB } from "@/services/idb/helpers";

export interface ProcessArmorParams {
  armorItems: ArmorItem[];
  desiredStats: StatList;
}

interface ExtractStatModsParams {
  rawCandidateMods: StatModGroup[];
  numArtificeItems: number;
  distances: Distance[];
}

const extractStatMods = (params: ExtractStatModsParams): StatMod[] | null => {
  const { rawCandidateMods, numArtificeItems } = params;
  const result: StatMod[] = [];
  let lowestSeenCost = Infinity;

  rawCandidateMods.forEach((candidateModGroup) => {
    let currentCost = 0;
    const currentStatMods: StatMod[] = [];
    // Sum the third item in each of the six candidateModGroup arrays
    // This is gross but is a very efficient way to sum the number of artifice mods
    const numUsedArtificeMods = candidateModGroup[0][2] + candidateModGroup[1][2] + candidateModGroup[2][2] + candidateModGroup[3][2] + candidateModGroup[4][2] + candidateModGroup[5][2];
    if (numUsedArtificeMods > numArtificeItems) {
      return;
    }

    for (let i = 0; i < candidateModGroup.length; i++) {
      const candidateArmorStatModCounts = candidateModGroup[i];
      const armorStatId = ArmorStatIdList[i]
      const [numMajorMods, numMinorMods, numArtificeMods] = candidateArmorStatModCounts;

      const majorMod = ArmorStatToStatModsMapping[armorStatId][0];
      const minorMod = ArmorStatToStatModsMapping[armorStatId][1];
      const artificeMod = ArmorStatToStatModsMapping[armorStatId][2];
      currentCost += majorMod.cost * numMajorMods;
      currentCost += minorMod.cost * numMinorMods;
      currentCost += artificeMod.cost * numArtificeMods;

      currentStatMods.push(...Array(numMajorMods).fill(majorMod));
      currentStatMods.push(...Array(numMinorMods).fill(minorMod));
      currentStatMods.push(...Array(numArtificeMods).fill(artificeMod));
    }
    if (currentCost < lowestSeenCost) {
      lowestSeenCost = currentCost;
      result.splice(0, result.length, ...currentStatMods);
    }
  })
  // If we never found a valid set of stat mods, return null
  return lowestSeenCost < Infinity ? result : null;
}

interface Distance {
  distance: number;
  armorStatId: EArmorStatId;
}


export default async function processArmor(params: ProcessArmorParams): Promise<StatMod[] | null> {
  const { armorItems, desiredStats } = params;
  const distances: Distance[] = desiredStats.map((d, i) => {
    return {
      distance: d,
      armorStatId: ArmorStatIdList[i]
    }
  });
  let numArtificeItems = 0;
  for (const armorItem of armorItems) {
    if (armorItem.isArtifice) {
      numArtificeItems++;
    }
    for (let i = 0; i < ArmorStatIdList.length; i++) {
      // TODO: This logic will need to be changed for zero wasted stats
      distances[i].distance = Math.max(0, distances[i].distance - armorItem.statList[i]);
    }
  }
  const totalDistance = distances.reduce((acc, val) => acc + val.distance, 0);
  if (totalDistance > MAX_POTENTIAL_STAT_BOOST) {
    // Impossible to achieve desired stats
    return null;
  }
  /// Sort distances from highest to lowest
  distances.sort((a, b) => b.distance - a.distance);

  // Pull the distance values out into a string key for idb
  const key = distances.map(d => d.distance).join('-');

  const rawCandidateMods = await getValueFromDB(key);

  return extractStatMods({
    rawCandidateMods,
    numArtificeItems,
    distances
  });
}