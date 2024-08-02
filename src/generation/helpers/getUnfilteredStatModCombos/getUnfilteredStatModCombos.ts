import { StatList } from "@/definitions/ArmorStat";
import { DistanceToModCombinationsMapping, GenericRequiredModCombo } from "@/generation/definitions";
import { NUM_ARMOR_STATS } from "@/lib/constants";
type GRMCA = GenericRequiredModCombo[];
type SixGRMCA = [GRMCA, GRMCA, GRMCA, GRMCA, GRMCA, GRMCA];


interface GetUnfilteredStatModCombosParams {
  distances: StatList;
  distanceToModCombinationsMapping: DistanceToModCombinationsMapping;
}

export default function getUnfilteredStatModCombos(
  {
    distances,
    distanceToModCombinationsMapping,
  }: GetUnfilteredStatModCombosParams
) {

  const allGenericCombos: SixGRMCA = [[], [], [], [], [], []];

  for (let i = 0; i < NUM_ARMOR_STATS; i++) {
    const distance = distances[i];

    if (distance === 0) {
      continue;
    }

    const key = distance as keyof DistanceToModCombinationsMapping;
    const genericCombos = distanceToModCombinationsMapping[key];
    // Break immediately. This means that there is no way to achieve the target stats.
    if (genericCombos.length === 0) {
      return null;
    }

    allGenericCombos[i] = genericCombos;
  }

  return allGenericCombos;
};