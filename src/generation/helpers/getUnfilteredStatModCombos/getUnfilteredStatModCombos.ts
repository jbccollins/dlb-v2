import { ArmorStatIdList, ArmorStatMapping } from "@/definitions/ArmorStat";
import { EArmorStatId } from "@/definitions/IdEnums";
import { DistanceToModCombinationsMapping, GenericRequiredModCombo } from "@/generation/definitions";


interface GetUnfilteredStatModCombosParams {
  distances: ArmorStatMapping;
  distanceToModCombinationsMapping: DistanceToModCombinationsMapping;
}

export default function getUnfilteredStatModCombos(
  {
    distances,
    distanceToModCombinationsMapping,
  }: GetUnfilteredStatModCombosParams
) {

  const allGenericCombos: Record<EArmorStatId, GenericRequiredModCombo[]> = {
    [EArmorStatId.Mobility]: [],
    [EArmorStatId.Resilience]: [],
    [EArmorStatId.Recovery]: [],
    [EArmorStatId.Discipline]: [],
    [EArmorStatId.Intellect]: [],
    [EArmorStatId.Strength]: [],
  };

  for (let i = 0; i < ArmorStatIdList.length; i++) {
    const armorStatId = ArmorStatIdList[i];
    const distance = distances[armorStatId];

    if (distance === 0) {
      continue;
    }

    const key = distance as keyof DistanceToModCombinationsMapping;
    const genericCombos = distanceToModCombinationsMapping[key];
    // Break immediately. This means that there is no way to achieve the target stats.
    if (genericCombos.length === 0) {
      return null;
    }

    allGenericCombos[armorStatId] = genericCombos;
  }

  return allGenericCombos;
};