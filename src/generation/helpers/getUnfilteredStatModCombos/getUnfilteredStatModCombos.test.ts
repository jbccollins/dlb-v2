import { ArmorStatIdList, getDefaultArmorStatMapping } from "@/definitions/ArmorStat";
import { EArmorStatId } from "@/definitions/IdEnums";

import { paretoOptimalModCombinations, zeroWastedStatsModCombinations } from "@/generation/definitions";
import { tester } from "@/tests";
import { produce } from "immer";
import getUnfilteredStatModCombos from "./getUnfilteredStatModCombos";


const testFunc = tester('getUnfilteredStatModCombos', getUnfilteredStatModCombos);
const defaultInput: Parameters<typeof getUnfilteredStatModCombos> = [
  {
    distances: getDefaultArmorStatMapping(),
    distanceToModCombinationsMapping: paretoOptimalModCombinations,
  },
];

const defaultOutput: ReturnType<typeof getUnfilteredStatModCombos> = {
  [EArmorStatId.Mobility]: [],
  [EArmorStatId.Resilience]: [],
  [EArmorStatId.Recovery]: [],
  [EArmorStatId.Discipline]: [],
  [EArmorStatId.Intellect]: [],
  [EArmorStatId.Strength]: [],
};

testFunc({
  name: 'returns empty arrays for default input',
  input: defaultInput,
  outputResolver: (output) => {
    ArmorStatIdList.forEach((statId) => {
      expect(output![statId]).toEqual(defaultOutput[statId]);
    });
  },
});

// Adjusting defaultInput for a target stat shortfall of 5 in mobility
const inputWithMobilityShortfall = produce(defaultInput, (draft) => {
  draft[0].distances[EArmorStatId.Mobility] = 5;
});

const outputWithMobilityShortfall = produce(defaultOutput, (draft) => {
  draft[EArmorStatId.Mobility] = [
    {
      exactStatPoints: 5,
      numArtificeMods: 0,
      numMajorMods: 0,
      numMinorMods: 1,
    },
    {
      exactStatPoints: 6,
      numArtificeMods: 2,
      numMajorMods: 0,
      numMinorMods: 0,
    },
  ];
});

testFunc({
  name: 'handles a target stat shortfall of 5 mobility',
  input: inputWithMobilityShortfall,
  outputResolver: (output) => {
    ArmorStatIdList.forEach((statId) => {
      // Check if output contains all expected items, regardless of order
      expect(output![statId]).toEqual(expect.arrayContaining(outputWithMobilityShortfall[statId]));
      // Additionally, check if there are no extra items in the output
      expect(output![statId].length).toEqual(outputWithMobilityShortfall[statId].length);
    });
  },
});

// Adjusting defaultInput for a target stat shortfall of 5 in mobility
const inputWithUnachievableZeroWastedStats = produce(defaultInput, (draft) => {
  draft[0].distances[EArmorStatId.Mobility] = 58;
  draft[0].distanceToModCombinationsMapping = zeroWastedStatsModCombinations
});

testFunc({
  name: 'handles the case where it is impossible to achieve the target stats',
  input: inputWithUnachievableZeroWastedStats,
  outputResolver: (output) => {
    expect(output).toBeNull();
  },
});